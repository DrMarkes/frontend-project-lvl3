import axios from 'axios';
import onChange from 'on-change';
import _ from 'lodash';
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
      required: i18next.t('error.required'),
    },
  });
};

const validate = (url, state) => {
  const schema = yup
    .string().url()
    .required()
    .notOneOf(state.loadedUrls);
  return schema.validate(url);
};

const path = {
  get: (url) => {
    const requestUrl = new URL('../get', 'https://allorigins.hexlet.app/');
    requestUrl.searchParams.set('disableCache', true);
    requestUrl.searchParams.set('url', url);
    return requestUrl.toString();
  },
};

const setPostsId = (posts, feedId) => posts
  .map((post) => {
    post.feedId = feedId;
    post.id = _.uniqueId();
    return post;
  });

const parseData = (data, url) => {
  try {
    const parser = new DOMParser();
    const content = parser.parseFromString(data.contents, 'application/xml');

    const postElements = content.querySelectorAll('channel>item');
    const posts = [...postElements].map((item) => {
      const post = {
        title: item.querySelector('title').textContent,
        description: item.querySelector('description').textContent,
        link: item.querySelector('link').textContent,
      };
      return post;
    });

    const feed = {
      head: {
        title: content.querySelector('channel>title').textContent,
        description: content.querySelector('channel>description').textContent,
        url,
      },
      posts,
    };
    return feed;
  } catch (e) {
    throw new Error(i18next.t('error.parse'));
  }
};

const reloadData = (state, feedId) => {
  setTimeout(() => {
    const { url } = state.feeds.find(({ id }) => id === feedId);
    const response = axios.get(path.get(url));
    response.then(({ data }) => {
      const loadedPostLinks = state.posts
        .filter((post) => post.feedId === feedId)
        .map((post) => post.link);

      const feed = parseData(data, url);
      const newPosts = feed.posts
        .filter((post) => !_.includes(loadedPostLinks, post.link));
      if (newPosts.length === 0) {
        return;
      }
      const postsToAdd = setPostsId(newPosts, feedId);
      state.posts = [...postsToAdd, ...state.posts];
    })
      .catch()
      .then(() => reloadData(state, feedId));
  }, 5000);
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
    modal: {
      title: document.querySelector('#modal .modal-title'),
      body: document.querySelector('#modal .modal-body'),
      link: document.querySelector('#modal .full-article'),
    },
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
      ui: {
        modal: {},
        visitedLinks: [],
      },
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
        const feed = parseData(data, state.url);
        feed.head.id = _.uniqueId();
        state.feeds = [feed.head, ...state.feeds];
        state.posts = [...setPostsId(feed.posts, feed.head.id), ...state.posts];
        state.loadedUrls.push(feed.head.url);
        state.processState = 'received';
        state.processState = 'filling';
        return feed.head.id;
      })
      .then((id) => {
        reloadData(state, id);
      })
      .catch((e) => {
        if (e instanceof yup.ValidationError) {
          state.valid = false;
        }
        if (e.message === 'Network Error') {
          e.message = i18next.t('error.network');
        }
        state.errors = e;
      });
  });
};
