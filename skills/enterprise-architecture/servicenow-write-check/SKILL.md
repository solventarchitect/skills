---
name: servicenow-write-check
description: "Verify ServiceNow Table API reads and writes instead of trusting the status code. Checks that a field exists with a partition test, writes values in the form the field stores, reads every write back, and probes access with a real filtered query. Use before a load, an update script, a report or an agent action against a ServiceNow table, and when a write returned success but the data did not change."
---

# ServiceNow write check

A success code tells you the request was accepted. Only a read-back tells you what was stored. This skill is the procedure for not trusting the first without the second.

Instances are configured differently. Treat every rule here as a test to run on your instance, not as a law of the platform.

## Before you start

- Work on a non-production instance first. Never write to production unless the user has asked for that specific write. A clean dry run is not permission.
- Use the credentials the user has already set up. Never print, log or store a password, a token or a session cookie.
- Know the exact table and field names you intend to use, and where each name came from.

## 1. Does the field exist?

A field can accept every write, return success and not exist. It lives in a spreadsheet, an export template or an integration mapping, and the platform discards what is written to it.

1. **Read the dictionary, not the template.** Confirm the field is defined for the class of the records you will write: on that table or inherited from a parent. A field defined only on a sibling or a child class does not count.
2. **Run the partition test** with the Aggregate API:

```
total     = GET /api/now/stats/<table>?sysparm_count=true
empty     = GET /api/now/stats/<table>?sysparm_count=true&sysparm_query=<field>ISEMPTY
not_empty = GET /api/now/stats/<table>?sysparm_count=true&sysparm_query=<field>ISNOTEMPTY

PASS    empty + not_empty == total, and the two are not both equal to total
FAIL    empty == total and not_empty == total   (the condition was ignored: a phantom field)
FAIL    empty + not_empty != total              (the condition was rejected or the query is wrong)
UNKNOWN total == 0                              (an empty table proves nothing; test on a table with rows)
```

A real field partitions the table. A phantom field returns every row for "is empty" and every row for "is not empty", because the platform ignores a condition it does not recognise. An instance can also be set to return no rows for an invalid query; then both counts are 0, which fails the sum.

Stop on FAIL. Do not write to a field that failed, and do not report on it.

## 2. What value does the field store?

- **Choices.** The label in the UI can differ from the stored value. Take valid values from records already in use (tally the distinct values), write the stored value, and expect the label on read-back. An invalid choice can return 201 and be stored empty.
- **References.** Set a reference by `sys_id`. Look the id up first if you have to. Setting it by display value is convenient and fragile: a name containing an ampersand can return 200 and store nothing.
- **Currency.** Send the currency code and the amount together, such as `USD;1500`. A bare number can return 200 and store an empty field.
- **Vocabulary.** When your framework's names differ from the platform's, keep one translation table (framework name and value to platform field and stored value) and make every loader use it.

## 3. Write one, read it back

1. Write **one** record.
2. Read the same record back, asking for the fields you wrote, with both stored and display values (`sysparm_fields=<fields>&sysparm_display_value=all`).
3. Compare what you sent with what is stored, field by field.
4. Only if every field matches, run the batch. Read back every write in the batch as well.
5. Stop at the first mismatch. Report it; do not retry with a guess.

## 4. Reads lie too

Before trusting an empty or a small result, ask whether the query could have returned anything at all.

- **Class filters.** Querying a parent table returns its child classes. Filtering on `sys_class_name=<parent>` does not: it is an exact match, so when most records are stored as a subclass it returns almost nothing. Query the parent table, or use `sys_class_nameIN<parent>,<child classes>`.
- **Access has four states, not two.** Probe with a real filtered query and a row limit (`sysparm_query=...&sysparm_limit=1`), not with a count or a bare read, and record which state you found:
  - *Readable*: counts work, rows return, filters work.
  - *Count-only*: the aggregate returns a count, a table read returns an empty list.
  - *Readable, not filterable*: a bare read returns 200, any query returns 403.
  - *Denied*: 403 on everything.
- **`400 Invalid table`** is a naming error, not a permission finding.

## Report

```
SERVICENOW WRITE CHECK - <sub-production / production> - <table>
Access: readable / count-only / readable, not filterable / denied

Field     Exists (partition)         Sent        Stored      Display     Match
<field>   PASS e=<n> ne=<n> t=<n>    <value>     <value>     <label>     yes / NO

Batch: <n> written, <n> read back, <n> mismatches
Stopped at: <record and field, or "completed">
Not checked: <anything you could not test, and why>
```

## Rules

- Treat a success code as a claim. A write you did not read back is not done.
- One record before any batch.
- Never write to production without the user's instruction for that write.
- Do not explain away a mismatch. Report what was sent, what was stored and the status code, and stop.
- This skill uses the public Table and Aggregate APIs only. It does not change instance configuration, properties or access controls.
