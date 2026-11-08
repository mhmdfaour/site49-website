// Synthesises the three optional ambient loops used on the site (café, salon, studio workshop).
// No samples, no dependencies: everything is generated from noise and sine waves, so the audio is
// original work owned by Site49. Run: node tools/make-ambience.js <outDir>  (writes 16-bit mono WAVs),
// then encode with ffmpeg, e.g.  ffmpeg -i cafe.wav -ac 1 -ar 32000 -b:a 40k assets/audio/cafe.mp3
const fs = require('fs');
const path = require('path');
const SR = 32000, LEN = 16, FADE = 1.5;            // 16 s loop, 1.5 s crossfade at the seam
const N = Math.round(SR * (LEN + FADE));
let seed = 4949;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const R = (a, b) => a + (rnd() + 1) / 2 * (b - a);
const lpA = fc => 1 - Math.exp(-2 * Math.PI * fc / SR);
const buf = () => new Float32Array(N);

// filtered noise bed with slow random amplitude movement
function bed(out, lo, hi, gain, wobble = 0.3, rate = 0.25) {
  let l1 = 0, l2 = 0, h = 0; const a = lpA(hi), b = lpA(lo);
  let m = 0, target = 0;
  for (let i = 0; i < N; i++) {
    if (i % Math.round(SR / rate / 4) === 0) target = rnd();
    m += (target - m) * 0.00005;
    const n = rnd(); l1 += a * (n - l1); l2 += a * (l1 - l2); h += b * (l2 - h);
    out[i] += (l2 - h) * gain * (1 + wobble * m);
  }
}
// "babble": several band-passed noise voices with syllable-rate envelopes
function babble(out, voices, gain) {
  for (let v = 0; v < voices; v++) {
    const f = R(350, 900), a = lpA(f * 1.6), b = lpA(f * 0.6); let l = 0, h = 0, env = 0, tgt = 0, next = 0;
    const pan = R(0.4, 1);
    for (let i = 0; i < N; i++) {
      if (i >= next) { tgt = rnd() > -0.2 ? R(0.3, 1) : 0; next = i + Math.round(R(0.08, 0.28) * SR); }
      env += (tgt - env) * 0.0015;
      const n = rnd(); l += a * (n - l); h += b * (l - h);
      out[i] += (l - h) * env * gain * pan;
    }
  }
}
function ring(out, t, freqs, gain, decay) {
  const s = Math.round(t * SR);
  for (let i = 0; i < SR * 1.2 && s + i < N; i++) {
    const x = i / SR; let v = 0;
    freqs.forEach((f, k) => { v += Math.sin(2 * Math.PI * f * x) / (k + 1); });
    out[s + i] += v * Math.exp(-x * decay) * gain * Math.min(1, i / 30);
  }
}
function click(out, t, gain, fc = 3000) {
  const s = Math.round(t * SR); let l = 0; const a = lpA(fc);
  for (let i = 0; i < SR * 0.03 && s + i < N; i++) { const n = rnd(); l += a * (n - l); out[s + i] += (n - l) * Math.exp(-i / SR * 220) * gain; }
}
function thump(out, t, gain, f0 = 160) {
  const s = Math.round(t * SR); let ph = 0;
  for (let i = 0; i < SR * 0.35 && s + i < N; i++) { const x = i / SR; ph += 2 * Math.PI * f0 * (1 + 0.6 * Math.exp(-x * 40)) / SR;
    out[s + i] += (Math.sin(ph) * 0.8 + rnd() * 0.25 * Math.exp(-x * 80)) * Math.exp(-x * 14) * gain; }
}
function swell(out, t, dur, lo, hi, gain) {   // steam wand / hair dryer style burst of noise
  const s = Math.round(t * SR), len = Math.round(dur * SR); let l = 0, h = 0; const a = lpA(hi), b = lpA(lo);
  for (let i = 0; i < len && s + i < N; i++) { const x = i / len; const env = Math.min(1, x * 8) * Math.min(1, (1 - x) * 6);
    const n = rnd(); l += a * (n - l); h += b * (l - h); out[s + i] += (l - h) * env * gain; }
}
function hum(out, f, gain, harmonics = 4, from = 0, to = LEN + FADE) {
  const s = Math.round(from * SR), e = Math.min(N, Math.round(to * SR));
  for (let i = s; i < e; i++) { const x = i / SR; let v = 0; for (let k = 1; k <= harmonics; k++) v += Math.sin(2 * Math.PI * f * k * x + k) / k;
    const env = Math.min(1, (i - s) / (0.4 * SR)) * Math.min(1, (e - i) / (0.4 * SR)); out[i] += v * gain * env; }
}

const scenes = {
  cafe(o) {
    bed(o, 60, 500, 0.35); babble(o, 6, 0.55);
    for (let t = 0.4; t < LEN; t += R(0.9, 2.6)) ring(o, t, [R(2400, 3200), R(4300, 5200), R(6500, 7400)], 0.05, R(9, 16));
    for (let t = 1; t < LEN; t += R(2.5, 5)) click(o, t, 0.12, 1800);
    swell(o, 6.2, 2.6, 2500, 9000, 0.22);
  },
  salon(o) {
    bed(o, 60, 450, 0.3); babble(o, 3, 0.35);
    hum(o, 190, 0.02, 6, 2, 9); swell(o, 2, 7, 700, 5000, 0.28);             // hair dryer
    for (let t = 0.6; t < LEN; t += R(2.2, 3.6)) { const n = Math.round(R(2, 4)); for (let k = 0; k < n; k++) { click(o, t + k * 0.22, 0.28, 6000); ring(o, t + k * 0.22, [R(5200, 6400)], 0.012, 40); } }
  },
  workshop(o) {
    bed(o, 40, 380, 0.35, 0.15); hum(o, 50, 0.03, 3);
    hum(o, 118, 0.015, 3, 0.5, 10); swell(o, 0.5, 9.5, 180, 900, 0.12);      // potter's wheel / sander whir
    for (let t = 1; t < LEN; t += R(1.6, 3.2)) thump(o, t, 0.22, R(130, 210));
    for (let t = 3; t < LEN; t += R(4, 6)) ring(o, t, [R(900, 1300), R(2100, 2600)], 0.035, 5);    // tool on a ceramic bowl
  },
};

const out = process.argv[2] || '.';
fs.mkdirSync(out, { recursive: true });
for (const [name, fn] of Object.entries(scenes)) {
  const o = buf(); fn(o);
  const L = Math.round(LEN * SR), F = Math.round(FADE * SR), loop = new Float32Array(L);
  for (let i = 0; i < L; i++) loop[i] = o[i];
  for (let i = 0; i < F; i++) { const g = i / F; loop[i] = o[i] * g + o[L + i] * (1 - g); }   // seamless seam
  let peak = 0; for (const v of loop) peak = Math.max(peak, Math.abs(v));
  const wav = Buffer.alloc(44 + L * 2);
  wav.write('RIFF', 0); wav.writeUInt32LE(36 + L * 2, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22); wav.writeUInt32LE(SR, 24); wav.writeUInt32LE(SR * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(L * 2, 40);
  for (let i = 0; i < L; i++) wav.writeInt16LE(Math.round(loop[i] / peak * 0.5 * 32767), 44 + i * 2);
  fs.writeFileSync(path.join(out, name + '.wav'), wav);
  console.log(name, 'peak', peak.toFixed(3));
}
