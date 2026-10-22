// Catálogo de productos (datos estáticos para la demo).
// Colores disponibles para TODAS las prendas.
window.BM_COLORS = Object.freeze([
  { id: "negro", name: "Negro", hex: "#26262c" },
  { id: "azul-marino", name: "Azul marino", hex: "#1f2d6b" },
  { id: "borgona", name: "Borgoña", hex: "#7a1f3d" },
  { id: "verde-oliva", name: "Verde oliva", hex: "#5d6b34" },
]);

// Los productos con `gallery` tienen fotos reales por color; con `images`, fotos únicas (referenciales
// para los demás colores). `photoColor` indica el color real de esas fotos, si es uno de los 4.
window.BM_PRODUCTS = Object.freeze([
  { id: "p19", name: "Conjunto Deportivo Asimétrico", category: "Conjuntos", price: 87000, badge: "Nuevo", sizes: ["S", "M", "L", "XL"],
    gallery: Object.fromEntries(["negro", "azul-marino", "borgona", "verde-oliva"].map((c) =>
      [c, [`img/conjunto2-${c}-frente.jpg`, `img/conjunto2-${c}-espalda.jpg`]])) },
  { id: "p18", name: "Conjunto Deportivo University", category: "Conjuntos", price: 184000, badge: "Nuevo", sizes: ["S", "M", "L", "XL"],
    gallery: Object.fromEntries(["negro", "azul-marino", "borgona", "verde-oliva"].map((c) =>
      [c, [`img/conjunto-${c}-frente.jpg`, `img/conjunto-${c}-espalda.jpg`]])) },
  { id: "p17", name: "Sudadera Algodón Perchado", category: "Sudaderas", price: 134500, badge: "Nuevo", sizes: ["Talla única"],
    gallery: {
      "negro": ["img/sudadera-negro-1.jpg", "img/sudadera-negro-2.jpg"],
      "azul-marino": ["img/sudadera-azul-marino-1.jpg", "img/sudadera-azul-marino-2.jpg", "img/sudadera-azul-marino-3.jpg"],
      "borgona": ["img/sudadera-borgona-1.jpg", "img/sudadera-borgona-2.jpg", "img/sudadera-borgona-3.jpg"],
      "verde-oliva": ["img/sudadera-verde-oliva-1.jpg"],
    } },
  { id: "p16", name: "Tracksuit Deportivo Sport", category: "Sudaderas", price: 200000, badge: "Nuevo", sizes: ["S", "M", "L", "XL"],
    gallery: {
      "negro": ["img/tracksuit-negro-1.jpg", "img/tracksuit-negro-2.jpg"],
      "azul-marino": ["img/tracksuit-azul-marino-1.jpg", "img/tracksuit-azul-marino-2.jpg"],
      "borgona": ["img/tracksuit-borgona-1.jpg"],
      "verde-oliva": ["img/tracksuit-verde-oliva-1.jpg", "img/tracksuit-verde-oliva-2.jpg"],
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
  { id: "p01", name: "Camiseta Dry-Fit Pro", category: "Camisetas", price: 69900, shape: "tee", badge: "Nuevo", sizes: ["S", "M", "L", "XL"] },
  { id: "p02", name: "Camiseta Training Core", category: "Camisetas", price: 54900, shape: "tee", badge: "", sizes: ["S", "M", "L", "XL"] },
  { id: "p03", name: "Leggings Flex High-Waist", category: "Leggings", price: 99900, shape: "leggings", badge: "", sizes: ["XS", "S", "M", "L"] },
  { id: "p04", name: "Leggings Seamless Sculpt", category: "Leggings", price: 119900, shape: "leggings", badge: "", sizes: ["XS", "S", "M", "L"] },
  { id: "p05", name: "Short Runner 5\"", category: "Shorts", price: 64900, shape: "shorts", badge: "", sizes: ["S", "M", "L", "XL"] },
  { id: "p06", name: "Short Compress Lite", category: "Shorts", price: 59900, shape: "shorts", badge: "Oferta", sizes: ["S", "M", "L", "XL"] },
  { id: "p07", name: "Top Deportivo Impact", category: "Tops", price: 74900, shape: "top", badge: "", sizes: ["XS", "S", "M", "L"] },
  { id: "p08", name: "Top Soft Support", category: "Tops", price: 69900, shape: "top", badge: "Nuevo", sizes: ["XS", "S", "M", "L"] },
  { id: "p09", name: "Sudadera Oversize Move", category: "Sudaderas", price: 149900, shape: "hoodie", badge: "", sizes: ["S", "M", "L", "XL"] },
  { id: "p10", name: "Chaqueta Windbreaker", category: "Sudaderas", price: 179900, shape: "jacket", badge: "", sizes: ["S", "M", "L", "XL"] },
]);
