# Site49 marketing website (local build, not published)

Static, buildless site: plain HTML, one shared stylesheet, system fonts, local assets, no JavaScript on Site49's own pages. Nothing here is deployed, and the domain is not pointed at this folder. Launch is pending owner approval.

## Preview

Entry point: `index.html`. From this folder:

```bash
python -m http.server 8080
```

Then open http://localhost:8080/. (Opening files directly also works; the canonical/Open Graph URLs point at the future https://site49.co.za.)

## Contents

| Path | What |
| --- | --- |
| `index.html`, `portfolio.html`, `about.html`, `contact.html` | Site49's four pages |
| `assets/site.css` | All styling (colour tokens at the top of the file) |
| `assets/images/` | Web-ready WebP sample images (+ 640px variants) |
| `assets/brand/` | Logo (`site49-logo.svg`, plus `site49-logo-light.svg` for dark backgrounds), `favicon.svg`, `social-card.svg` and its 1200×630 PNG export (`social-card.png`, used for Open Graph). Palette: navy `#0b2048`, royal blue `#0057e7`, WhatsApp green `#0b7f31`→`#085f26`, tokens at the top of `assets/site.css` |
| `demos/` | Three fictional four-page sample sites (`mzansi-morning`, `corner-chair`, `earth-and-form`) and `demos/shared/` (CSS/JS). All are `noindex`, disclosed as fictional, and link back to `portfolio.html` |
| `sitemap.xml`, `robots.txt` | Four marketing pages only; `/demos/` pages are noindex (not blocked in robots.txt, so crawlers can see the tag) |
| `favicon.svg`, `favicon.ico` | Root favicon files |

## Editing content

- Copy and pages: edit the four HTML files directly. Header, footer and the floating WhatsApp button repeat in each page, so change them in all four.
- The WhatsApp sales link appears in every page; the string is `https://wa.me/27783838383?text=Hi%20Site49%2C%20I%27m%20interested%20in%20the%20R49%2Fmonth%20website.`
- Prices and qualifiers (R49/month, R49 per minor edit, R149 first-year .co.za, limited-time R0 setup) appear on `index.html` (plan section, FAQ), plus short mentions in the other pages, the footer and meta descriptions. If the offer changes, search for `R49`, `R0` and `R149` and update everything together.
- Open Graph image: re-export `assets/brand/social-card.svg` to `social-card.png` (1200×630) if the artwork changes.
- Organization schema (verified facts only) is in `index.html`.

## Client website rule

On real customer sites, the WhatsApp button must use that client's own verified number in digits-only `wa.me` format. Site49's number is only for Site49's own sales contacts. The demos intentionally have no operating contact number; their dialog explains this. Site49's number may appear in a demo only as a clearly labelled "Chat to Site49" sales link, never as the fictional business's contact.

## Deployment checklist (when the owner asks to publish)

1. Owner confirms the open decisions below.
2. Upload the contents of this folder to the web root of the static host (HTTPS on).
3. DNS for site49.co.za (owner screenshot, 2026-11-03; not verified live): `@`, `www`, `mail`, `ftp`, `pop`, `smtp` A records already point to 102.218.215.41; nameservers are `dan1`–`dan4.host-ww.net`. Confirm that IP is the intended web host, upload there, then confirm `https://site49.co.za/` and `https://www.site49.co.za/` serve `index.html` (decide which is canonical and redirect the other). Existing mail/SPF records must be left as they are.
4. Check canonical/Open Graph URLs match the live URLs and that `social-card.png` loads.
5. Click every WhatsApp, `mailto:` and `tel:` link on the live site.
6. Confirm `/demos/` pages are crawlable and return `noindex`, and `robots.txt` / `sitemap.xml` are reachable; submit the sitemap if desired.
7. Re-check the offer copy against the latest approved offer.

## Owner launch decisions still open

- Is the R0 setup promotion still active? No end date or regular setup price is shown, on purpose.
- VAT/tax treatment (no claim made).
- .co.za renewal price, who registers/owns the domain, transfer arrangements (only "R149 first year" is stated).
- What counts as a "minor edit" and how R49 per edit is approved.
- Practical cancellation and hosting-end arrangements.
- Delivery timing, payment process and support availability (none promised).
- Confirm the phone/WhatsApp number and email are active (no test messages were sent).
- Privacy/contract text: none is written. There is no form, analytics, cookies or tracking; add owner-approved policy text before collecting data.
- Contact is by direct links only (no form); a form would need an approved delivery service.
- AI-generated imagery and the Site49 name should be reviewed before adopting a final brand.
