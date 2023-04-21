export const scrollToFirstInvalidControl = (selector = '.--invalid') => {
  setTimeout(() => {
    const control = document.querySelector(selector);

    if (control) {
      control.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, 100);
};

export const handleSubmitClick = ({ validate, onSubmit, onInvalid }, ...args) => validate()
  .then((ctx) => {
    if (!ctx.valid) {
      if (onInvalid) onInvalid(ctx);
      scrollToFirstInvalidControl(...args);
    } else if (onSubmit) {
      onSubmit();
    }
  });

export default { scrollToFirstInvalidControl, handleSubmitClick };
