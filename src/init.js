import i18next from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  const lang = window.navigator.userLanguage || window.navigator.language;
  i18nextInstance.init({
    lng: lang,
    debug: false,
    resources: {
      ru,
    },
  }).then(() => app(i18nextInstance));
};
