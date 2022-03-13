import axios from 'axios';
import onChange from 'on-change';
import { uniqueId } from 'lodash';
import * as yup from 'yup';
import render from './render.js';

let i18next;

const initYup = () => {
  yup.setLocale({
    mixed: {
      notOneOf: i18next.t('error.exist'),
    },
    string: {
      url: i18next.t('error.valid'),
    },
  });
};

const validate = (url, state) => {
  const schema = yup.string().url().notOneOf(state.loadedUrls);
  return schema.validate(url);
};

const path = {
  get: (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${encodeURIComponent(url)}`,
};

export default (i18nextInstance) => {
  i18next = i18nextInstance;
  initYup();
  const elements = {
    form: document.querySelector('.rss-form'),
    inputRSS: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const exampleUrl = 'http://lorem-rss.herokuapp.com/feed?unit=second&interval=30';

  const parseRSS = (rss) => {
    const id = uniqueId();
    const channel = {
      id,
      title: rss.querySelector('channel>title').textContent,
      description: rss.querySelector('channel>description').textContent,
    };

    const postElements = rss.querySelectorAll('channel>item');
    const posts = [...postElements].map((item) => {
      const post = {
        id: uniqueId(),
        feedId: id,
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      return post;
    });
    return { channel, posts };
  };

  const state = onChange(
    {
      valid: true,
      processState: 'filling',
      url: null,
      loadedUrls: [],
      feeds: [],
      posts: [],
      errors: {},
    },
    render(elements, i18nextInstance),
  );

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validate(url, state)
      .then((url) => {
        state.valid = true;
        state.errors = {};
        state.url = url;
        return axios.get(path.get(url));
      })
      .then(({ data }) => {
        const parser = new DOMParser();
        const rss = parser.parseFromString(data.contents, 'application/xml');
        const feed = parseRSS(rss);
        state.feeds.push(feed.channel);
        state.posts = feed.posts;
        state.loadedUrls.push(state.url);
        state.url = null;
        state.processState = 'received';
      })
      .catch((e) => {
        console.log(e);
        state.errors = e;
        state.valid = false;
      });
  });
};
