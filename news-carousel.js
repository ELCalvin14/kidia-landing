// news-carousel.js: Carrusel de noticias minimalista y responsivo en index.html
// Usa las 3 noticias más recientes del mismo array que news-dynamic.js

// Acceso global a newsData si existe
// newsDataCarousel multilingüe

let newsDataCarousel = [];
function getNewsDataForLang(lang) {
  if (lang === 'es-MX' || typeof newsTranslations === 'undefined') return newsDataES;
  return newsDataES.map((item, idx) => {
    const t = newsTranslations[idx] && newsTranslations[idx][lang];
    if (!t) return item;
    return {
      ...item,
      title: t.title || item.title,
      content: t.content || item.content
    };
  });
}
function updateNewsCarousel(lang) {
  newsDataCarousel = getNewsDataForLang(lang);
  if (typeof renderNewsCarousel === 'function') renderNewsCarousel();
}
document.addEventListener('DOMContentLoaded', function() {
  const lang = localStorage.getItem('lang') || 'es-MX';
  updateNewsCarousel(lang);
  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', function() {
      updateNewsCarousel(select.value);
    });
  }
});

function renderCarouselMedia(mediaArr) {
  if (!Array.isArray(mediaArr) || !mediaArr.length) return '';
  // Filtrar imágenes y videos
  const imgs = mediaArr.filter(x => x.type === 'img');
  const videos = mediaArr.filter(x => x.type === 'video');
  if (imgs.length > 1) {
    // Mini-carrusel de imágenes
    const slides = imgs.map((m, i) => `<img src="${m.src}" alt="${m.alt || ''}" class="news-carousel-img${i === 0 ? ' active' : ''}" data-img-idx="${i}">`).join('');
    const dots = imgs.map((_, i) => `<span class="news-carousel-dot${i === 0 ? ' active' : ''}" data-dot-idx="${i}"></span>`).join('');
    return `<div class="news-carousel-media-multislider">${slides}<div class="news-carousel-dots">${dots}</div></div>`;
  } else if (imgs.length === 1) {
    // Solo una imagen
    const m = imgs[0];
    return `<div class="news-carousel-media"><img src="${m.src}" alt="${m.alt || ''}" class="news-carousel-fixedimg"></div>`;
  } else if (videos.length > 0) {
    // Si no hay imagen, mostrar el primer video
    const v = videos[0];
    return `<div class="news-carousel-media"><video src="${v.src}" controls preload="none" class="news-carousel-fixedimg"></video></div>`;
  }
  return '';
}

// Unir todos los párrafos y cortar a 20 palabras
function renderCarouselSummary(contentArr, idx) {
  let text = '';
  if (Array.isArray(contentArr)) {
    text = contentArr.join(' ');
  } else {
    text = contentArr;
  }
  const words = text.split(/\s+/);
  let shortText = words.slice(0, 20).join(' ');
  let verMas = '';
  if (words.length > 20) {
    shortText += '...';
  }
  // Botón Ver Más SIEMPRE visible en el carrusel
  verMas = ` <a href="pags/nws.html#noticia${idx+1}" class="news-carousel-vermas">Ver Más...</a>`;
  return `${shortText}${verMas}`;
}

function renderCarouselSlide(news, idx) {
  return `<div class="news-carousel-card news-carousel-slide" data-news-idx="${idx}">
    <span class="news-carousel-title" style="font-size:1.02rem;font-weight:700;color:#004aad;display:block;margin:4px 0 2px 0;text-align:center;">${news.title}</span>
    <span class="news-carousel-date" style="font-size:0.85rem;color:#888;display:block;text-align:center;margin-bottom:2px;">${news.date}</span>
    ${renderCarouselMedia(news.media)}
    <span class="news-carousel-summary">${renderCarouselSummary(news.content, idx)}</span>
  </div>`;
}

// Mini-carrusel de imágenes dentro de cada tarjeta
function initCarouselMediaSliders() {
  document.querySelectorAll('.news-carousel-media-multislider').forEach(mediaDiv => {
    const imgs = mediaDiv.querySelectorAll('img');
    const dots = mediaDiv.querySelectorAll('.news-carousel-dot');
    let current = 0;
    function goTo(idx) {
      imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
      current = idx;
    }
    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        goTo(i);
      });
    });
    // Swipe/touch events opcional
    let startX = null;
    mediaDiv.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
    mediaDiv.addEventListener('touchend', e => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 30) {
        let next = current + (dx < 0 ? 1 : -1);
        if (next < 0) next = imgs.length - 1;
        if (next >= imgs.length) next = 0;
        goTo(next);
      }
      startX = null;
    });
  });
}

// Asegurarse de que renderNewsCarousel esté definido y se ejecute al cambiar idioma o al cargar
function renderNewsCarousel() {
  const track = document.querySelector('.news-carousel-track');
  if (!track) return;
  // Ordenar por fecha descendente y tomar las 3 más recientes
  const sorted = newsDataCarousel.slice().sort((a, b) => {
    const dateA = Date.parse(a.date) || Date.parse(a.date.split(' de ').reverse().join('-')) || 0;
    const dateB = Date.parse(b.date) || Date.parse(b.date.split(' de ').reverse().join('-')) || 0;
    return dateB - dateA;
  }).slice(0, 3);
  // Render slides (no duplicates, only one visible at a time)
  let slidesHtml = '';
  slidesHtml = sorted.map((news, idx) => {
    return renderCarouselSlide(news, idx);
  }).join('');
  track.innerHTML = slidesHtml;

  // Añadir listeners para navegación a noticia
  const slideElems = track.querySelectorAll('.news-carousel-slide');
  slideElems.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === 0) slide.classList.add('active');
    slide.style.cursor = 'pointer';
    slide.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      // El índice real de la noticia
      const idx = parseInt(slide.getAttribute('data-news-idx'), 10);
      if (!isNaN(idx)) {
        window.location.href = `pags/nws.html#noticia${idx+1}`;
      }
    });
  });

  // Carousel logic: only one slide visible at a time
  let current = 0;
  function showSlide(idx) {
    slideElems.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
  }
  // Auto-advance every 3.5s
  if (slideElems.length > 1) {
    setInterval(() => {
      current = (current + 1) % slideElems.length;
      showSlide(current);
    }, 3500);
  }

  initCarouselMediaSliders();
}

window.addEventListener('DOMContentLoaded', () => {
  renderNewsCarousel();
});
