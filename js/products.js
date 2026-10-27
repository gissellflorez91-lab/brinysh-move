// Catálogo de productos (datos estáticos para la demo).
// Colores disponibles para TODAS las prendas.
window.BM_COLORS = Object.freeze([
  { id: "negro", name: "Negro", hex: "#26262c" },
  { id: "azul-marino", name: "Azul marino", hex: "#1f2d6b" },
  { id: "borgona", name: "Borgoña", hex: "#7a1f3d" },
  { id: "verde-oliva", name: "Verde oliva", hex: "#5d6b34" },
]);

// Colores exclusivos de algunos productos (se usan con `colors: [...]` en el producto).
window.BM_EXTRA_COLORS = Object.freeze([
  { id: "fucsia", name: "Fucsia", hex: "#d6145f" },
  { id: "beige", name: "Beige", hex: "#b9a07c" },
  { id: "blanco", name: "Blanco", hex: "#f3efe8" },
  { id: "verde-oscuro", name: "Verde oscuro", hex: "#2f3a2c" },
  { id: "crema", name: "Crema", hex: "#e6d3a8" },
  { id: "salvia", name: "Verde salvia", hex: "#62806c" },
  { id: "nude", name: "Nude", hex: "#e2cfc3" },
]);

// Los productos con `gallery` tienen fotos reales por color; con `images`, fotos únicas (referenciales
// para los demás colores). `photoColor` indica el color real de esas fotos, si es uno de los 4.
window.BM_PRODUCTS = Object.freeze([
  { id: "p23", name: "Enterizo Paris Tejido", category: "Enterizos", price: 82000, badge: "Nuevo", sizes: ["S", "M", "L"],
    colors: ["negro", "salvia", "nude"],
    gallery: { "negro": ["img/paris-negro.jpg"], "salvia": ["img/paris-salvia.jpg"], "nude": ["img/paris-nude.jpg"] } },
  { id: "p22", name: "Enterizo Celestia", category: "Enterizos", price: 74000, badge: "Nuevo", sizes: ["S", "M", "L"],
    colors: ["verde-oscuro", "crema"],
    gallery: { "verde-oscuro": ["img/celestia-verde-oscuro.jpg"], "crema": ["img/celestia-crema.jpg"] } },
  { id: "p21", name: "Enterizo Cierre Sirena", category: "Enterizos", price: 86000, badge: "Nuevo", sizes: ["S", "M", "L"],
    colors: ["blanco", "negro"],
    gallery: { "blanco": ["img/sirena-blanco.jpg"], "negro": ["img/sirena-negro.jpg"] } },
  { id: "p20", name: "Enterizo Estrella", category: "Enterizos", price: 88000, badge: "Nuevo", sizes: ["S", "M", "L"],
    colors: ["fucsia", "beige"],
    gallery: {
      "fucsia": ["img/estrella-fucsia-frente.jpg", "img/estrella-fucsia-espalda.jpg"],
      "beige": ["img/estrella-beige-frente.jpg", "img/estrella-beige-espalda.jpg"],
    } },
  { id: "p15", name: "Short Deportivo Alto Rendimiento", category: "Shorts", price: 28999, badge: "Nuevo", sizes: ["XS", "S", "M", "L"],
    gallery: Object.fromEntries(["negro", "azul-marino", "borgona", "verde-oliva"].map((c) => [c, [`img/short-${c}.jpg`]])) },
  { id: "p14", name: "Falda Deportiva Flea-Pleat", category: "Faldas", price: 25000, badge: "Más vendido", bestSeller: true, sizes: ["XS", "S", "M", "L"],
    gallery: Object.fromEntries(["negro", "azul-marino", "borgona", "verde-oliva"].map((c) => [c, [`img/falda-${c}.jpg`]])) },
  { id: "p13", name: "Leggings Láser Entrelazados", category: "Leggings", price: 70000, badge: "Nuevo", sizes: ["XS", "S", "M", "L"],
    gallery: Object.fromEntries(["negro", "azul-marino", "borgona", "verde-oliva"].map((c) =>
      [c, [`img/leggings-frente-${c}.jpg`, `img/leggings-espalda-${c}.jpg`]])) },
  { id: "p12", name: "Body Deportivo Chic-Sport", category: "Bodys", price: 99900, badge: "Más vendido", bestSeller: true, sizes: ["XS", "S", "M", "L"],
    gallery: {
      "negro": ["img/body-negro.jpg"],
      "azul-marino": ["img/body-azul-marino.jpg"],
      "borgona": ["img/body-borgona.jpg"],
      "verde-oliva": ["img/body-verde-oliva.jpg"],
    } },
  { id: "p11", name: "Enterizo Deportivo Zip-Back", category: "Enterizos", price: 120000, badge: "Más vendido", bestSeller: true, sizes: ["S", "M", "L"], photoColor: "negro",
   
    images: ["img/enterizo-negro-frente.jpg", "img/enterizo-negro-espalda.jpg", "img/enterizo-negro-lunge.jpg", "img/enterizo-negro-espalda-lateral.jpg"] },
  { id: "p00", name: "Enterizo Deportivo Cut-Out", category: "Enterizos", price: 150000, badge: "Nuevo", sizes: ["S", "M", "L"],
   
    images: ["img/enterizo-frente.jpg", "img/enterizo-espalda.jpg", "img/enterizo-frente-cerca.jpg", "img/enterizo-espalda-lateral.jpg"] },
]);
