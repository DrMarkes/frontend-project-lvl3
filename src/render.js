let i18next;

const handleProcessState = (elements, processState) => {
  switch (processState) {
    case 'received':
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = i18next.t('feedback.success');
      elements.form.reset();
      elements.form.focus();
      break;
    default:
      break;
  }
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
    default:
      break;
  }
};
