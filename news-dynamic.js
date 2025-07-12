// news-dynamic.js: Carga noticias dinámicamente usando archivos separados para español y traducciones
let newsData = [];
let currentLang = localStorage.getItem('lang') || 'es-MX';

function getNewsDataForLang(lang) {
  // Si es español, usar el archivo base
  if (lang === 'es-MX' || !newsTranslations) return newsDataES;
  // Si hay traducción, combinar título/cuerpo traducido y multimedia original
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

function updateNewsDataAndRender(lang) {
  newsData = getNewsDataForLang(lang);
  if (typeof renderNewsList === 'function') renderNewsList();
  if (typeof renderNewsCarousel === 'function') renderNewsCarousel();
}

document.addEventListener('DOMContentLoaded', function() {
  // Inicializar noticias según idioma
  newsData = getNewsDataForLang(currentLang);
  // Escuchar cambios de idioma
  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', function() {
      currentLang = select.value;
      updateNewsDataAndRender(currentLang);
    });
  }
});

async function loadNewsTemplate() {
  // Usar ruta relativa para compatibilidad local y servidor
  // Siempre buscar la plantilla en la misma carpeta que nws.html
  const response = await fetch('news-template.html');
  if (!response.ok) return null;
  return await response.text();
}

function renderMediaSlides(mediaArr) {
  if (!mediaArr || !mediaArr.length) return '';
  const imgs = mediaArr.filter(x => x.type === 'img');
  const videos = mediaArr.filter(x => x.type === 'video');
  let slides = '';
  slides += imgs.map(m => `<div class="media-slide"><img src="${m.src}" alt="${m.alt || ''}"></div>`).join('');
  slides += videos.map(m => `<div class="media-slide"><video src="${m.src}" controls preload="none"></video></div>`).join('');
  return slides;
}

function renderContentParagraphs(contentArr) {
  if (Array.isArray(contentArr)) {
    return contentArr.map(p => `<p>${p}</p>`).join('');
  }
  return `<p>${contentArr}</p>`;
}

function fillTemplate(template, data, newsIndex) {
  return template
    .replace(/{{\s*title\s*}}/g, data.title)
    .replace(/{{\s*date\s*}}/g, data.date)
    .replace(/{{\s*content\s*}}/g, renderContentParagraphs(data.content))
    .replace(/{{\s*mediaSlides\s*}}/g, renderMediaSlides(data.media))
    .replace(/{{\s*newsIndex\s*}}/g, newsIndex);
}

// Renderizar lista de noticias de forma reutilizable
function renderNewsList() {
  const newsList = document.querySelector('.news-list');
  if (!newsList) return;
  loadNewsTemplate().then(template => {
    if (!template) {
      newsList.innerHTML = '<p style="color:red">No se pudo cargar la plantilla de noticia.</p>';
      return;
    }
    newsList.innerHTML = '';
    // Ordenar las noticias por fecha descendente (más reciente primero)
    const sortedNews = newsData.slice().sort((a, b) => {
      const dateA = Date.parse(a.date) || Date.parse(a.date.split(' de ').reverse().join('-')) || 0;
      const dateB = Date.parse(b.date) || Date.parse(b.date.split(' de ').reverse().join('-')) || 0;
      return dateB - dateA;
    });
    sortedNews.forEach((news, idx) => {
      const html = fillTemplate(template, news, idx);
      const temp = document.createElement('div');
      temp.innerHTML = html.trim();
      newsList.appendChild(temp.firstElementChild);
    });
    // Si hay hash tipo #noticiaX, hacer scroll a esa noticia
    if (window.location.hash && window.location.hash.startsWith('#noticia')) {
      const hash = window.location.hash;
      // Buscar el artículo correspondiente
      const idx = parseInt(hash.replace('#noticia', ''), 10);
      if (!isNaN(idx)) {
        // Los artículos se insertan en orden, así que el idx corresponde
        const articles = document.querySelectorAll('.news-item');
        if (articles[idx - 1]) {
          setTimeout(() => {
            articles[idx - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 300);
        }
      }
    }
    initAllNewsSliders();
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  renderNewsList();
});

function initAllNewsSliders() {
  document.querySelectorAll('.news-media-slider').forEach((slider, idx) => {
    const track = slider.querySelector('.media-track');
    const slides = Array.from(track.children);
    const dotsContainer = slider.querySelector('.media-dots');
    let current = 0;
    let intervalId = null;
    // Crear dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'media-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        goToSlide(i);
        resetInterval();
      });
      dotsContainer.appendChild(dot);
    });
    function goToSlide(idx) {
      current = idx;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dotsContainer.querySelectorAll('.media-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }
    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }
    function resetInterval() {
      clearInterval(intervalId);
      intervalId = setInterval(nextSlide, 3000);
    }
    // Inicializar
    track.style.display = 'flex';
    track.style.transition = 'transform 0.6s cubic-bezier(.77,0,.18,1)';
    slides.forEach(s => { s.style.flex = '0 0 100%'; });
    goToSlide(0);
    intervalId = setInterval(nextSlide, 3000);
    // Detener el slider al salir de la página
    window.addEventListener('beforeunload', () => clearInterval(intervalId));
  });
}
