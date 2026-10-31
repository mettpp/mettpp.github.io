/* Site menu: the one bar that ties the property tools together as one product.

   A slim bar across the top of each page with the product name (back to the home page), the section
   you are in, and a collapsed Menu button that opens the list of sections. People rarely switch once
   they have chosen, so the list stays out of the way until asked for.

   Same file in mettpp.github.io (the home page), RE-screening and RE-jkt. The asset app draws the same
   bar on the server (RE-asset app/templates/base.html), with the same look.

   Use: <script src="site-menu.js" data-section="screening" defer></script>
   data-section is one of: home, screening, jakarta (the Property finder, still published at /RE-jkt/).
*/
(function () {
  "use strict";
  const SITE = "https://mettpp.github.io/";
  // Address of the asset app once it is hosted, e.g. "https://assets.example.com/". While blank, the
  // menu uses the app that the shared feed link (pasted under My assets on a map) points to, if any.
  const ASSET_APP = "";
  const PRODUCT = "Property Portfolio";

  const T = {
    en: { menu: "Menu", close: "Close menu", sections: "Sections", home: "Home", homeSub: "Start page",
      screening: "City screening", screeningSub: "Which Indonesian city to invest in",
      jakarta: "Property finder", jakartaSub: "Which property to visit, city by city",
      assets: "My assets", assetsSub: "Rent, bills and documents (sign in)", assetsNone: "Link appears once the asset app is hosted",
      lang: "Bahasa Indonesia" },
    id: { menu: "Menu", close: "Tutup menu", sections: "Bagian", home: "Beranda", homeSub: "Halaman awal",
      screening: "Penyaringan kota", screeningSub: "Kota mana di Indonesia untuk investasi",
      jakarta: "Pencari properti", jakartaSub: "Properti mana yang layak disurvei, per kota",
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
.sm-brand{display:flex;align-items:center;gap:9px;font-weight:700;letter-spacing:-.01em;color:var(--sm-ink);text-decoration:none;white-space:nowrap}
.sm-mark{width:26px;height:26px;border-radius:6px;background:#1d6a44;display:grid;place-items:center;flex:none}
.sm-mark svg{width:16px;height:16px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.sm-here{color:var(--sm-ink2);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.sm-here::before{content:"/";margin-right:10px;color:var(--sm-line)}
.sm-btn{margin-left:auto;display:inline-flex;align-items:center;gap:8px;font:inherit;font-weight:600;font-size:14px;color:var(--sm-ink);
  background:transparent;border:1px solid var(--sm-line);border-radius:8px;padding:7px 12px;min-height:38px;cursor:pointer}
.sm-btn:hover{background:var(--sm-wash)}
.sm-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.sm-bar :focus-visible{outline:3px solid var(--sm-green);outline-offset:2px;border-radius:6px}
.sm-panel{position:absolute;right:16px;top:calc(100% + 6px);width:min(360px,calc(100vw - 32px));background:var(--sm-surface);
  border:1px solid var(--sm-line);border-radius:10px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:8px}
.sm-panel[hidden]{display:none}
.sm-panel h2{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:var(--sm-ink2);margin:6px 10px 6px}
.sm-panel a{display:grid;grid-template-columns:auto 1fr;gap:2px 12px;align-items:center;padding:10px;border-radius:8px;color:var(--sm-ink);text-decoration:none}
.sm-panel a:hover{background:var(--sm-wash)}
.sm-panel a[aria-current=page]{background:var(--sm-wash);box-shadow:inset 3px 0 0 var(--sm-green)}
.sm-panel a svg{grid-row:span 2;width:22px;height:22px;fill:none;stroke:var(--sm-green);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.sm-panel b{font-weight:600}.sm-panel small{color:var(--sm-ink2);font-size:13px}
.sm-panel a.sm-off{opacity:.6;pointer-events:none}
.sm-foot{border-top:1px solid var(--sm-line);margin-top:6px;padding:8px 10px 2px}
.sm-foot button{font:inherit;font-size:13px;color:var(--sm-green);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}
@media print{.sm-bar{display:none}}`;

  const ICON = {
    home: '<path d="M3 11l9-8 9 8M5 10v11h14V10M10 21v-6h4v6"/>',
    screening: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
    jakarta: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    assets: '<path d="M4 21V5l8-3 8 3v16M9 21v-5h6v5M8 9h2M14 9h2M8 13h2M14 13h2"/>',
  };
  const svg = p => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${p}</svg>`;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function render(bar) {
    const t = T[lang()] || T.en;
    const app = assetApp();
    const item = (k, url, sub, ext) => `<a href="${esc(url || "#")}"${k === section ? ' aria-current="page"' : ""}${url ? "" : ' class="sm-off" aria-disabled="true"'}${ext && url ? ' target="_blank" rel="noopener"' : ""}>${svg(ICON[k])}<b>${t[k]}</b><small>${sub}</small></a>`;
    bar.innerHTML = `<div class="sm-in">
  <a class="sm-brand" href="${LINKS.home}"><span class="sm-mark">${svg(ICON.assets)}</span>${PRODUCT}</a>
  ${section !== "home" ? `<span class="sm-here">${t[section] || ""}</span>` : ""}
  <button type="button" class="sm-btn" aria-expanded="false" aria-controls="sm-panel">${svg('<path d="M4 7h16M4 12h16M4 17h16"/>')}${t.menu}</button>
  <nav class="sm-panel" id="sm-panel" aria-label="${t.sections}" hidden>
    <h2>${t.sections}</h2>
    ${item("home", LINKS.home, t.homeSub)}
    ${item("screening", LINKS.screening, t.screeningSub)}
    ${item("jakarta", LINKS.jakarta, t.jakartaSub)}
    ${item("assets", app, app ? t.assetsSub : t.assetsNone, true)}
    <div class="sm-foot"><button type="button" data-lang>${t.lang}</button></div>
  </nav>
</div>`;
    const btn = bar.querySelector(".sm-btn"), panel = bar.querySelector(".sm-panel");
    const open = v => { panel.hidden = !v; btn.setAttribute("aria-expanded", String(v)); btn.setAttribute("aria-label", v ? t.close : t.menu); };
    btn.onclick = () => { const v = panel.hidden; open(v); if (v) panel.querySelector("a:not(.sm-off)").focus(); };
    bar.querySelector("[data-lang]").onclick = () => {
      put("site-lang", lang() === "id" ? "en" : "id");
      render(bar);
      bar.querySelector(".sm-btn").click();
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
      if (!p.hidden && e.target.isConnected && !bar.contains(e.target)) { p.hidden = true; bar.querySelector(".sm-btn").setAttribute("aria-expanded", "false"); }
    });
    if (section !== "home") put("site-last", section);
  }

  window.SiteMenu = { lang, assetApp, links: LINKS, T };
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount) : mount();
})();
