(function () {
  "use strict";

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Índice: en pantallas pequeñas arranca cerrado
  var box = document.getElementById("tocBox");
  var mq = window.matchMedia("(max-width: 860px)");
  function syncToc() { if (box) box.open = !mq.matches; }
  syncToc();
  if (mq.addEventListener) mq.addEventListener("change", syncToc);
  if (box) {
    box.addEventListener("click", function (e) {
      if (mq.matches && e.target.closest && e.target.closest(".toc__list a")) box.open = false;
    });
  }

  // Resalta la sección visible en el índice
  var links = {};
  Array.prototype.forEach.call(document.querySelectorAll(".toc__list a"), function (a) {
    links[a.getAttribute("href").slice(1)] = a;
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
        var a = links[en.target.id];
        if (a) a.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-90px 0px -65% 0px" });
    Array.prototype.forEach.call(document.querySelectorAll(".legal__body > section"), function (s) { io.observe(s); });
  }

  // Botón volver arriba
  var top = document.getElementById("toTop");
  if (top) {
    window.addEventListener("scroll", function () { top.hidden = window.scrollY < 600; }, { passive: true });
    top.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
  }
})();
