import { isQuotaExceeded } from '@/utils/acl';

const handleQuota = (el, value) => {
  const {
    limits, name, value: quota, label,
  } = value;

  // eslint-disable-next-line no-param-reassign
  el.disabled = isQuotaExceeded(limits, name, quota);

  if (el.disabled) {
    el.setAttribute('uk-tooltip', `title: ${label}`);
  } else {
    el.removeAttribute('uk-tooltip');
  }
};

export default {
  mounted(el, { value }) {
    handleQuota(el, value);
  },
  updated(el, { value }) {
    handleQuota(el, value);
  },
};
