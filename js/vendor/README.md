# Vendored

`material-web-2.5.0.js` — Google's Material Web (`@material/web` 2.5.0), the
M3 components the M3 versions use, bundled into one ES module with esbuild
so the prototype has no build step and no runtime CDN. Entry point:

```js
import '@material/web/all.js';
import '@material/web/labs/card/elevated-card.js';
import '@material/web/labs/card/filled-card.js';
import '@material/web/labs/card/outlined-card.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/badge/badge.js';
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

```bash
npx esbuild entry.js --bundle --minify --format=esm --legal-comments=eof --outfile=material-web-2.5.0.js
```

**One patch after bundling.** The ripple's hover layer ships with
`transition: opacity 15ms linear, background-color 15ms linear`, which reads
as instant. It is replaced with 250ms on a symmetric ease-in-out,
`cubic-bezier(0.45, 0, 0.55, 1)` — the same curve as every other hover in
`css/m3-app.css` — so hovers fade in and out. Re-apply it if the bundle is
rebuilt:

```bash
sed -i 's/transition:opacity 15ms linear,background-color 15ms linear/transition:opacity 250ms cubic-bezier(0.45,0,0.55,1),background-color 250ms cubic-bezier(0.45,0,0.55,1)/' material-web-2.5.0.js
```
