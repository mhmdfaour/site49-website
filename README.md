# Site49 marketing website

Static, buildless site for https://site49.co.za, served by GitHub Pages from `main` (`CNAME` and `.nojekyll` stay as they are). Plain HTML, one shared stylesheet, system fonts, local assets. One small self-hosted script (`assets/site.js`, no trackers) adds scroll reveal, parallax, the How-it-works stepper and the optional scene sound; everything works without it, and all motion is off when the visitor prefers reduced motion.

The offer is **WebStarter**: R49/month, R0 setup, four pages, hosting and a Site49 subdomain included. Sign-up and log-in buttons go to the customer portal at https://app.site49.co.za (`/signup`, `/login`); WhatsApp is the secondary help channel.

## Preview

Pick a free port, then from this folder:

```bash
python -m http.server 8080
```

Open http://localhost:8080/. (Canonical and Open Graph URLs point at https://site49.co.za.)

## Contents

| Path | What |
| --- | --- |
| `index.html` | Home: hero, How it works, Examples teaser, WebStarter plan, FAQs |
| `examples.html` | Three fictional sample websites, labelled "not real clients" |
| `contact.html` | WhatsApp, email, phone, location |
| `portfolio.html`, `about.html` | Redirect stubs (meta refresh plus a link) to `examples.html` and `index.html`; not in the sitemap |
| `assets/site.css` | All styling (colour tokens at the top: navy `#0b2145`, cobalt `#075bee`, ice `#eaf3ff`, WhatsApp green, mint/yellow accents). Wide layout up to 1480 px content, full-bleed sections, View Transitions between pages |
| `assets/site.js` | Header state, scroll progress, reveal, parallax (`data-speed`), How-it-works stepper, domain typing, scene sound (`data-sound`) |
| `assets/video/` | Welcome, tutorial and use-case videos (MP4 + poster + WebVTT captions); captions made by `tools/make-captions.js`. See `docs/ASSETS.md` |
| `assets/audio/` | Optional ambient loops (`cafe`, `salon`, `workshop`), off by default; made by `tools/make-ambience.js` |
| `assets/images/` | AVIF + WebP images in several widths, and the step SVGs. Sources and licences: `docs/ASSETS.md` |
| `assets/brand/` | Logo (`site49-logo.svg`, `site49-logo-light.svg` for navy backgrounds), `favicon.svg`, 1200×630 `social-card.png` (Open Graph) |
| `demos/` | Three fictional four-page sample sites (`mzansi-morning`, `corner-chair`, `earth-and-form`) and `demos/shared/`. All are `noindex` and disclosed as fictional; they link back to `examples.html` |
| `sitemap.xml`, `robots.txt` | Three public pages; `/demos/` pages are noindex (not blocked in `robots.txt`, so crawlers can see the tag) |
| `favicon.svg`, `favicon.ico` | Root favicon files |

## Editing content

- Header, footer and the floating WhatsApp button repeat in each page; change them in all three (`index.html`, `examples.html`, `contact.html`).
- The WhatsApp link is the same everywhere: `https://wa.me/27783838383?text=Hi%20Site49%2C%20I%27d%20like%20to%20get%20started%20with%20WebStarter%20(R49%2Fmonth).` Update it everywhere when checkout goes live.
- Keep copy to the confirmed offer: domains as "free Site49 business address (yourname.mysite49.co.za), a .co.za domain R149 for 1 year, or link your own domain free"; no price for business email (separate add-on), no VAT claims, testimonials, client counts or response-time promises beyond the two-business-day first demo.
- Sample sites stay labelled as fictional ("Sample concept, fictional business"). The owner asked (2026-11-08) for no "AI-generated artwork" captions.
- Scene sound must stay off by default and only start after the visitor turns it on.

## Publishing

Everything in this repo is served by GitHub Pages, so keep review screenshots out of it (PR images live on the `pr6-screens` branch).


GitHub Pages serves `main`; merging to `main` publishes. Don't change `CNAME` or the Pages/DNS settings.
