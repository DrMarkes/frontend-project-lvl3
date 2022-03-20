let i18next;

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'loading': {
      elements.inputRSS.setAttribute('readonly', true);
      elements.btnAdd.setAttribute('disabled', true);
      break;
    }
    case 'received': {
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('feedback.success');
      break;
    }
    case 'filling': {
      elements.inputRSS.removeAttribute('readonly', false);
      elements.btnAdd.removeAttribute('disabled');
      elements.inputRSS.value = '';
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

const renderLinks = (elements, value) => {
  const links = elements.posts.querySelectorAll('a[data-id]');
  links.forEach((link) => link.classList.add('fw-bold'));
  const visitedLinks = value.map((id) => elements
    .posts.querySelector(`a[data-id="${id}"]`));
  visitedLinks.forEach((link) => {
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const renderPosts = (state, elements, posts) => {
  const container = createContainer('posts');
  elements.posts.innerHTML = '';
  elements.posts.append(container);

  const ulEl = document.createElement('ul');
  ulEl.classList.add('list-group', 'border-0', 'rounded-0');
  container.append(ulEl);

  const liElements = posts.map((post) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const linkEl = document.createElement('a');
    linkEl.setAttribute('href', post.link);
    linkEl.setAttribute('data-id', post.id);
    linkEl.setAttribute('target', '_blank');
    linkEl.setAttribute('rel', 'noopener noreferrer');
    linkEl.textContent = post.title;
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    btn.textContent = i18next.t('btn.look');
    btn.setAttribute('type', 'button');
    btn.setAttribute('data-id', post.id);
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal');
    btn.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const post = posts.find((post) => post.id === id);
      state.ui.modal = { ...post };
      state.ui.visitedLinks.push(id);
    });
    liEl.append(linkEl, btn);
    return liEl;
  });

  ulEl.append(...liElements);

  renderLinks(elements, state.ui.visitedLinks);
};

const renderModal = (elements, value) => {
  elements.modal.title.textContent = value.title;
  elements.modal.body.textContent = value.description;
  elements.modal.link.setAttribute('href', value.link);
};

export default (elements, i18nextInstance) => function render(path, value) {
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
      renderPosts(this, elements, value);
      break;
    case 'ui.modal':
      renderModal(elements, value);
      break;
    case 'ui.visitedLinks':
      renderLinks(elements, value);
      break;
    default:
      break;
  }
};
