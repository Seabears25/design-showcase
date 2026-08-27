# Studio Template Gallery

Four full agency/portfolio site templates, all built on the LYHT UI grid
(`assets/lyht-ui.css`), plus a tabbed gallery (`index.html`) that previews
all four in one page.

## What's here

```
index.html                 ← tabbed gallery (this is your "showcase" page)
assets/
  lyht-ui.css               ← your original framework, unmodified
  theme.css                 ← shared layer: nav, scroll-reveal, mobile drawer, grain texture
  site.js                   ← shared behavior (reveal-on-scroll, nav, mobile menu)
templates/
  monolith.html             ← architecture / spatial design studio (stone + cobalt blueprint)
  pulse.html                ← product / SaaS design studio (dark, gradient, glass)
  ink-grain.html             ← branding / editorial studio (ink black, paper grain, gold)
  kinetic.html               ← motion / animation studio (white, flat color-blocking)
```

Every template follows the same structure: **nav → hero → 3 sections → footer**,
laid out with `.container`, `.grid`, `.grid-12`, `.span-*`, and `.responsive-*`
from `lyht-ui.css`. Each has its own color/type "token set" declared at the top
of its `<style>` block (`--site-bg`, `--site-accent`, etc.) so they never
collide with each other or with your dashboard usage of the same framework.

## Swapping in your own images

Every image placeholder is a `placehold.co` URL with a comment right above it:

```html
<!-- SWAP IMAGE: hero project photo, 4:3 -->
<img src="https://placehold.co/1000x750/..." alt="...">
```

Just replace the `src` with your own file (e.g. `images/project-1.jpg`) —
the surrounding `.img-frame` handles cropping (`object-fit: cover`), so any
image will fill the space without breaking the layout. Update the `alt` text
to describe the real image.

## Editing copy

Headlines, stats, and body copy are placeholder but written for the studio's
fictional niche (architecture, SaaS product design, branding/print, motion) —
search-and-replace the studio name and swap sentences directly in the HTML.

## Deploying to GitHub Pages

1. Create a new GitHub repo and push this whole folder to it.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment," set **Source** to "Deploy from a branch,"
   pick your default branch and `/ (root)`, then save.
4. GitHub will give you a URL like `https://yourname.github.io/repo-name/` —
   that's your live gallery (`index.html`). Individual templates are
   reachable at `.../templates/monolith.html`, etc.
5. If you'd rather have one specific template be the live site (not the
   gallery), rename that template's file to `index.html` at the repo root
   and fix its two asset links (`../assets/...` → `assets/...`).

## Customizing the palette of one template

Open the template's `<style>` block and edit the variables at the top, e.g.
for Pulse:

```css
body.pulse{
  --site-bg:#0a0c16;
  --site-accent:#7c5cff;
  ...
}
```

Everything else (buttons, tags, cards, borders) references these variables,
so changing them re-themes the whole page.
