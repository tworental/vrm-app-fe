export const showModalForDirtyForm = ({
  uikit,
  i18n,
  meta,
}) => (to, from, next) => {
  if (meta.value.dirty) {
    uikit.modals.confirm(i18n.t('core.alert.changes.unsaved'))
      .then(() => next())
      .catch(() => next(false));
  } else {
    next();
  }
};

export default { showModalForDirtyForm };
