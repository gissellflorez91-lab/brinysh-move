# BRINYSH MOVE – Tienda demo de ropa deportiva (B2C)

Sitio estático (HTML + CSS + JS puro, sin dependencias ni build).

## Estructura
```
index.html
css/styles.css
js/config.js     ← número de WhatsApp, moneda, cantidad máxima
js/products.js   ← catálogo (editar precios/productos aquí)
js/app.js        ← catálogo, filtros, carrito, WhatsApp
```

## Probar en local
```
python3 -m http.server 8080
```
Abrir http://localhost:8080

## Personalizar
- Cambia `whatsapp` en `js/config.js` (formato internacional, solo dígitos).
- Cambia correo y teléfono en la sección `#contacto` de `index.html`.

## Publicar gratis (GitHub Pages)
1. Crea un repositorio público en GitHub (ej. `brinysh-move`).
2. Sube los archivos (arrastrándolos en la web o con `git push`).
3. Settings → Pages → Source: *Deploy from a branch* → `main` / `/ (root)` → Save.
4. En ~1 minuto estará en `https://TU_USUARIO.github.io/brinysh-move/`.

Alternativas gratuitas: Netlify Drop (arrastrar la carpeta en https://app.netlify.com/drop) o Cloudflare Pages.
