// intl/js/langs-news.js
// Traducciones para el carrusel y lista de noticias

const NEWS_I18N = {
  'es-MX': {
    ultimas: 'Últimas noticias',
    leer_mas: 'Leer más',
    sin_noticias: 'No hay noticias disponibles.'
  },
  'en-US': {
    ultimas: 'Latest news',
    leer_mas: 'Read more',
    sin_noticias: 'No news available.'
  },
  'fr-FR': {
    ultimas: 'Dernières actualités',
    leer_mas: 'En savoir plus',
    sin_noticias: 'Aucune actualité disponible.'
  },
  'pt-BR': {
    ultimas: 'Últimas notícias',
    leer_mas: 'Leia mais',
    sin_noticias: 'Nenhuma notícia disponível.'
  },
  'it': {
    ultimas: 'Ultime notizie',
    leer_mas: 'Leggi di più',
    sin_noticias: 'Nessuna notizia disponibile.'
  },
  'ko': {
    ultimas: '최신 뉴스',
    leer_mas: '더 읽기',
    sin_noticias: '뉴스가 없습니다.'
  },
  'de': {
    ultimas: 'Neueste Nachrichten',
    leer_mas: 'Mehr lesen',
    sin_noticias: 'Keine Nachrichten verfügbar.'
  }
};

function setNewsLanguage(lang) {
  const dict = NEWS_I18N[lang] || NEWS_I18N['es-MX'];
  // Título de sección de noticias
  const newsHeader = document.querySelector('.news-carousel-header, .news-list-section h2');
  if (newsHeader) newsHeader.textContent = dict.ultimas;
  // Botones "Leer más" (si existen)
  document.querySelectorAll('.news-readmore').forEach(btn => btn.textContent = dict.leer_mas);
  // Mensaje de sin noticias
  const emptyMsg = document.querySelector('.news-empty-msg');
  if (emptyMsg) emptyMsg.textContent = dict.sin_noticias;
}

// Integración con selector global
if (typeof LANGUAGES !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    const select = document.getElementById('lang-select');
    if (select) {
      select.addEventListener('change', function() {
        setNewsLanguage(select.value);
      });
      // Cargar preferencia guardada
      const saved = localStorage.getItem('lang');
      if (saved && NEWS_I18N[saved]) {
        setNewsLanguage(saved);
      }
    }
  });
}
