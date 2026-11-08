# Property Portfolio: home page

The start page and the shared **Menu** that make the property tools one product:

| Section | What it is | Lives in | Address |
|---|---|---|---|
| Home | Big start page: what each tool is for, today's top cities, your asset count | this repo | `https://mettpp.github.io/` |
| Property finder, 1 · Cities | The overview: which Indonesian city to invest in (formerly City screening) | [cities](https://github.com/mettpp/cities) | `https://mettpp.github.io/cities/` |
| Property finder, 2 · Properties | The drill-down: which property to visit in a city (Jakarta and the other top cities) | [properties](https://github.com/mettpp/properties) | `https://mettpp.github.io/properties/` |
| My assets | Rent, bills, documents, finance (logins, database) | [assets](https://github.com/mettpp/assets) | its own server on Render, `https://re-asset.onrender.com/` |

Every page has the same slim bar at the top: the product name (back to the home page), the section you are in, and a collapsed **Menu** button that lists the three sections. City screening and the finder are one section, the Property finder, in two steps: both pages show the same **1 · Cities / 2 · Properties** tabs under the bar, and the Menu lists the section once with the two steps under it. They stay two repos with their own data pipelines. People rarely switch once they have picked one, so the list stays closed until asked for. The home page remembers the last section you used and offers **Continue to …**. The menu has an English / Bahasa Indonesia switch, remembered per browser.

## How the pieces are hosted

**One address for the static parts, no build step joining them.** This repo is named `mettpp.github.io`, so GitHub Pages publishes it at the root of `https://mettpp.github.io/`. Each of cities and properties already publishes its own `dashboard/` folder with GitHub Pages, and a repo's Pages site appears under the owner's site at `/<repo name>/`. So the three static parts are one website without copying anything between repos:

- each repo keeps its own Pages workflow, its own daily news refresh and its own **Update now** button, and republishes only itself;
- because it is one address, things saved in the browser are shared across the sections: the shared-feed link pasted once under **My assets** on either map works on both maps and on the home page;
- `site-menu.js` (the bar and the Menu) is the same file in this repo, cities and properties. Change it here, then copy it to `dashboard/site-menu.js` in the other two.

**The asset app stays a separate server**, because it has logins, a database and uploaded documents, which GitHub Pages cannot run. Host it as its README says (Render, Railway, Fly.io or a small VPS). It draws the same bar and Menu itself (`app/templates/_macros.html`, `site_menu`), in the same paper, ink and green, and its `SITE_URL` setting (default `https://mettpp.github.io/`) points the Menu back here.

Once the asset app has an address, put it in `ASSET_APP` at the top of `site-menu.js` (here and in the two copies). Until then the **My assets** entry uses the asset app that your shared-feed link points to, if you have pasted one in this browser, and otherwise says the link appears once the app is hosted.

**Data between them** goes one way, through the asset app's shared feed (`/api/v1/shared/assets.geojson`, behind a key the owner creates in **Settings > Shared feed**): name, type, city, pin and outline only. The maps draw it under **My assets**; the home page reads the same link to show how many assets you have and in which cities. Prices, rent and tenants never leave the asset app. The home page's "Top today" list reads City screening's own published `scores.js` and computes the balanced index the same way its dashboard does.

## Turn it on

1. Repo **Settings > Pages > Build and deployment > Source: GitHub Actions**. The workflow in `.github/workflows/pages.yml` publishes `site/` on every push to `main`.
2. Do the same in cities and properties if not done yet.
3. Pages on a private repo needs a paid GitHub plan. This repo holds no data (links, the menu and the page), so it can be public if needed; the Pages sites themselves are public either way.
4. A custom domain set on this repo (Settings > Pages) moves the whole site, including `/cities/` and `/properties/`, to that domain. Then update `SITE` in `site-menu.js` and `SITE_URL` on the asset app.

## Preview locally

With cities and properties checked out next to this folder:

```
python serve.py            # http://localhost:8000 : home at /, the dashboards at /cities/ and /properties/
```

Python 3.10+, standard library only. Opening a dashboard on its own (`python serve.py` inside cities) also shows the bar; its Menu then links to the published sections.
