// ui-critique probe: runs inside the page (page.evaluate). Measures layout facts the rubric asks about.
// Returns plain JSON. No network, no page changes.
(() => {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const docH = Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0);
  const sx = window.scrollX, sy = window.scrollY;

  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };

  // Elements that own text directly (not just via children)
  const textEls = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  for (let el = walker.currentNode; el; el = walker.nextNode()) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG'].includes(el.tagName)) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (own && visible(el)) textEls.push(el);
  }

  const box = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + sx, y: r.top + sy, w: r.width, h: r.height }; };
  // Box of the element's own text (not its block box, which spans the full width)
  const textBox = (el) => {
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      for (const q of range.getClientRects()) {
        if (q.width < 1) continue;
        l = Math.min(l, q.left); t = Math.min(t, q.top); r = Math.max(r, q.right); b = Math.max(b, q.bottom);
      }
    }
    return l === Infinity ? null : { x: l + sx, y: t + sy, w: r - l, h: b - t };
  };

  // Font sizes in use
  const sizes = new Map();
  for (const el of textEls) {
    const s = Math.round(parseFloat(getComputedStyle(el).fontSize));
    sizes.set(s, (sizes.get(s) || 0) + 1);
  }

  // Distinct left edges of block-level text (rounded to 8px), ignoring inline runs inside paragraphs
  const blockish = textEls.filter((el) => {
    const d = getComputedStyle(el).display;
    return d !== 'inline' && d !== 'contents';
  });
  // Left edges of left/start-aligned text only; centred text is measured separately
  const edges = new Map();
  for (const el of blockish) {
    const ta = getComputedStyle(el).textAlign;
    if (ta !== 'left' && ta !== 'start' && ta !== 'justify') continue;
    const tb = textBox(el);
    if (!tb) continue;
    const x = Math.round(tb.x / 8) * 8;
    edges.set(x, (edges.get(x) || 0) + 1);
  }
  const edgeList = [...edges.entries()].sort((a, b) => b[1] - a[1]);

  // Centred text share
  const centred = blockish.filter((el) => getComputedStyle(el).textAlign === 'center').length;

  // Headline lines
  const h1 = [...document.querySelectorAll('h1')].find(visible);
  let h1Lines = null, h1Text = null;
  if (h1) {
    const cs = getComputedStyle(h1);
    let lh = parseFloat(cs.lineHeight);
    if (Number.isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.2;
    h1Lines = Math.max(1, Math.round(h1.getBoundingClientRect().height / lh));
    h1Text = h1.innerText.trim().slice(0, 120);
  }

  // Content boxes: text blocks plus media and controls
  const media = [...document.querySelectorAll('img,svg,video,canvas,picture,iframe,button,input,select,textarea')]
    .filter(visible);
  const content = [...blockish.map(textBox).filter(Boolean), ...media.map(box)].filter((b) => b.w > 0);

  // Empty vertical bands taller than half a viewport
  const spans = content.map((b) => [b.y, b.y + b.h]).sort((a, b) => a[0] - b[0]);
  const gaps = [];
  let reach = 0;
  for (const [top, bottom] of spans) {
    if (top - reach > vh * 0.5) gaps.push({ from: Math.round(reach), to: Math.round(top), height: Math.round(top - reach) });
    reach = Math.max(reach, bottom);
  }
  if (docH - reach > vh * 0.5) gaps.push({ from: Math.round(reach), to: docH, height: Math.round(docH - reach) });

  // Page margins: the frame, from element boxes (text is ragged on the right, so its own box would mislead).
  // Full-bleed wrappers (98%+ of the viewport) are skipped; they say nothing about the content frame.
  const frame = [...blockish, ...media].map(box).filter((b) => b.w > 0 && b.w < vw * 0.98);
  const lefts = frame.map((b) => b.x).filter((x) => x >= 0);
  const rights = frame.map((b) => vw - (b.x + b.w)).filter((x) => x >= 0);
  const marginLeft = lefts.length ? Math.round(Math.min(...lefts)) : null;
  const marginRight = rights.length ? Math.round(Math.min(...rights)) : null;

  // Small tracked uppercase captions
  const caps = textEls.filter((el) => {
    const cs = getComputedStyle(el);
    const ls = parseFloat(cs.letterSpacing);
    return cs.textTransform === 'uppercase' && parseFloat(cs.fontSize) < 13 && !Number.isNaN(ls) && ls > 0.5;
  }).length;

  // Tap targets under 24x24 CSS px (WCAG 2.2 SC 2.5.8, minimum)
  const targets = [...document.querySelectorAll('a[href],button,input,select,textarea,[role="button"],[tabindex]:not([tabindex="-1"])')]
    .filter(visible)
    .filter((el) => { const r = el.getBoundingClientRect(); return r.width < 24 || r.height < 24; })
    .filter((el) => getComputedStyle(el).display !== 'inline'); // inline links in running text are exempt
  const smallTargets = targets.length;

  // Images without alt attribute
  const imgNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt')).length;

  // Visible text and labels for the copy lint (done in Node)
  const buttons = [...document.querySelectorAll('a,button,[role="button"]')].filter(visible)
    .map((el) => el.innerText.trim()).filter((t) => t && t.length < 40);
  const headings = [...document.querySelectorAll('h1,h2,h3')].filter(visible).map((el) => el.innerText.trim());

  return {
    viewport: { width: vw, height: vh, pageHeight: docH },
    overflowX: document.documentElement.scrollWidth > vw + 1,
    fontSizes: [...sizes.entries()].sort((a, b) => b[0] - a[0]).map(([px, count]) => ({ px, count })),
    leftEdges: edgeList.map(([x, count]) => ({ x, count })),
    textBlocks: blockish.length,
    centredShare: blockish.length ? +(centred / blockish.length).toFixed(2) : 0,
    h1: h1 ? { lines: h1Lines, text: h1Text } : null,
    h1Count: [...document.querySelectorAll('h1')].filter(visible).length,
    emptyBands: gaps,
    margins: { left: marginLeft, right: marginRight },
    smallCapsCaptions: caps,
    smallTargets,
    imgNoAlt,
    buttons,
    headings,
    text: document.body ? document.body.innerText.slice(0, 20000) : '',
  };
})()
