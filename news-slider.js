// news-slider.js: Slider automático de imágenes para noticias
window.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('newsSlider');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slider) return;
  const slides = Array.from(slider.querySelectorAll('img'));
  let current = 0;
  let intervalId = null;

  // Crear dots
  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  function goToSlide(idx) {
    current = idx;
    slider.style.transform = `translateX(-${idx * 100}vw)`;
    dotsContainer.querySelectorAll('.slider-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  function nextSlide() {
    goToSlide((current + 1) % slides.length);
  }

  function resetInterval() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, 2000);
  }

  // Iniciar
  goToSlide(0);
  intervalId = setInterval(nextSlide, 2000);

  // Detener el slider al salir de la página
  window.addEventListener('beforeunload', () => clearInterval(intervalId));
});
