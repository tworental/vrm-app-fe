<template>
  <small v-if="user.isAccountOwner">
    {{ $t('team.components.memberPermissionRole.owner') }}
  </small>
  <small v-else>
    {{ $t('team.components.memberPermissionRole.custom', assignedPermissions, { count: assignedPermissions }) }}
  </small>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'TeamMemberPermissionRole',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const assignedPermissions = computed(() => Object.values(props.user.permissions).flat().length);

    return { assignedPermissions };
  },
};
</script>
