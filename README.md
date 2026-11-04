# Site49 marketing website

Static, buildless site for https://site49.co.za, served by GitHub Pages from `main` (`CNAME` and `.nojekyll` stay as they are). Plain HTML, one shared stylesheet, system fonts, local assets. The only JavaScript on Site49's own pages is the small, reduced-motion-safe hero parallax on the home page.

The offer is **WebStarter**: R49/month, R0 setup, four pages, hosting and a Site49 subdomain included. The customer portal and checkout are built separately and are not live yet, so every "Get started" / "Explore WebStarter" button opens WhatsApp.

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
| `assets/site.css` | All styling (colour tokens at the top: navy `#0b2145`, cobalt `#075bee`, ice `#eaf3ff`, WhatsApp green for CTAs, small mint/yellow accents) |
| `assets/scroll.js` | Hero parallax; does nothing when the visitor prefers reduced motion |
| `assets/images/` | WebP artwork: `hero`, `shop` (AI-generated, shown with "illustrative concept" captions) and the three demo images, each with a smaller variant |
| `assets/brand/` | Logo (`site49-logo.svg`, `site49-logo-light.svg` for navy backgrounds), `favicon.svg`, 1200×630 `social-card.png` (Open Graph) |
| `demos/` | Three fictional four-page sample sites (`mzansi-morning`, `corner-chair`, `earth-and-form`) and `demos/shared/`. All are `noindex` and disclosed as fictional; they link back to `examples.html` |
| `sitemap.xml`, `robots.txt` | Three public pages; `/demos/` pages are noindex (not blocked in `robots.txt`, so crawlers can see the tag) |
| `favicon.svg`, `favicon.ico` | Root favicon files |

## Editing content

- Header, footer and the floating WhatsApp button repeat in each page; change them in all three (`index.html`, `examples.html`, `contact.html`).
- The WhatsApp link is the same everywhere: `https://wa.me/27783838383?text=Hi%20Site49%2C%20I%27d%20like%20to%20get%20started%20with%20WebStarter%20(R49%2Fmonth).` Update it everywhere when checkout goes live.
- Keep copy to the confirmed offer: no prices for custom domains or business email (separate add-ons), no VAT claims, testimonials, client counts or response-time promises beyond the two-business-day first demo.
- AI-generated artwork must keep an "illustrative concept" caption.

## Publishing

GitHub Pages serves `main`; merging to `main` publishes. Don't change `CNAME` or the Pages/DNS settings.
