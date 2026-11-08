# Image and audio sources

Everything here is owned by Site49 or made for it; no stock, no third-party licences, no real brands or logos.

## Images (`assets/images/`)

| Files | Source | Licence / rights |
| --- | --- | --- |
| `hero`, `step-1`…`step-5` photos, `benefit-whatsapp`, `benefit-menu`, `benefit-trades`, `domain`, `devices` (`.avif`, `.webp`, several widths) | Generated for Site49 on 2026-11-08 with OpenAI Codex image generation from the brief in the PR (South African small-business owners using the Site49 account and their new websites). People and businesses shown are not real. | Generated for Site49's use under OpenAI's terms (output owned by the user). No real people, brands or logos. |
| `step-1.svg` … `step-5.svg` | Drawn by hand as SVG for this site (simplified Site49 account screens). | Site49 original work. |
| `cafe`, `barber`, `studio` (+ `-640`, `-1024`) | Existing images of the fictional sample sites (Mzansi Morning, Corner Chair, Earth & Form), already in the repo; AVIF and 1024 px variants added. | Site49, as before. |
| `hero`, `shop` (old illustrations) | Removed: replaced by the new photography. | — |
| `assets/brand/*` | Site49 brand files, unchanged. | Site49. |

Optimisation: AVIF (quality 50) with WebP fallback via `<picture>`, `srcset`/`sizes`, `width`/`height` on every image, `loading="lazy"` below the fold, made with ImageMagick 7.

## Audio (`assets/audio/`)

| File | What | Source | Licence |
| --- | --- | --- | --- |
| `cafe.mp3` | 16 s seamless loop: room tone, soft chatter, cups, a steam wand | Synthesised from noise and sine waves by `tools/make-ambience.js` (no samples) | Site49 original work |
| `salon.mp3` | 16 s loop: room tone, a hair dryer, scissor snips | same | Site49 original work |
| `workshop.mp3` | 16 s loop: low hum, a wheel/sander whir, wood knocks, a ceramic ring | same | Site49 original work |

Encoded mono 32 kHz, 40 kbps MP3 (about 80 KB each) with ffmpeg. They load only after the visitor turns sound on.
Regenerate: `node tools/make-ambience.js <tmpdir>` then `ffmpeg -i <tmpdir>/cafe.wav -ac 1 -ar 32000 -b:a 40k assets/audio/cafe.mp3` (same for each).
ElevenLabs was not used (no tool available in this session; it saves the owner's monthly character budget).
