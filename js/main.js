// main.js
// Ejemplo: efecto “pop” al cargar los botones
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn').forEach((btn, i) => {
    setTimeout(() => btn.classList.add('visible'), i * 100);
  });
});
