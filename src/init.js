import 'bootstrap';
import i18next from 'i18next';
import ru from './locales/ru.js';
import app from './app.js';

export default () => {
  const i18nextInstance = i18next.createInstance();
  const lng = 'ru';
  i18nextInstance
    .init({
      lng,
      debug: false,
      resources: {
        ru,
      },
    })
    .then(() => app(i18nextInstance));
};
