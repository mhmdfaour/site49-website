# Image and video sources

Everything here is owned by Site49 or made for it; no stock, no third-party licences, no real brands or logos.

## Images (`assets/images/`)

| Files | Source | Licence / rights |
| --- | --- | --- |
| `sa-hero`, `sa-step-1`…`sa-step-5`, `sa-step-address`, `sa-step-pay`, `sa-benefit-whatsapp`, `sa-benefit-menu`, `sa-benefit-trades`, `sa-domain`, `sa-devices` (`.avif`, `.webp`, three widths each) | Generated for Site49 on 2026-11-08 with OpenAI Codex image generation (codex-cli 0.164) from `docs/image-brief.md` (South African small-business owners using the Site49 account and their new websites). People and businesses shown are not real. | Generated for Site49's use under OpenAI's terms (output owned by the user). No real people, brands or logos. |
| `cafe`, `barber`, `studio` (+ `-640`, `-1024`; AVIF for the 1024 and full sizes) | Existing images of the fictional sample sites (Mzansi Morning, Corner Chair, Earth & Form), already in the repo; AVIF and 1024 px variants added. | Site49, as before. |
| `hero`, `shop` (old illustrations) | Removed: replaced by the new photography. | — |
| `assets/brand/*` | Site49 brand files, unchanged. | Site49. |

Optimisation: AVIF (quality 50) with WebP fallback via `<picture>`, `srcset`/`sizes`, `width`/`height` on every image, `loading="lazy"` below the fold, made with ImageMagick 7.

## Video (`assets/video/`)

| File | Size | Source |
| --- | --- | --- |
| `welcome.mp4` (General promo, 36 s) | 3.0 MB | Owner-approved Site49 marketing videos (`D:\Projects\Site49\marketingideo\out\Site49_*_9x16_Crystal.mp4`, voice: ElevenLabs "Crystal", music and effects synthesised). Re-encoded 720×1280 H.264 (CRF 27, max 950 kbit/s) + AAC 96 kbit/s, faststart. |
| `welcome-preview.mp4` (silent 14 s loop, 360×640, no audio) | 0.35 MB | First 14 s of `welcome.mp4`, re-encoded for the muted preview |
| `tutorial.mp4` (How it works, 56 s) | 3.9 MB | same |
| `cafe.mp4`, `salon.mp4`, `trades.mp4` (use cases, 37–38 s) | 3.3 / 3.1 / 3.2 MB | same |
| `*-poster.webp` | 17–23 KB each | Frame at 4 s of each video |
| `*.en.vtt` | 1–2 KB each | Captions built by `tools/make-captions.js` from the voiceover word timings (`build/voice/*/el-Crystal/cues.json`), written the way the site spells things (Site49, R49, R149, .co.za) |

Loading: the four click-to-play videos load nothing until played (`preload="none"`; only their ~20 KB posters load). The welcome section loops the silent 0.35 MB preview while on screen (not with reduced motion or Save-Data), with a pause button; the full `welcome.mp4` loads only when the visitor presses "Play with sound". Total video media in the repo: about 16.9 MB.

**Voice licence (owner to confirm):** the voiceover is ElevenLabs voice "Crystal". ElevenLabs allows commercial use of generated audio on paid plans (not the free plan). The videos were generated with the owner's ElevenLabs account; please confirm it was on a paid plan when they were generated.
