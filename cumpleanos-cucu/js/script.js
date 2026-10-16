/* Tarjeta de cumpleaños para Cucu — interacciones */
(function () {
  'use strict';

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esMovil = window.matchMedia('(max-width: 600px)').matches;
  var COLORES = ['#8B2BFF', '#B967FF', '#D8B4FE', '#FAF7FF'];

  var portada = document.getElementById('portada');
  var regalo = document.getElementById('regalo');
  var tarjeta = document.getElementById('tarjeta');
  var btnAbrir = document.getElementById('btnAbrir');
  var btnCelebrar = document.getElementById('btnCelebrar');
  var heartsBox = document.getElementById('hearts');

  /* ---------- Canvas: ajuste de tamaño ---------- */
  function ajustar(c) {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    c.width = window.innerWidth * d;
    c.height = window.innerHeight * d;
    var ctx = c.getContext('2d');
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return ctx;
  }

  /* ---------- Estrellas / partículas de fondo ---------- */
  var starsCanvas = document.getElementById('stars');
  var sctx = ajustar(starsCanvas);
  var estrellas = [];

  function crearEstrellas() {
    estrellas = [];
    var n = esMovil ? 45 : 90;
    for (var i = 0; i < n; i++) {
      estrellas.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + .4,
        v: Math.random() * .25 + .05,
        f: Math.random() * Math.PI * 2
      });
    }
  }

  function dibujarEstrellas(t) {
    sctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    estrellas.forEach(function (e) {
      if (!reducir) { e.y -= e.v; if (e.y < -5) e.y = window.innerHeight + 5; }
      var a = .35 + .4 * Math.sin(t / 900 + e.f);
      sctx.beginPath();
      sctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      sctx.fillStyle = 'rgba(216,180,254,' + a.toFixed(2) + ')';
      sctx.shadowColor = '#B967FF';
      sctx.shadowBlur = 8;
      sctx.fill();
    });
    if (!reducir) requestAnimationFrame(dibujarEstrellas);
  }

  /* ---------- Corazones flotantes ---------- */
  var intervaloCorazones = null;
  function corazon() {
    var h = document.createElement('span');
    h.className = 'corazon-flota';
    h.textContent = Math.random() > .3 ? '💜' : '✦';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (Math.random() * 14 + 12) + 'px';
    h.style.setProperty('--deriva', (Math.random() * 60 - 30) + 'px');
    h.style.animationDuration = (Math.random() * 5 + 7) + 's';
    heartsBox.appendChild(h);
    setTimeout(function () { h.remove(); }, 13000);
  }
  function iniciarCorazones() {
    if (reducir || intervaloCorazones) return;
    intervaloCorazones = setInterval(corazon, esMovil ? 1600 : 1000);
  }
  function rafagaCorazones(n) {
    for (var i = 0; i < n; i++) setTimeout(corazon, i * 90);
  }

  /* ---------- Confeti ---------- */
  var cCanvas = document.getElementById('confetti');
  var cctx = ajustar(cCanvas);
  var piezas = [];
  var animandoConfeti = false;

  function lanzarConfeti() {
    if (reducir) { rafagaCorazones(6); return; }
    var n = esMovil ? 90 : 160;
    for (var i = 0; i < n; i++) {
      piezas.push({
        x: window.innerWidth / 2 + (Math.random() - .5) * 120,
        y: window.innerHeight * .55,
        vx: (Math.random() - .5) * 16,
        vy: -(Math.random() * 14 + 6),
        w: Math.random() * 8 + 5, h: Math.random() * 5 + 3,
        rot: Math.random() * 6, vr: (Math.random() - .5) * .35,
        c: COLORES[Math.floor(Math.random() * COLORES.length)],
        vida: 1
      });
    }
    rafagaCorazones(10);
    if (!animandoConfeti) { animandoConfeti = true; requestAnimationFrame(pasoConfeti); }
  }

  function pasoConfeti() {
    cctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    piezas = piezas.filter(function (p) { return p.vida > 0 && p.y < window.innerHeight + 20; });
    piezas.forEach(function (p) {
      p.vy += .3; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vida -= .005;
      cctx.save();
      cctx.translate(p.x, p.y); cctx.rotate(p.rot);
      cctx.globalAlpha = Math.max(p.vida, 0);
      cctx.fillStyle = p.c;
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    if (piezas.length) requestAnimationFrame(pasoConfeti);
    else { animandoConfeti = false; cctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }

  /* ---------- Abrir el regalo ---------- */
  var abierto = false;
  btnAbrir.addEventListener('click', function () {
    if (abierto) return;
    abierto = true;
    btnAbrir.disabled = true;
    regalo.classList.add('abierto');
    lanzarConfeti();
    setTimeout(function () {
      portada.classList.add('sale');
      tarjeta.hidden = false;
      window.scrollTo(0, 0);
      setTimeout(function () { portada.hidden = true; }, 700);
    }, reducir ? 0 : 1100);
  });

  /* ---------- Botón de celebración ---------- */
  btnCelebrar.addEventListener('click', lanzarConfeti);

  /* ---------- Inicio y redimensionado ---------- */
  window.addEventListener('resize', function () {
    sctx = ajustar(starsCanvas);
    cctx = ajustar(cCanvas);
    crearEstrellas();
    if (reducir) dibujarEstrellas(0);
  });

  crearEstrellas();
  requestAnimationFrame(dibujarEstrellas);
  iniciarCorazones();
})();
