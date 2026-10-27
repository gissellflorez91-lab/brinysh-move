(() => {
  "use strict";

  const CFG = window.BM_CONFIG;
  const byId = new Map(window.BM_PRODUCTS.map((p) => [p.id, p]));
  const STORAGE_KEY = "bm_cart_v1";
  const colorName = new Map([...window.BM_COLORS, ...(window.BM_EXTRA_COLORS || [])].map((c) => [c.id, c.name]));
  const $ = (s, r = document) => r.querySelector(s);
  const money = new Intl.NumberFormat(CFG.locale, { style: "currency", currency: CFG.currency, maximumFractionDigits: 0 });

  const DOC_TYPES = {
    natural: [["CC", "Cédula de ciudadanía"], ["CE", "Cédula de extranjería"], ["PP", "Pasaporte"]],
    juridica: [["NIT", "NIT"]],
  };

  /* ---------- Carrito (validado contra el catálogo; los precios nunca vienen del storage) ---------- */
  function loadCart() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter((l) => {
        const p = l && byId.get(l.id);
        return p && p.sizes.includes(l.size) && Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= CFG.maxQty;
      }).map((l) => ({ ...l, color: colorName.has(l.color) ? l.color : window.BM_COLORS[0].id }));
    } catch { return []; }
  }
  const cart = loadCart();
  const total = cart.reduce((s, l) => s + byId.get(l.id).price * l.qty, 0);

  function el(tag, props = {}, ...kids) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) k === "text" ? (n.textContent = v) : n.setAttribute(k, v);
    n.append(...kids);
    return n;
  }
  const show = (id) => {
    ["viewForm", "viewBank", "viewResult"].forEach((v) => { $("#" + v).hidden = v !== id; });
    window.scrollTo({ top: 0 });
  };

  /* ---------- Referencia de pedido ---------- */
  function newReference() {
    const rnd = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
    return `BM-${Date.now().toString(36).toUpperCase()}-${rnd}`;
  }

  /* ---------- Formulario ---------- */
  function fillSelects() {
    const bank = $("#bank");
    bank.append(el("option", { value: "", text: "— Selecciona tu banco —" }));
    window.BM_BANKS.forEach((b) => bank.append(el("option", { value: b, text: b })));
    syncDocTypes();
  }
  function syncDocTypes() {
    const docType = $("#docType");
    docType.replaceChildren(...DOC_TYPES[$("#personType").value].map(([v, t]) => el("option", { value: v, text: `${v} – ${t}` })));
  }
  function renderSummary() {
    $("#sumList").replaceChildren(...cart.map((l) => {
      const p = byId.get(l.id);
      return el("li", {},
        el("span", { text: `${l.qty} × ${p.name} (${l.size}, ${colorName.get(l.color)})` }),
        el("span", { text: money.format(p.price * l.qty) }));
    }));
    $("#sumTotal").textContent = money.format(total);
  }

  const RULES = {
    docNumber: (v, f) => {
      const t = f.docType.value;
      if (t === "PP") return /^[A-Za-z0-9]{5,12}$/.test(v) || "Pasaporte inválido (5 a 12 caracteres).";
      if (t === "NIT") return /^\d{9,10}$/.test(v) || "El NIT debe tener 9 o 10 dígitos, sin guion.";
      return /^\d{5,10}$/.test(v) || "Ingresa solo números (5 a 10 dígitos).";
    },
    fullName: (v) => v.length >= 3 || "Ingresa tu nombre completo.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || "Correo electrónico inválido.",
    phone: (v) => /^3\d{9}$/.test(v) || "Celular colombiano de 10 dígitos que inicie por 3.",
    city: (v) => v.length >= 3 || "Ingresa tu ciudad.",
    address: (v) => v.length >= 6 || "Ingresa tu dirección completa.",
    bank: (v) => window.BM_BANKS.includes(v) || "Selecciona tu banco.",
  };

  function validate(form) {
    let ok = true;
    document.querySelectorAll(".err").forEach((e) => { e.textContent = ""; });
    const setErr = (name, msg) => { $(`.err[data-for="${name}"]`).textContent = msg; ok = false; };
    for (const [name, rule] of Object.entries(RULES)) {
      const res = rule(form.elements[name].value.trim(), form.elements);
      if (res !== true) setErr(name, res);
    }
    if (!form.elements.terms.checked) setErr("terms", "Debes aceptar los términos para continuar.");
    return ok;
  }

  /* ---------- Flujo de pago simulado ---------- */
  let order = null;

  function startPayment(form) {
    order = {
      ref: newReference(),
      bank: form.elements.bank.value,
      amount: total,
      // En producción: estos datos viajan al backend, que crea la transacción en la pasarela.
    };
    $("#payBtn").disabled = true;
    $("#payBtn").textContent = "Redirigiendo a tu banco…";
    setTimeout(() => {
      $("#bankName").textContent = order.bank;
      $("#bankRef").textContent = order.ref;
      $("#bankAmount").textContent = money.format(order.amount);
      show("viewBank");
    }, 1200);
  }

  const RESULTS = {
    approved: { icon: "✓", cls: "ok", title: "¡Pago aprobado!", state: "Aprobada", text: "Recibimos tu pago. Te enviaremos la confirmación y la guía de envío a tu correo." },
    pending: { icon: "…", cls: "wait", title: "Pago pendiente", state: "Pendiente", text: "Tu banco aún está procesando la transacción. Te avisaremos por correo cuando se confirme." },
    rejected: { icon: "✕", cls: "bad", title: "Pago rechazado", state: "Rechazada", text: "Tu banco no autorizó la transacción. No se realizó ningún cobro; puedes intentarlo de nuevo." },
  };

  function finish(status) {
    const r = RESULTS[status];
    if (!r || !order) return;
    const icon = $("#resIcon");
    icon.textContent = r.icon;
    icon.className = `result__icon ${r.cls}`;
    $("#resTitle").textContent = r.title;
    $("#resText").textContent = r.text;
    $("#resRef").textContent = order.ref;
    $("#resState").textContent = r.state;
    $("#resBank").textContent = order.bank;
    $("#resAmount").textContent = money.format(order.amount);
    $("#resDate").textContent = new Intl.DateTimeFormat(CFG.locale, { dateStyle: "long", timeStyle: "short" }).format(new Date());
    $("#resRetry").hidden = status !== "rejected";
    if (status !== "rejected") {
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* sin storage */ }
    }
    show("viewResult");
  }

  /* ---------- Init ---------- */
  function init() {
    if (!cart.length) {
      $("#viewForm").hidden = true;
      $("#emptyCart").hidden = false;
      return;
    }
    fillSelects();
    renderSummary();
    $("#personType").addEventListener("change", syncDocTypes);
    const form = $("#payForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (validate(form)) startPayment(form);
    });
    document.querySelectorAll("[data-result]").forEach((b) =>
      b.addEventListener("click", () => finish(b.dataset.result)));
  }

  init();
})();
