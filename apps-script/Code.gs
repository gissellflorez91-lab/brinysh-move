/**
 * Backend de BRINYSH MOVE (demo universitaria) – Google Apps Script.
 * Recibe pedidos y encuestas desde la tienda y los escribe en dos hojas de Drive.
 * Instrucciones de despliegue: ver apps-script/LEEME.md
 */
const PEDIDOS_ID = "1PhpJGzUXuiw-4Ab4nbnEQq1kw03fwmws0J9WpLdTD38";   // BASE DE PEDIDOS E-COMMERCE
const ENCUESTAS_ID = "1fNufwc3ZDhOWd8ar4lGy0ScUVQVmV2ls1SbsD3TdPiE"; // ENCUESTAS SATISFACCION E-COMMERCE

const PEDIDOS_HEADERS = ["Fecha", "Referencia", "Comprador", "Tipo documento", "Número documento", "Correo", "Celular",
  "Ciudad", "Dirección", "Productos", "Cantidades", "Total (COP)", "Banco", "Estado del pago"];
const ENCUESTAS_HEADERS = ["Fecha", "Referencia", "P1 Satisfaccion general (1-5)", "P2 Facilidad del proceso de compra (1-5)",
  "P3 Claridad de fotos/tallas/precios (1-5)", "P4 Probabilidad de recomendar (0-10)", "P5 Comentarios o sugerencias"];
const ESTADOS = ["Iniciado", "Aprobada", "Pendiente", "Rechazada"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const data = JSON.parse(e.postData.contents);
    if (data.type === "order") saveOrder(data);
    else if (data.type === "status") updateStatus(data);
    else if (data.type === "survey") saveSurvey(data);
    else throw new Error("tipo desconocido");
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err.message || err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return json({ ok: true, service: "brinysh-move" }); }

/* ---------- Pedidos: se registran al pulsar "Pagar" ---------- */
function saveOrder(d) {
  const ref = ref_(d.ref);
  const sheet = sheet_(PEDIDOS_ID, PEDIDOS_HEADERS);
  const o = d.order || {};
  const items = Array.isArray(o.items) ? o.items.slice(0, 30) : [];
  const row = [
    now_(), ref, txt_(o.fullName, 80), txt_(o.docType, 4), txt_(o.docNumber, 15), txt_(o.email, 100), txt_(o.phone, 10),
    txt_(o.city, 60), txt_(o.address, 100),
    items.map(function (i) { return txt_(i.name, 80) + " (" + txt_(i.size, 20) + ", " + txt_(i.color, 30) + ")"; }).join("\n"),
    items.map(function (i) { return Math.max(1, Math.min(10, Number(i.qty) || 1)); }).join("\n"),
    Math.max(0, Math.round(Number(o.total) || 0)),
    txt_(o.bank, 60), "Iniciado",
  ];
  if (findRow_(sheet, ref) === 0) {
    sheet.appendRow(row);
    sheet.getRange(sheet.getLastRow(), 12).setNumberFormat("$#,##0"); // Total (COP), independiente del idioma de la hoja
  }
}

function updateStatus(d) {
  const ref = ref_(d.ref);
  if (ESTADOS.indexOf(d.status) < 1) throw new Error("estado inválido");
  const sheet = sheet_(PEDIDOS_ID, PEDIDOS_HEADERS);
  const r = findRow_(sheet, ref);
  if (r === 0) throw new Error("pedido no encontrado");
  sheet.getRange(r, PEDIDOS_HEADERS.length).setValue(d.status);
}

/* ---------- Encuesta: solo si el pedido existe y está aprobado, una vez por pedido ---------- */
function saveSurvey(d) {
  const ref = ref_(d.ref);
  const pedidos = sheet_(PEDIDOS_ID, PEDIDOS_HEADERS);
  const r = findRow_(pedidos, ref);
  if (r === 0 || pedidos.getRange(r, PEDIDOS_HEADERS.length).getValue() !== "Aprobada") throw new Error("pedido no aprobado");
  const a = d.answers || {};
  const sheet = sheet_(ENCUESTAS_ID, ENCUESTAS_HEADERS);
  if (findRow_(sheet, ref) !== 0) throw new Error("encuesta ya registrada");
  sheet.appendRow([now_(), ref, int_(a.q1, 1, 5), int_(a.q2, 1, 5), int_(a.q3, 1, 5), int_(a.q4, 0, 10), txt_(a.q5, 500)]);
}

/* ---------- Utilidades ---------- */
function sheet_(id, headers) {
  const sheet = SpreadsheetApp.openById(id).getSheets()[0];
  const cur = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  if (cur.join("|") !== headers.join("|")) sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight("bold");
  return sheet;
}
function findRow_(sheet, ref) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const col = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (let i = col.length - 1; i >= 0; i--) if (col[i][0] === ref) return i + 2;
  return 0;
}
function ref_(v) {
  v = String(v || "");
  if (!/^BM-[A-Z0-9]{1,12}-[A-Z0-9]{6}$/.test(v)) throw new Error("referencia inválida");
  return v;
}
// Recorta y neutraliza fórmulas (=, +, -, @) para evitar inyección en la hoja.
function txt_(v, max) {
  v = String(v == null ? "" : v).replace(/\r/g, "").trim().slice(0, max);
  return /^[=+\-@\t]/.test(v) ? "'" + v : v;
}
function int_(v, min, max) {
  v = Number(v);
  if (!Number.isInteger(v) || v < min || v > max) throw new Error("respuesta fuera de rango");
  return v;
}
function now_() { return Utilities.formatDate(new Date(), "America/Bogota", "dd/MM/yyyy HH:mm:ss"); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
