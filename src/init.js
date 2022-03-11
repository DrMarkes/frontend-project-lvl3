import i18next from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => app(i18nextInstance));
};
