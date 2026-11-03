# Conectar la tienda con Google Sheets

La tienda es un sitio estático: el navegador no puede escribir en Drive sin una credencial, y esa credencial no debe ir en el código público. Por eso se usa este Apps Script como intermediario.

1. Entra a https://script.google.com con la cuenta dueña de las dos hojas → **Nuevo proyecto**.
2. Pega el contenido de `Code.gs` (reemplaza todo) y guarda.
3. **Implementar → Nueva implementación → Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier persona**
   - Acepta los permisos de Drive/Hojas cuando los pida.
4. Copia la URL que termina en `/exec` y pégala en `js/config.js` → `sheetsEndpoint`.
5. Recarga la tienda y haz una compra de prueba.

Hojas: pedidos `BASE DE PEDIDOS E-COMMERCE` (se añaden las columnas *Banco* y *Estado del pago*) y encuestas `ENCUESTAS SATISFACCION E-COMMERCE`.
Si cambias el código, crea una **nueva versión** de la implementación (la URL se mantiene).
