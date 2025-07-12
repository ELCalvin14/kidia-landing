// langs-contacto.js
// Traducciones para contacto.html

const contactoTranslations = {
  'es-MX': {
    contacto_titulo: 'Contacto',
    contacto_tagline: '¡Conéctate con nosotros y descarga la app!',
    contacto_siguenos: '¡Síguenos y Apóyanos',
    contacto_donar: 'Enviar donaciones',
    contacto_instagram: 'Síguenos en Instagram',
    contacto_facebook: 'Síguenos en Facebook',
    contacto_whatsapp: 'Contáctanos por WhatsApp',
    contacto_o: 'o',
    contacto_descarga: 'Descarga Nuestra App!'
  },
  'en-US': {
    contacto_titulo: 'Contact',
    contacto_tagline: 'Connect with us and download the app!',
    contacto_siguenos: 'Follow and Support Us',
    contacto_donar: 'Send Donations',
    contacto_instagram: 'Follow us on Instagram',
    contacto_facebook: 'Follow us on Facebook',
    contacto_whatsapp: 'Contact us on WhatsApp',
    contacto_o: 'or',
    contacto_descarga: 'Download Our App!'
  },
  'fr-FR': {
    contacto_titulo: 'Contact',
    contacto_tagline: 'Contactez-nous et téléchargez l\'application !',
    contacto_siguenos: 'Suivez-nous et soutenez-nous',
    contacto_donar: 'Envoyer des dons',
    contacto_instagram: 'Suivez-nous sur Instagram',
    contacto_facebook: 'Suivez-nous sur Facebook',
    contacto_whatsapp: 'Contactez-nous sur WhatsApp',
    contacto_o: 'ou',
    contacto_descarga: 'Téléchargez notre application !'
  },
  'pt-BR': {
    contacto_titulo: 'Contato',
    contacto_tagline: 'Conecte-se conosco e baixe o app!',
    contacto_siguenos: 'Siga-nos e Apoie-nos',
    contacto_donar: 'Enviar doações',
    contacto_instagram: 'Siga-nos no Instagram',
    contacto_facebook: 'Siga-nos no Facebook',
    contacto_whatsapp: 'Fale conosco no WhatsApp',
    contacto_o: 'ou',
    contacto_descarga: 'Baixe nosso app!'
  },
  'it': {
    contacto_titulo: 'Contatto',
    contacto_tagline: 'Connettiti con noi e scarica l\'app!',
    contacto_siguenos: 'Seguici e Sostienici',
    contacto_donar: 'Invia donazioni',
    contacto_instagram: 'Seguici su Instagram',
    contacto_facebook: 'Seguici su Facebook',
    contacto_whatsapp: 'Contattaci su WhatsApp',
    contacto_o: 'o',
    contacto_descarga: 'Scarica la nostra app!'
  },
  'de': {
    contacto_titulo: 'Kontakt',
    contacto_tagline: 'Verbinde dich mit uns und lade die App herunter!',
    contacto_siguenos: 'Folge uns und unterstütze uns',
    contacto_donar: 'Spenden senden',
    contacto_instagram: 'Folge uns auf Instagram',
    contacto_facebook: 'Folge uns auf Facebook',
    contacto_whatsapp: 'Kontaktiere uns über WhatsApp',
    contacto_o: 'oder',
    contacto_descarga: 'Lade unsere App herunter!'
  },
  'ko': {
    contacto_titulo: '연락처',
    contacto_tagline: '저희와 연결하고 앱을 다운로드하세요!',
    contacto_siguenos: '팔로우하고 후원해 주세요',
    contacto_donar: '기부하기',
    contacto_instagram: '인스타그램에서 팔로우하세요',
    contacto_facebook: '페이스북에서 팔로우하세요',
    contacto_whatsapp: 'WhatsApp으로 문의하기',
    contacto_o: '또는',
    contacto_descarga: '앱 다운로드!'
  }
};

function setContactoLanguage(lang) {
  const t = contactoTranslations[lang] || contactoTranslations['es-MX'];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const select = document.getElementById('lang-select');
  if (select) {
    select.addEventListener('change', function() {
      setContactoLanguage(select.value);
    });
    setContactoLanguage(select.value || 'es-MX');
  } else {
    setContactoLanguage('es-MX');
  }
});
