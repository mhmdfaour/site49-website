// Builds WebVTT captions for the website videos from the voiceover word timings in the marketing project.
// Usage: node tools/make-captions.js <marketing/video/build/voice dir> <out dir>
const fs = require('fs'), path = require('path');
const [src, out] = process.argv.slice(2);
const map = { general: 'welcome', tutorial: 'tutorial', cafe: 'cafe', salon: 'salon', trades: 'trades' };
const ts = t => { const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = (t % 60).toFixed(3).padStart(6, '0'); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s}`; };

// Spoken phrases shown the way the site writes them. Longest first.
const RULES = [
  ['site forty-nine dot co dot za', 'site49.co.za'], ['a hundred and forty-nine rand', 'R149'],
  ['forty-nine rand', 'R49'], ['dot co dot za', '.co.za'], ['site forty-nine', 'Site49'],
  ['step one', 'Step 1:'], ['step two', 'Step 2:'], ['step three', 'Step 3:'], ['step four', 'Step 4:'], ['step five', 'Step 5:'],
].map(([a, b]) => [a.split(' '), b]);
const norm = w => w.toLowerCase().replace(/[^a-z-]/g, '');
function merge(ws) {
  const res = [];
  for (let i = 0; i < ws.length;) {
    const r = RULES.find(([seq]) => seq.every((x, k) => ws[i + k] && norm(ws[i + k].w) === x));
    if (r) { const last = ws[i + r[0].length - 1]; res.push({ t: ws[i].t, d: last.t + last.d - ws[i].t, w: r[1] }); i += r[0].length; }
    else res.push(ws[i++]);
  }
  return res;
}

fs.mkdirSync(out, { recursive: true });
for (const [from, to] of Object.entries(map)) {
  const { phr } = JSON.parse(fs.readFileSync(path.join(src, from, 'el-Crystal', 'cues.json'), 'utf8'));
  const cues = [];
  for (const p of phr) {
    const ws = merge(p.words);
    for (let i = 0; i < ws.length;) {                  // chunks of up to 8 words / ~3.5 s
      let j = i + 1;
      while (j < ws.length && j - i < 8 && ws[j].t + ws[j].d - ws[i].t < 3.6) j++;
      if (ws.length - j > 0 && ws.length - j < 3) j = ws.length;   // avoid tiny leftovers
      const chunk = ws.slice(i, j);
      let text = chunk.map(w => w.w).join(' ');
      if (i === 0) text = text[0].toUpperCase() + text.slice(1);
      if (j === ws.length) text += '.';
      const start = chunk[0].t, end = Math.max(chunk.at(-1).t + chunk.at(-1).d + 0.25, start + 1);
      cues.push({ start, end, text });
      i = j;
    }
  }
  cues.forEach((c, k) => { if (cues[k + 1]) c.end = Math.min(c.end, cues[k + 1].start - 0.01); });
  const vtt = 'WEBVTT\n\n' + cues.map((c, k) => `${k + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n');
  fs.writeFileSync(path.join(out, to + '.en.vtt'), vtt);
}
console.log('ok');
