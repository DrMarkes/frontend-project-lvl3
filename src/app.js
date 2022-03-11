import onChange from 'on-change';
import * as yup from 'yup';
import render from './render.js';

let i18next;

const validate = (url, state) => {
  const schema = yup
    .string()
    .url(i18next.t('error.valid'))
    .notOneOf(state.loadedUrls, i18next.t('error.exist'));
  return schema.validate(url);
};

export default (i18nextInstance) => {
  i18next = i18nextInstance;
  const elements = {
    form: document.querySelector('.rss-form'),
    inputRSS: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = onChange({
    valid: true,
    processState: 'filling',
    url: null,
    loadedUrls: [],
    errors: {},
  }, render(elements, i18nextInstance));

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state).then((url) => {
      state.valid = true;
      state.errors = {};
      state.url = url;
      state.processState = 'received';
    }).catch((e) => {
      state.errors = e;
      state.valid = false;
    });
  });
};
