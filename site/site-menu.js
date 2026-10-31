/* Site menu: the one bar that ties the property tools together as one product.

   A slim bar across the top of each page: the product name doubles as the Menu button (click it to
   open the collapsed list of sections), plus the section you are in. People rarely switch once they
   have chosen, so the list stays out of the way until asked for, and the title no longer needs a
   separate "Menu" button next to it duplicating "where am I" it already states.

   Same file in mettpp.github.io (the home page), RE-screening and RE-jkt. The asset app draws the same
   bar on the server (RE-asset app/templates/base.html and _macros.html's site_menu()), same look.

   Use: <script src="site-menu.js" data-section="screening" defer></script>
   data-section is one of: home, screening, jakarta.

   City screening and the per-city finder are one section, the Property finder: screening (published at
   /RE-screening/) is its overview, "1 · Cities", and the finder (published at /RE-jkt/) its drill-down,
   "2 · Properties". The Menu lists the section once, and both pages get a quick-switch tabs row under
   the bar so you don't have to reopen the Menu just to move between the two steps.
*/
(function () {
  "use strict";
  const SITE = "https://mettpp.github.io/";
  // Address of the asset app once it is hosted, e.g. "https://assets.example.com/". While blank, the
  // menu uses the app that the shared feed link (pasted under My assets on a map) points to, if any.
  const ASSET_APP = "https://re-asset.onrender.com/";
  const PRODUCT = "Property Portfolio";

  // Mirrors RE-asset's site.* strings (app/translations/{en,id}.json) so the panel reads the same
  // whichever of the four places you open it from: Property finder as one umbrella entry (it opens
  // at city screening, the first step), with the two steps as sub-items underneath.
  const T = {
    en: { menu: "Menu", close: "Close menu", sections: "Sections", home: "Home", homeSub: "Start page",
      finder: "Property finder", finderSub: "Compare cities, then rank the properties in one",
      screening: "1 · Cities", screeningSub: "Which Indonesian city to invest in",
      jakarta: "2 · Properties", jakartaSub: "Which property to visit there", tabs: "Property finder steps",
      assets: "My assets", assetsSub: "Rent, bills and documents (sign in)", assetsNone: "Link appears once the asset app is hosted",
      lang: "Bahasa Indonesia" },
    id: { menu: "Menu", close: "Tutup menu", sections: "Bagian", home: "Beranda", homeSub: "Halaman awal",
      finder: "Pencari properti", finderSub: "Bandingkan kota, lalu peringkatkan properti di sana",
      screening: "1 · Kota", screeningSub: "Kota mana di Indonesia untuk investasi",
      jakarta: "2 · Properti", jakartaSub: "Properti mana yang layak disurvei di sana", tabs: "Langkah pencari properti",
      assets: "Aset saya", assetsSub: "Sewa, tagihan dan dokumen (masuk)", assetsNone: "Tautan muncul setelah aplikasi aset di-hosting",
      lang: "English" },
  };

  const get = k => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* private window */ } };

  const me = document.currentScript;
  const section = (me && me.dataset.section) || "home";
  const lang = () => get("site-lang") || (/^id\b/i.test(navigator.language || "") ? "id" : "en");

  function assetApp() {
    if (ASSET_APP) return ASSET_APP;
    try { const u = new URL(get("shared-feed-link")); return u.origin + "/"; } catch (e) { return ""; }
  }

  // On the published site, or the combined local preview (serve.py in mettpp.github.io), the sections
  // sit side by side on one address. A dashboard served on its own links to the published sections.
  const PATH = { home: "/", screening: "/re-screening/", jakarta: "/re-jkt/" };
  const here = location.pathname.toLowerCase();
  const onSite = location.origin + "/" === SITE || (/^https?:$/.test(location.protocol) &&
    (section === "home" ? /^\/(index\.html)?$/.test(here) : here.startsWith(PATH[section])));
  const href = path => (onSite ? "/" : SITE) + path;
  const LINKS = { home: href(""), screening: href("RE-screening/"), jakarta: href("RE-jkt/") };

  const CSS = `
.sm-bar{--sm-paper:#f6f5f0;--sm-surface:#fff;--sm-ink:#1b1f1c;--sm-ink2:#444c46;--sm-line:#dedbd1;--sm-green:#1d6a44;--sm-wash:#e8f1ec;
  position:relative;z-index:2000;background:var(--sm-surface);color:var(--sm-ink);border-bottom:1px solid var(--sm-line);
  font:15px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans",sans-serif}
@media (prefers-color-scheme:dark){.sm-bar{--sm-paper:#121614;--sm-surface:#1a201d;--sm-ink:#e6ece8;--sm-ink2:#a9b5ae;--sm-line:#2c3531;--sm-green:#5fc3a6;--sm-wash:#203029}}
.sm-bar *{box-sizing:border-box}
.sm-in{max-width:1400px;margin:0 auto;padding:0 16px;min-height:52px;display:flex;align-items:center;gap:12px}
/* The brand is also the Menu button (see render()): one click opens the cross-product list instead
   of a separate "Menu" button next to it duplicating "where am I" the title already states. */
.sm-brand{display:flex;align-items:center;gap:9px;font:inherit;font-weight:700;letter-spacing:-.01em;color:var(--sm-ink);
  background:transparent;border:0;padding:6px 8px;margin:-6px -8px;border-radius:8px;cursor:pointer;white-space:nowrap}
.sm-brand:hover,.sm-brand[aria-expanded=true]{background:var(--sm-wash)}
.sm-mark{width:26px;height:26px;border-radius:6px;background:#1d6a44;display:grid;place-items:center;flex:none}
.sm-mark svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sm-chev{width:14px;height:14px;margin-left:-2px;stroke:var(--sm-ink2);stroke-width:2;fill:none;flex:none;transition:transform .15s}
.sm-brand[aria-expanded=true] .sm-chev{transform:rotate(180deg)}
.sm-here{color:var(--sm-ink2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.sm-here::before{content:"/";margin-right:10px;color:var(--sm-line)}
.sm-lang{margin-left:auto;font:inherit;font-weight:600;font-size:13px;color:var(--sm-ink2);background:transparent;border:1px solid var(--sm-line);
  border-radius:8px;padding:7px 10px;min-height:44px;min-width:44px;cursor:pointer;white-space:nowrap}
.sm-lang:hover{background:var(--sm-wash);color:var(--sm-ink)}
.sm-bar :focus-visible{outline:3px solid var(--sm-green);outline-offset:2px;border-radius:6px}
.sm-panel{position:absolute;left:16px;top:calc(100% + 6px);width:min(360px,calc(100vw - 32px));background:var(--sm-surface);
  border:1px solid var(--sm-line);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:8px}
.sm-panel[hidden]{display:none}
.sm-panel h2{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--sm-ink2);margin:6px 10px 6px}
.sm-panel a{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;align-items:center;padding:10px;border-radius:8px;color:var(--sm-ink);text-decoration:none}
.sm-panel a:hover{background:var(--sm-wash)}
.sm-panel a[aria-current]{background:var(--sm-wash);box-shadow:inset 3px 0 0 var(--sm-green)}
.sm-panel a svg{grid-row:span 2;width:22px;height:22px;fill:none;stroke:var(--sm-green);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.sm-panel b{font-weight:600}.sm-panel small{color:var(--sm-ink2);font-size:13px}
.sm-panel a.sm-off{opacity:.6;pointer-events:none}
.sm-panel a.sm-sub{grid-template-columns:1fr;gap:0;margin-left:44px;padding:7px 10px}
.sm-panel a.sm-sub b{font-size:14px}
.sm-tabs{max-width:1400px;margin:0 auto;padding:0 16px;display:flex;gap:4px;overflow-x:auto}
.sm-tabs a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;color:var(--sm-ink2);font-weight:600;font-size:14px;
  text-decoration:none;white-space:nowrap;border-bottom:3px solid transparent}
.sm-tabs a:hover{color:var(--sm-ink);background:var(--sm-wash)}
.sm-tabs a[aria-current=page]{color:var(--sm-ink);border-bottom-color:var(--sm-green)}
.sm-tabs small{font-weight:400;color:var(--sm-ink2)}
@media (max-width:640px){.sm-tabs small{display:none}}
@media (max-width:480px){.sm-here{display:none}}
@media print{.sm-bar{display:none}}`;

  const ICON = {
    home: '<path d="M3 11l9-8 9 8M5 10v11h14V10M10 21v-6h4v6"/>',
    finder: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    assets: '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
  };
  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const inFinder = section === "screening" || section === "jakarta";

  function render(bar) {
    const t = T[lang()] || T.en;
    const app = assetApp();
    const item = (k, url, label, sub, ext) => `<a href="${esc(url || "#")}"${k === section ? ' aria-current="page"' : ""}${url ? "" : ' class="sm-off" aria-disabled="true"'}${ext && url ? ' target="_blank" rel="noopener"' : ""}>${svg(ICON[k])}<b>${label}</b><small>${sub}</small></a>`;
    // City screening and the Jakarta finder are the two steps of one "Property finder" feature (see
    // RE-asset's site.* strings, which this mirrors): one umbrella entry, opening at the first step,
    // with both steps listed underneath as sub-items — not two flat top-level entries.
    const subItem = (k, url, label, sub) => `<a class="sm-sub" href="${esc(url)}"${k === section ? ' aria-current="page"' : ""}><b>${label}</b><small>${sub}</small></a>`;
    // On either Property finder page, a quick-switch tabs row under the bar moves between the two
    // steps without reopening the Menu for it every time.
    const tab = k => `<a href="${esc(LINKS[k])}"${k === section ? ' aria-current="page"' : ""}>${t[k]} <small>${t[k + "Sub"]}</small></a>`;
    const hereLabel = inFinder ? t.finder : t[section];
    // The language toggle sits in the bar itself, not only inside the collapsed Menu panel: this product
    // is Indonesia-only, so a visitor on an English-locale device needs a visible, one-click EN/ID switch.
    bar.innerHTML = `<div class="sm-in">
  <button type="button" class="sm-brand" aria-expanded="false" aria-controls="sm-panel">
    <span class="sm-mark">${svg(ICON.assets)}</span>${PRODUCT}
    <svg class="sm-chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON.chev}</svg>
  </button>
  ${section !== "home" ? `<span class="sm-here">${hereLabel || ""}</span>` : ""}
  <button type="button" class="sm-lang" data-lang aria-label="${lang() === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}">${lang() === "id" ? "EN" : "ID"}</button>
  <nav class="sm-panel" id="sm-panel" aria-label="${t.sections}" hidden>
    <h2>${t.sections}</h2>
    ${item("home", LINKS.home, t.home, t.homeSub)}
    ${item("finder", LINKS.screening, t.finder, t.finderSub)}
    ${subItem("screening", LINKS.screening, t.screening, t.screeningSub)}
    ${subItem("jakarta", LINKS.jakarta, t.jakarta, t.jakartaSub)}
    ${item("assets", app, t.assets, app ? t.assetsSub : t.assetsNone, true)}
  </nav>
</div>${inFinder ? `<nav class="sm-tabs" aria-label="${t.tabs}">${tab("screening")}${tab("jakarta")}</nav>` : ""}`;
    const btn = bar.querySelector(".sm-brand"), panel = bar.querySelector(".sm-panel");
    const open = v => { panel.hidden = !v; btn.setAttribute("aria-expanded", String(v)); };
    btn.onclick = () => { const v = panel.hidden; open(v); if (v) panel.querySelector("a:not(.sm-off)").focus(); };
    bar.querySelector("[data-lang]").onclick = () => {
      put("site-lang", lang() === "id" ? "en" : "id");
      render(bar);
      document.dispatchEvent(new CustomEvent("site-lang", { detail: lang() }));
    };
    bar.onkeydown = e => { if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); } };
    bar.addEventListener("focusout", e => { if (!bar.contains(e.relatedTarget) && e.relatedTarget) open(false); });
  }

  function mount() {
    const style = document.createElement("style"); style.textContent = CSS; document.head.append(style);
    const bar = document.createElement("header"); bar.className = "sm-bar";
    document.body.prepend(bar);
    render(bar);
    document.addEventListener("click", e => {
      const p = bar.querySelector(".sm-panel");
      // isConnected: the language switch redraws the bar, so its own click lands on a removed node
      if (!p.hidden && e.target.isConnected && !bar.contains(e.target)) { p.hidden = true; bar.querySelector(".sm-brand").setAttribute("aria-expanded", "false"); }
    });
    if (section !== "home") put("site-last", section);
  }

  window.SiteMenu = { lang, assetApp, links: LINKS, T };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
})();
