import { useI18n } from 'vue-i18n';

import { capitalizeFirstLetter } from '@/utils/text';

export default function useApiFormatters() {
  const i18n = useI18n();

  const getErrorTranslation = (error) => (typeof error === 'object'
    ? i18n.t(`core.errors.${error.name}`, error.params || {})
    : i18n.t(`core.errors.${error}`));

  const formErrorFormatter = (data) => Object.entries(data.errors || {})
    .reduce((acc, [name, err]) => ({
      ...acc,
      [name]: capitalizeFirstLetter(Array.isArray(err) ? (
        getErrorTranslation(err[0])
      ) : err.message),
    }), {});

  return { formErrorFormatter };
}
