# Mockups

`npm run mockups` turns the raw screenshots in `docs/screenshots` into the images the README uses:
phone-framed screens in `docs/mockups`, plus the hero banner, social preview, theme strip and
download QR code in `docs/images`. Each page is laid out in HTML and captured with Edge or Chrome
in headless mode (set `BROWSER` to its path if it isn't found). A missing screenshot is skipped.

Screenshot names: `home`, `log`, `analytics`, `plan`, `coach`, `history`, `report`, `weight`,
`achievements`, `themes`, and `home-emerald`, `home-copper`, `home-violet`, `home-gold`, `home-sapphire`.
