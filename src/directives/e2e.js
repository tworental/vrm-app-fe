export default {
  beforeMount(el, binding) {
    if (process.env.NODE_ENV !== 'production') {
      const value = binding.value || binding.arg;

      let element;

      if (['p-inputnumber', 'p-calendar'].some((selector) => el.classList.contains(selector))) {
        element = el.querySelector('input');
      } else {
        element = el;
      }

      let { name, tagName } = element;

      switch (tagName) {
        case 'A':
          tagName = 'link';
          break;

        case 'BUTTON':
          if (!name && el.type === 'submit') {
            name = 'submit';
          }
          break;

        case 'DIV':
          tagName = '';
          break;

        case 'FORM':
          name = typeof name === 'string' ? name : '';
          break;

        default:
          break;
      }

      element.setAttribute('data-cy', [
        tagName.toLowerCase(), name, value,
      ].filter(Boolean).join('-'));
    }
  },
};
