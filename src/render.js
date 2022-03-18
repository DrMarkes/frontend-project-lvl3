let i18next;

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'received':
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('feedback.success');
      break;
    case 'filling': {
      elements.form.reset();
      elements.form.focus();
      break;
    }
    default:
      break;
  }
};

const createContainer = (name) => {
  const container = document.createElement('div');
  container.classList.add('card', 'border-0');
  const bodyEl = document.createElement('div');
  bodyEl.classList.add('card-body');
  container.append(bodyEl);
  const titleEl = document.createElement('h2');
  titleEl.classList.add('card-title', 'h4');
  titleEl.textContent = i18next.t(`${name}.title`);
  bodyEl.append(titleEl);
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(ulEl);

  return container;
};

const renderFeeds = (elements, feeds) => {
  const container = createContainer('feeds');
  elements.feeds.innerHTML = '';
  elements.feeds.append(container);
  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(ulEl);
  const liElements = feeds.map((feed) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
    const titleLiEl = document.createElement('h3');
    titleLiEl.classList.add('h6', 'm-0');
    titleLiEl.textContent = feed.title;
    const descriptionLiEl = document.createElement('p');
    descriptionLiEl.classList.add('m-0', 'small', 'text-black-50');
    descriptionLiEl.textContent = feed.description;
    liEl.append(titleLiEl, descriptionLiEl);
    return liEl;
  });

  ulEl.append(...liElements);
};

const renderPosts = (elements, posts) => {
  const container = createContainer('posts');
  elements.posts.innerHTML = '';
  elements.posts.append(container);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(ulEl);

  const liElements = posts.map((item) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const linkEl = document.createElement('a');
    linkEl.classList.add('fw-bold');
    linkEl.setAttribute('href', item.link);
    linkEl.setAttribute('data-id', item.id);
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener noreferrer');
    linkEl.textContent = item.title;
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.textContent = i18next.t('btn.look');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-id', item.id);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    liEl.append(linkEl, btn);
    return liEl;
  });

  ulEl.append(...liElements);
};

export default (elements, i18nextInstance) => (path, value) => {
  i18next = i18nextInstance;
  switch (path) {
    case 'valid': {
      elements.inputRSS.classList.toggle('is-invalid');
      break;
    }
    case 'errors':
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = value.message;
      break;
    case 'processState':
      handleProcessState(elements, value);
      break;
    case 'feeds':
      renderFeeds(elements, value);
      break;
    case 'posts':
      renderPosts(elements, value);
      break;
    default:
      break;
  }
};
