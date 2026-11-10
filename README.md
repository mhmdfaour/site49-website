# Site49 marketing website

Static, buildless site for https://site49.co.za, served by GitHub Pages from `main` (`CNAME` and `.nojekyll` stay as they are). Plain HTML, one shared stylesheet, system fonts, local assets. One small self-hosted script (`assets/site.js`, no trackers) adds scroll reveal, parallax, the How-it-works stepper and the optional scene sound; everything works without it, and all motion is off when the visitor prefers reduced motion.

The offer is **WebStarter**: R49/month, R0 setup, four pages, hosting and a Site49 subdomain included. Sign-up and log-in buttons go to the customer portal at https://app.site49.co.za (`/signup`, `/login`); WhatsApp is the secondary help channel.

## Preview

Pick a free port, then from this folder:

```bash
npx wrangler pages dev . --port 8080
```

Open http://localhost:8080/. This runs the folder the way Cloudflare Pages serves it; a plain `python -m http.server` answers 404 for `/contact`, `/examples` and `/about` because the links have no `.html`. (Canonical and Open Graph URLs point at https://site49.co.za.)

## Contents

| Path | What |
| --- | --- |
| `index.html` | Home: hero, How it works, Examples teaser, WebStarter plan, FAQs |
| `examples.html` | Three fictional sample websites, labelled "not real clients" |
| `contact.html` | WhatsApp, email, phone, location |
| `portfolio.html`, `about.html` | Redirect stubs (meta refresh plus a link) to `examples` and the home page; not in the sitemap |
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

## Publishing and hosting

Keep review screenshots out of this repo (PR images live on the `pr6-screens` branch). Merging to `main` publishes.

**Today (until the move is finished):** GitHub Pages serves `main`. `CNAME` and `.nojekyll` stay as they are for now.

**Cloudflare Pages (the move):** a Pages project connected to this repository, production branch `main`, no build command, output directory `/`. Every merge to `main` deploys; other branches get preview addresses. Cloudflare serves pages without `.html` (it answers `/contact.html` with a 308 redirect to `/contact`) and a folder's `index.html` at the folder address, so every internal link in the site is written without `.html` (`contact`, `./`, `demos/corner-chair/`). GitHub Pages serves those addresses too.

- `404.html` is the "page not found" page (Cloudflare Pages uses it automatically).
- `_headers` sets the security headers (nosniff, referrer policy, HSTS without `includeSubDomains` or `preload` because other names under the domain serve mail, `X-Frame-Options: DENY` because no page frames another, and a Content-Security-Policy). If a page gains an inline script, add its sha256 to `script-src` or move it to a file. `_headers` also sends `X-Robots-Tag: noindex` on the project's `pages.dev` addresses. GitHub Pages ignores this file.
- The headers have no caching rules; asset links carry `?v=` versions but file names are not versioned.

### DNS records before the move (for going back)

The zone `site49.co.za` is on Cloudflare DNS (name servers `etienne.ns.cloudflare.com`, `gloria.ns.cloudflare.com`). Read from public DNS on 2026-11-10:

| Name | Type | Value |
| --- | --- | --- |
| `site49.co.za` | A | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| `site49.co.za` | AAAA | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| `www.site49.co.za` | CNAME | `mhmdfaour.github.io` |

(These are GitHub Pages' standard addresses.) Public DNS does not show the proxy setting or TTL of each record; check the Cloudflare DNS page before changing them.

### Going back to GitHub Pages

1. In Cloudflare DNS, remove the records the Pages custom domains added for `site49.co.za` and `www`, and restore the three records above.
2. In the GitHub repository settings, Pages: source `main`, custom domain `site49.co.za`, "Enforce HTTPS" on. Keep `CNAME` and `.nojekyll` in the repo.
3. Wait for the certificate, then check https://site49.co.za/ and https://www.site49.co.za/. The clean addresses work on GitHub Pages as well, so no file change is needed.
