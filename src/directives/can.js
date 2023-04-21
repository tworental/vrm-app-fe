import { can } from '@/utils/acl';

export default {
  mounted(el, { modifiers, arg: module, value: user }) {
    if (!can(user, module, Object.keys(modifiers))) {
      el.remove();
    }
  },
};
