(() => {
  "use strict";

  const CFG = window.BM_CONFIG;
  const PRODUCTS = window.BM_PRODUCTS;
  const STORAGE_KEY = "bm_cart_v1";
  const $ = (sel, root = document) => root.querySelector(sel);

  const money = new Intl.NumberFormat(CFG.locale, {
    style: "currency", currency: CFG.currency, maximumFractionDigits: 0,
  });
  const byId = new Map(PRODUCTS.map((p) => [p.id, p]));
  const COLORS = window.BM_COLORS;
  const colorById = new Map([...COLORS, ...(window.BM_EXTRA_COLORS || [])].map((c) => [c.id, c]));
  // Colores de una prenda: los 4 estándar, o los propios si el producto define `colors`.
  const colorsOf = (p) => (p.colors ? p.colors.map((id) => colorById.get(id)) : COLORS);
  const DEFAULT_COLOR = COLORS[0].id;

  /* ---------- Ilustraciones SVG de las prendas ---------- */
  const SHAPES = {
    tee: "M60 38 L88 28 Q100 46 112 28 L140 38 L172 72 L148 94 L140 84 L140 172 L60 172 L60 84 L52 94 L28 72 Z",
    hoodie: "M58 44 Q100 18 142 44 L174 80 L150 104 L142 92 L142 172 L58 172 L58 92 L50 104 L26 80 Z",
    jacket: "M58 38 L88 28 Q100 40 112 28 L142 38 L174 76 L152 168 L100 172 L48 168 L26 76 Z",
    leggings: "M62 28 H138 L146 176 H112 L100 86 L88 176 H54 Z",
    shorts: "M60 40 H140 L152 124 H108 L100 92 L92 124 H48 Z",
    top: "M72 44 Q100 96 128 44 L142 56 L136 112 H64 L58 56 Z",
  };
  const DETAILS = {
    hoodie: '<path d="M80 50 Q100 80 120 50" fill="none" stroke="#0006" stroke-width="3"/><path d="M70 140 H130" stroke="#0004" stroke-width="3"/>',
    jacket: '<path d="M100 32 V170" stroke="#0007" stroke-width="3"/>',
    leggings: '<path d="M62 44 H138" stroke="#0005" stroke-width="4"/>',
    shorts: '<path d="M48 124 H152" stroke="#0004" stroke-width="3"/>',
    tee: '<path d="M88 28 Q100 46 112 28" fill="none" stroke="#0006" stroke-width="3"/>',
    top: "",
  };

  const SPARKS = 6;
  function sparkles() {
    return Array.from({ length: SPARKS }, () => el("span", { class: "spark", "aria-hidden": "true" }));
  }

  // Marco en arco con borde degradado, destellos finos y vistas intercambiables.
  const imagesFor = (p, color) => (p.gallery ? p.gallery[color] : p.images);

  function photoFrame(p, color, { dots = true } = {}) {
    const imgs = imagesFor(p, color).map((src, i) => el("img", {
      src, alt: `${p.name}, vista ${i + 1}`, width: 360, height: 636, decoding: "async",
      ...(i ? { loading: "lazy" } : {}),
    }));
    const inner = el("div", { class: "frame__inner" }, ...imgs, el("span", { class: "shine", "aria-hidden": "true" }));
    const frame = el("div", { class: "frame" }, inner, ...sparkles());
    let chosen = 0;
    const show = (n) => imgs.forEach((im, i) => im.classList.toggle("is-active", i === n));
    show(0);
    if (dots && imgs.length > 1) {
      const bar = el("div", { class: "frame__dots" }, ...imgs.map((_, i) => el("button", {
        type: "button", "aria-label": `Ver foto ${i + 1} de ${imgs.length}`,
        onclick: () => { chosen = i; show(i); bar.querySelectorAll("button").forEach((b, j) => b.setAttribute("aria-current", String(j === i))); },
      })));
      bar.firstChild.setAttribute("aria-current", "true");
      frame.append(bar);
      frame.addEventListener("mouseenter", () => show(1));
      frame.addEventListener("mouseleave", () => show(chosen));
    }
    return frame;
  }

  const hasPhotos = (p) => Boolean(p.images || p.gallery);

  function thumb(p, uid, color) {
    if (!hasPhotos(p)) { const d = el("div"); d.innerHTML = garmentSVG(p, uid, color); return d.firstChild; }
    return el("img", { src: imagesFor(p, color)[0], alt: p.name, width: 64, height: 64 });
  }

  // Mezcla un color #rrggbb con blanco (amt > 0) o negro (amt < 0).
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    const ch = (v) => Math.round(v + (t - v) * a).toString(16).padStart(2, "0");
    return `#${ch(n >> 16)}${ch((n >> 8) & 255)}${ch(n & 255)}`;
  }

  function garmentSVG(p, uid, color) {
    const base = colorById.get(color).hex;
    const c1 = shade(base, 0.3), c2 = shade(base, -0.25);
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${p.name}" focusable="false">
      <defs><linearGradient id="g-${uid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      <path d="${SHAPES[p.shape]}" fill="url(#g-${uid})" stroke="#fff3" stroke-width="1.5" stroke-linejoin="round"/>
      ${DETAILS[p.shape]}
      <path d="M70 60 Q80 100 72 150" fill="none" stroke="#fff4" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- Estado del carrito ---------- */
  // Cada línea: { id, size, color, qty }. Se valida al cargar para no confiar en localStorage.
  let cart = loadCart();

  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter((l) => {
        const p = l && byId.get(l.id);
        return p && p.sizes.includes(l.size) && Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= CFG.maxQty;
      }).map(({ id, size, color, qty }) => {
        const list = colorsOf(byId.get(id));
        return { id, size, color: list.some((c) => c.id === color) ? color : list[0].id, qty };
      });
    } catch { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch { /* modo privado */ }
  }

  /* ---------- Utilidades DOM ---------- */
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    node.append(...children.filter(Boolean));
    return node;
  }
  function qtySelect(value, label, onChange) {
    const sel = el("select", { "aria-label": label });
    for (let i = 1; i <= CFG.maxQty; i++) sel.append(el("option", { value: i, text: i }));
    sel.value = String(value);
    if (onChange) sel.addEventListener("change", () => onChange(Number(sel.value)));
    return sel;
  }
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* ---------- Catálogo ---------- */
  const state = { category: "Todos", query: "", sort: "featured" };
  const BEST = "Más vendidos";
  const categories = ["Todos", BEST, ...new Set(PRODUCTS.map((p) => p.category))];

  function renderChips() {
    const wrap = $("#chips");
    wrap.replaceChildren(...categories.map((c) => el("button", {
      class: "chip", type: "button", "aria-pressed": String(c === state.category), text: c,
      onclick: () => { state.category = c; renderChips(); renderGrid(); },
    })));
  }

  function visibleProducts() {
    const q = state.query.trim().toLowerCase();
    let list = PRODUCTS.filter((p) =>
      (state.category === "Todos" || (state.category === BEST ? p.bestSeller : p.category === state.category)) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
    if (state.sort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (state.sort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    if (state.sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name, CFG.locale));
    return list;
  }

  // Selector de color (los mismos 4 para todas las prendas).
  function colorPicker(list, onChange) {
    let current = list[0].id;
    const name = el("strong", { text: colorById.get(current).name });
    const buttons = list.map((c) => {
      const b = el("button", {
        type: "button", class: "swatch", role: "radio", title: c.name,
        "aria-label": c.name, "aria-checked": String(c.id === current),
      });
      b.style.setProperty("--sw", c.hex);
      b.addEventListener("click", () => {
        current = c.id;
        buttons.forEach((x, i) => x.setAttribute("aria-checked", String(list[i].id === current)));
        name.textContent = c.name;
        onChange(current);
      });
      return b;
    });
    const node = el("div", { class: "colors" },
      el("span", { class: "colors__label" }, "Color: ", name),
      el("div", { class: "swatches", role: "radiogroup", "aria-label": "Color" }, ...buttons));
    return { node, value: () => current };
  }

  function productCard(p, i) {
    const media = el("div", { class: hasPhotos(p) ? "card__media card__media--photo" : "card__media" });
    const refNote = el("span", { class: "ref-note", text: "Foto referencial · el color se confirma en tu pedido", hidden: "" });
    const paint = (color) => {
      if (hasPhotos(p)) {
        media.replaceChildren(photoFrame(p, color));
        refNote.hidden = Boolean(p.gallery) || p.photoColor === color;
      } else {
        media.innerHTML = garmentSVG(p, `${p.id}-${color}`, color); // contenido propio y estático
      }
    };
    const list = colorsOf(p);
    const picker = colorPicker(list, paint);
    paint(list[0].id);
    const sizeSel = el("select", { id: `size-${p.id}` }, ...p.sizes.map((s) => el("option", { value: s, text: s })));
    const qty = qtySelect(1, `Cantidad de ${p.name}`);
    qty.id = `qty-${p.id}`;
    const card = el("article", { class: "card" },
      p.badge && el("span", { class: "badge", text: p.badge }),
      media,
      el("div", { class: "card__body" },
        el("span", { class: "card__cat", text: p.category }),
        el("h3", { class: "card__name", text: p.name }),
        el("span", { class: "card__price", text: money.format(p.price) }),
        picker.node,
        refNote,
        el("div", { class: "card__opts" },
          el("label", { for: sizeSel.id }, "Talla", sizeSel),
          el("label", { for: qty.id }, "Cantidad", qty)),
        el("button", {
          class: "btn btn--primary", type: "button", text: "Agregar al carrito",
          onclick: () => addToCart(p.id, sizeSel.value, picker.value(), Number(qty.value)),
        })));
    card.style.animationDelay = `${Math.min(i, 8) * 50}ms`;
    return card;
  }

  function renderGrid() {
    const list = visibleProducts();
    $("#grid").replaceChildren(...list.map(productCard));
    $("#empty").hidden = list.length > 0;
  }

  /* ---------- Carrito ---------- */
  function addToCart(id, size, color, qty) {
    const p = byId.get(id);
    if (!p || !p.sizes.includes(size) || !colorsOf(p).some((c) => c.id === color) || !Number.isInteger(qty) || qty < 1) return;
    const line = cart.find((l) => l.id === id && l.size === size && l.color === color);
    if (line) line.qty = Math.min(CFG.maxQty, line.qty + qty);
    else cart.push({ id, size, color, qty: Math.min(CFG.maxQty, qty) });
    saveCart(); renderCart();
    const btn = $("#openCart");
    btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    toast(`${p.name} (${colorById.get(color).name}) agregado al carrito`);
  }

  function cartTotal() {
    return cart.reduce((sum, l) => sum + byId.get(l.id).price * l.qty, 0);
  }

  function renderCart() {
    const list = $("#cartList");
    list.replaceChildren(...cart.map((l) => {
      const p = byId.get(l.id);
      const img = el("div", { class: "cart-item__img" });
      img.append(thumb(p, `c-${l.id}-${l.size}-${l.color}`, l.color));
      return el("li", { class: "cart-item" },
        img,
        el("div", {},
          el("div", { class: "cart-item__name", text: p.name }),
          el("div", { class: "cart-item__meta", text: `Talla ${l.size} · ${colorById.get(l.color).name} · ${money.format(p.price)} c/u` }),
          el("div", { class: "cart-item__row" },
            qtySelect(l.qty, `Cantidad de ${p.name}`, (n) => { l.qty = n; saveCart(); renderCart(); }),
            el("button", { class: "link-btn", type: "button", text: "Quitar", onclick: () => removeLine(l) }))),
        el("div", { class: "cart-item__price", text: money.format(p.price * l.qty) }));
    }));
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $("#cartCount").textContent = String(count);
    $("#cartTotal").textContent = money.format(cartTotal());
    $("#cartEmpty").hidden = cart.length > 0;
    $("#checkout").disabled = $("#clearCart").disabled = cart.length === 0;
  }

  function removeLine(line) {
    cart = cart.filter((l) => l !== line);
    saveCart(); renderCart();
  }

  /* ---------- Drawer accesible ---------- */
  const drawer = $("#drawer"), overlay = $("#overlay");
  let lastFocus = null;
  function openCart() {
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
    document.body.classList.add("lock");
    $("#closeCart").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener("keydown", (e) => {
    if (!drawer.classList.contains("open")) return;
    if (e.key === "Escape") return closeCart();
    if (e.key === "Tab") { // focus trap
      const f = [...drawer.querySelectorAll("button:not(:disabled), select, a[href]")];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- WhatsApp ---------- */
  function waLink(text) {
    return `https://wa.me/${CFG.whatsapp}?text=${encodeURIComponent(text)}`;
  }
  function checkout() {
    if (cart.length) window.location.href = "checkout.html";
  }

  /* ---------- Formulario de contacto ---------- */
  function setupContactForm() {
    const form = $("#contactForm"), err = $("#formError");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.elements.name.value.trim();
      const message = form.elements.message.value.trim();
      if (name.length < 2 || message.length < 5) {
        err.textContent = "Completa tu nombre y un mensaje de al menos 5 caracteres.";
        err.hidden = false;
        return;
      }
      err.hidden = true;
      window.open(waLink(`Hola, soy ${name}. ${message}`), "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  /* ---------- Init ---------- */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    const wa = waLink("Hola BRINYSH MOVE, me gustaría recibir información sobre sus productos.");
    $("#waFloat").href = wa;

    $("#heroArt").append(photoFrame(byId.get("p00"), DEFAULT_COLOR, { dots: false }));

    renderChips(); renderGrid(); renderCart(); setupContactForm();

    $("#search").addEventListener("input", (e) => { state.query = e.target.value; renderGrid(); });
    $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
    $("#openCart").addEventListener("click", openCart);
    $("#closeCart").addEventListener("click", closeCart);
    overlay.addEventListener("click", closeCart);
    $("#checkout").addEventListener("click", checkout);
    $("#clearCart").addEventListener("click", () => { cart = []; saveCart(); renderCart(); });

    const burger = $("#burger"), nav = $("#nav");
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => {
      if (e.target.tagName === "A") { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
    });
  }

  init();
})();
