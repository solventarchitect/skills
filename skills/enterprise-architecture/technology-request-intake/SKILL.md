---
name: technology-request-intake
description: "Review a technology request (a 'can we buy X?') the same way every time. Asks six questions, declares one primary technical class to expose overlap with tools already owned, decides which records the request creates (software product, business application, technology service or none), and writes the review summary back onto the request. Use for software, SaaS and tool requests, renewals that change scope, and proof-of-concept requests."
---

# Technology request intake

Technology requests arrive as "can we buy X?". Answered one at a time, by whoever happens to be free, they produce inconsistent decisions, three tools that do the same job, and evidence nobody can find a year later. This skill asks every request the same questions and writes the answers where the request lives.

It produces a recommendation for a person to decide. It does not approve, purchase or create records.

## What you need

- The request: what is asked for, by whom, and for what purpose.
- The portfolio to check against: the approved products and standards, the application inventory with each application's technical class, and the capability model.
- Any published standards or patterns that might already cover the request.

If one of these is missing, say so and mark the answers that depend on it "not checked". Never invent an incumbent, a standard or a capability.

## Step 0: is it real?

Confirm the request has a sponsor and a budget. Without both, stop and send it back with that question. A request without either is a wish, and reviewing wishes costs architecture time.

## Step 1: the six questions

1. **Terminology.** What is it, really? Give the plain technical term, the service model (SaaS, PaaS, IaaS or on-premises) and the technology domain. The vendor's marketing name is not terminology.
2. **Standards.** Does an existing standard, approved product or pattern already cover it? If yes: how well does the request conform (full, partial, non-conformant), and which guardrails come with it? If no: what is the gap, which interim controls apply, and who should write the standard?
3. **Technical class.** What does it do, technically? Declare **one** primary technical class. List the tools already in that branch. Give a verdict: net-new, or overlaps a named incumbent and why.
4. **Business capability.** Which business capability does it support, at the lowest level you can map?
5. **Fitness.** Security, scalability, cost and fit, ending in a recommendation someone could act on: approve, approve with conditions, reject or defer.
6. **Stakeholders.** Who has to review, approve or contribute, even when a standard already exists?

Question 3 does the heavy lifting. A request in a crowded branch has to explain why the incumbents will not do. A request in an empty branch is net-new and can say so. Do not accept two primary classes: pick the one that describes what the tool is, and note the other as secondary.

## Step 2: why and when

The six questions cover what, how, who and where. Ask these two by name:

- **Why buy instead of reuse?** The overlap verdict from question 3 is the evidence. A weak why means reuse before buy.
- **When?** The budget window, and the end-of-life date of any incumbent the request would replace.

## Step 3: which records does it create?

Decide at review, so whoever fulfils the request does not have to guess. The record names follow the Common Service Data Model; map them to your own tool's terms.

1. A software product we get, install or subscribe to: a **product record**, unless one exists. SaaS and free tools included.
2. A business outcome for business users, not for other IT teams: a **Business Application**, unless one exists.
3. A platform other IT teams consume (backup, compute, network, identity, a container platform): a **Technology Service**, not a Business Application.
4. A Dev, QA or Production copy of an application you already have: a **service instance** under the existing application.
5. A module of a bigger application: a **component of the parent**.
6. A single-user or temporary exception: a **product record only**, marked as an exception.

Rules that go with it:

- Check "already exists" through what the request references first, then the product record, and the name last. Name searches fail: utilities get filed under what they do, and vendors rename suites.
- When a Business Application is needed, propose it at approval as pre-operational, with a target go-live date, so the owner and capabilities are set before go-live.
- A tool already in use with no decision about its future still gets a disposition: tolerate until the next renewal by default, or migrate with the target named.
- No certified product without a manufacturer, or licences and contracts cannot reconcile.

## Step 4: write the review summary

Put it on the request itself. A material decision also earns a decision record of its own.

```
ARCHITECTURE REVIEW - <technology> (<request id>)
Sponsor and budget: <who> | <yes / no>

1. Terminology: <plain term> | <SaaS/PaaS/IaaS/on-prem> | <domain>
2. Standards: <standard or "none"> | full / partial / non-conformant
   Guardrails: <...>   Gap and interim controls: <...>
3. Technical class: <ONE primary class>
   Incumbents in this branch: <list, "none" or "not checked">
   Verdict: net-new / overlaps <incumbent> because <...>
4. Business capability: <lowest-level capability>
5. Fitness: security <...> | scale <...> | cost <...> | fit <...>
   Recommendation: approve / approve with conditions / reject / defer
6. Stakeholders: <groups that must review or approve>
Why buy, not reuse: <...>
When: budget window <...> | incumbent end of life <...>
Records created: software product yes/no | business application yes/no | other <...>
Decision and next steps: <left for the approver>
```

## Rules

- The recommendation is yours; the decision is the approver's. Leave the decision line for them.
- Every incumbent, standard and capability you name must come from the material you were given. Mark anything else "not checked" and say what would be needed to check it.
