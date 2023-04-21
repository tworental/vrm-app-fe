import { hasAccess } from '@/utils/acl';

export default {
  mounted(el, { value }) {
    const {
      limits, name, user, acl,
    } = value;

    let isAllowed = false;

    if (Array.isArray(name)) {
      isAllowed = name.some((limitName, idx) => hasAccess(limits, limitName, user, acl[idx]));
    } else {
      isAllowed = hasAccess(limits, name, user, acl);
    }

    if (!isAllowed) {
      el.remove();
    }
  },
};
