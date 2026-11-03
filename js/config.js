// Configuración del negocio. Cambia estos valores por los reales.
window.BM_CONFIG = Object.freeze({
  // Número de WhatsApp en formato internacional, solo dígitos (57 = Colombia).
  whatsapp: "573207108500",
  currency: "COP",
  locale: "es-CO",
  maxQty: 10,
  // URL /exec del Apps Script que escribe en Google Sheets (ver apps-script/LEEME.md).
  // Vacío = modo local: los registros quedan en la consola y en localStorage.
  sheetsEndpoint: "https://script.google.com/macros/s/AKfycbxxcwDCHrHT6kZ_TMCcm735gb1JMz6ufONZH_lsfqtybCFfyNcp0PbMou2_zF-Md5JBCQ/exec",
});
