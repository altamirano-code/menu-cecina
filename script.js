/* =========================================================
   CONFIGURACIÓN DEL NEGOCIO
   Cambia aquí los datos y se actualizan en toda la página.
   ========================================================= */
const CONFIG = {
  whatsapp: '527355070316',            // código de país + número, sin espacios
  mensajeWhatsApp: 'Hola, me gustaría hacer un pedido de Cecina de Yecapixtla.',
  telefono1: '7774966658',
  telefono2: '7355070316',
  instagram: '#',                      // enlace al perfil oficial
  facebook: '#',                       // enlace a la página oficial
  resenas: '#'                         // enlace a las reseñas de Google
};

/* Productos del menú */
const MENU = [
  { id: 'cecina',    nombre: 'Kilo de cecina',           descripcion: 'El sabor tradicional de Yecapixtla.',   precio: 380, unidad: 'Por kilogramo',        icono: 'cecina' },
  { id: 'enchilada', nombre: 'Kilo de cecina enchilada', descripcion: 'Un toque de sabor y tradición.',         precio: 160, unidad: 'Unidad por confirmar', icono: 'enchilada' },
  { id: 'longaniza', nombre: 'Kilo de longaniza',        descripcion: 'Ideal para compartir en familia.',       precio: 140, unidad: 'Por kilogramo',        icono: 'longaniza' },
  { id: 'taco',      nombre: 'Taco',                     descripcion: 'Pregunta por las opciones disponibles.', precio: 30,  unidad: 'Por pieza',            icono: 'taco' }
];

/* Iconos ilustrados de cada producto (SVG en línea) */
const ICONOS = {
  cecina: `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M8 8h24v12c0 7-5 12-12 13C13 32 8 27 8 20Z" fill="#c62f2f" stroke="#3a0d0d" stroke-width="2"/>
      <path d="M14 13l2 6M20 12l-1 8M26 13l-2 6M16 22l1 4M24 22l-1 4" stroke="#f3d3c4" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
  enchilada: `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M8 8h24v12c0 7-5 12-12 13C13 32 8 27 8 20Z" fill="#a81d22" stroke="#3a0d0d" stroke-width="2"/>
      <path d="M14 12v7M26 12v7M20 22v4" stroke="#f3d3c4" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="17" cy="16" r="1" fill="#f3d3c4"/><circle cx="23" cy="18" r="1" fill="#f3d3c4"/>
    </svg>`,
  longaniza: `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M9 27c-3-4 0-10 6-13s11-6 14-3 1 9-5 13-12 7-15 3Z" fill="#c4452c" stroke="#3a0d0d" stroke-width="2"/>
      <path d="M15 21c3-1 6-3 9-6" stroke="#f3d3c4" stroke-width="1.8" stroke-linecap="round" fill="none"/>
      <circle cx="14" cy="25" r="1.2" fill="#f3d3c4"/><circle cx="25" cy="14" r="1.2" fill="#f3d3c4"/>
    </svg>`,
  taco: `
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path d="M6 28a14 14 0 0 1 28 0Z" fill="#f2b33d" stroke="#3a0d0d" stroke-width="2"/>
      <path d="M11 24c3-4 6-5 9-5s6 1 9 5" fill="#c62f2f" stroke="#3a0d0d" stroke-width="1.5"/>
      <path d="M13 23l2-2M19 21l1-2M25 22l1-2" stroke="#3b8f3b" stroke-width="2" stroke-linecap="round"/>
    </svg>`
};

/* =========================================================
   UTILIDADES
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* 7774966658 -> "777 496 6658" */
const formatearTelefono = (tel) => tel.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');

/* =========================================================
   ENLACES (WhatsApp, teléfonos y redes)
   ========================================================= */
function configurarEnlaces() {
  const urlWhatsApp = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.mensajeWhatsApp)}`;

  $$('.js-whatsapp').forEach(a => (a.href = urlWhatsApp));
  $$('.js-instagram').forEach(a => (a.href = CONFIG.instagram));
  $$('.js-facebook').forEach(a => (a.href = CONFIG.facebook));
  $$('.js-reviews').forEach(a => (a.href = CONFIG.resenas));

  $('.js-tel1').href = `tel:+52${CONFIG.telefono1}`;
  $('.js-tel2').href = `tel:+52${CONFIG.telefono2}`;
  $('.js-tel1-text').textContent = formatearTelefono(CONFIG.telefono1);
  $('.js-tel2-text').textContent = formatearTelefono(CONFIG.telefono2);
}

/* =========================================================
   MENÚ: tarjetas y lista del celular
   ========================================================= */
function pintarMenu() {
  $('#menuGrid').innerHTML = MENU.map((p, i) => `
    <article class="menu-card reveal" style="transition-delay:${i * 80}ms">
      <div class="menu-card__top">
        <div class="menu-card__icon">${ICONOS[p.icono]}</div>
        <div class="menu-card__info">
          <h3>${p.nombre}</h3>
          <p>${p.descripcion}</p>
        </div>
        <span class="menu-card__price">$${p.precio}</span>
      </div>
      <div class="menu-card__foot">
        <span class="menu-card__unit">${p.unidad}</span>
        <button class="btn-add" type="button" data-add="${p.id}">+ Agregar</button>
      </div>
    </article>
  `).join('');

  $('#phoneList').innerHTML = MENU.map(p => `
    <li><span>${p.nombre}</span><b>$${p.precio}</b></li>
  `).join('');
}

/* =========================================================
   TU PEDIDO (carrito)
   El pedido se guarda en el navegador para no perderlo al recargar.
   ========================================================= */
const CLAVE_PEDIDO = 'cecina_pedido';
let pedido = {};   // { idProducto: cantidad }

const buscarProducto = (id) => MENU.find(p => p.id === id);
const formatearPrecio = (n) => '$' + n.toLocaleString('es-MX');

function cargarPedido() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_PEDIDO));
    if (guardado && typeof guardado === 'object') {
      // Solo se conservan productos que sigan existiendo en el menú
      Object.entries(guardado).forEach(([id, cant]) => {
        if (buscarProducto(id) && cant > 0) pedido[id] = cant;
      });
    }
  } catch (e) { pedido = {}; }
}

function guardarPedido() {
  try { localStorage.setItem(CLAVE_PEDIDO, JSON.stringify(pedido)); } catch (e) { /* sin almacenamiento */ }
}

function cambiarCantidad(id, delta) {
  const nueva = (pedido[id] || 0) + delta;
  if (nueva <= 0) delete pedido[id];
  else pedido[id] = nueva;
  guardarPedido();
  pintarPedido();
}

function mensajePedido(items, total) {
  const lineas = items.map(({ p, cant }) =>
    `• ${cant} x ${p.nombre} — ${formatearPrecio(p.precio * cant)}`
  );
  return [
    'Hola, me gustaría hacer el siguiente pedido:',
    '',
    ...lineas,
    '',
    `Subtotal de referencia: ${formatearPrecio(total)}`,
    '¿Me confirman disponibilidad y total? Gracias.'
  ].join('\n');
}

function pintarPedido() {
  const items = Object.entries(pedido).map(([id, cant]) => ({ p: buscarProducto(id), cant }));
  const total = items.reduce((suma, { p, cant }) => suma + p.precio * cant, 0);
  const vacio = items.length === 0;

  $('#orderEmpty').hidden = !vacio;
  $('#orderSummary').hidden = vacio;
  $('#orderClear').hidden = vacio;

  $('#orderList').innerHTML = items.map(({ p, cant }) => `
    <li class="order__item">
      <span class="order__name">${p.nombre}<small>${p.unidad}</small></span>
      <div class="qty">
        <button type="button" data-qty="${p.id}" data-delta="-1" aria-label="Quitar uno">−</button>
        <span>${cant}</span>
        <button type="button" data-qty="${p.id}" data-delta="1" aria-label="Agregar uno">+</button>
      </div>
      <span class="order__price">${formatearPrecio(p.precio * cant)}</span>
    </li>
  `).join('');

  $('#orderTotal').textContent = formatearPrecio(total);
  $('#orderSend').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensajePedido(items, total))}`;

  // Marca en verde los botones de productos que ya están en el pedido
  $$('[data-add]').forEach(btn => {
    const cant = pedido[btn.dataset.add];
    btn.classList.toggle('is-added', Boolean(cant));
    btn.textContent = cant ? `✓ Agregado (${cant})` : '+ Agregar';
  });
}

let temporizadorAviso;
function mostrarAviso(texto) {
  let aviso = $('.toast');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.className = 'toast';
    aviso.setAttribute('role', 'status');
    document.body.appendChild(aviso);
  }
  aviso.textContent = texto;
  aviso.classList.add('is-visible');
  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => aviso.classList.remove('is-visible'), 1800);
}

function configurarPedido() {
  cargarPedido();

  // Botones "+ Agregar" del menú
  $('#menuGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    cambiarCantidad(btn.dataset.add, 1);
    mostrarAviso(`${buscarProducto(btn.dataset.add).nombre} agregado al pedido`);
  });

  // Botones − y + dentro del pedido
  $('#orderList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty]');
    if (btn) cambiarCantidad(btn.dataset.qty, Number(btn.dataset.delta));
  });

  // Vaciar pedido
  $('#orderClear').addEventListener('click', () => {
    pedido = {};
    guardarPedido();
    pintarPedido();
  });

  pintarPedido();
}

/* =========================================================
   ENCABEZADO: sombra al hacer scroll y menú móvil
   ========================================================= */
function configurarEncabezado() {
  const header = $('#header');
  const nav = $('#nav');
  const toggle = $('#navToggle');

  const alHacerScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', alHacerScroll, { passive: true });
  alHacerScroll();

  const cerrarMenu = () => {
    nav.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', abierto);
    toggle.setAttribute('aria-expanded', String(abierto));
  });

  $$('a', nav).forEach(a => a.addEventListener('click', cerrarMenu));
}

/* =========================================================
   ANIMACIÓN DE APARICIÓN
   ========================================================= */
function configurarAnimaciones() {
  const elementos = $$('.reveal');

  if (!('IntersectionObserver' in window)) {
    elementos.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observer.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.15 });

  elementos.forEach(el => observer.observe(el));
}

/* =========================================================
   INICIO
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  pintarMenu();
  configurarEnlaces();
  configurarPedido();
  configurarEncabezado();
  configurarAnimaciones();
  $('#year').textContent = new Date().getFullYear();
});
