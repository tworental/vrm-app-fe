<template>
  <core-form-select
    v-model="currentStatus"
    name="status"
    class="status"
    :class="'border-' + currentStatus"
    :data="statuses"
    :value="value"
    :press-label="false"
    :show-placeholder="false"
    :options="options"
    :disabled="
      (currentStatus === BOOKING_STATUSES.DRAFT
       || currentStatus === BOOKING_STATUSES.TENTATIVE)
      || !canUserEditBookings"
    @update:modelValue="onStatusChanged"
  />
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import { BOOKING_STATUSES } from '@/modules/bookings/services';
import { ABILITIES, can, MODULES } from '@/utils/acl';
import useKit from '@/modules/core/composables/uikit';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';

export default {
  name: 'BookingsStatusSelect',
  components: {
    CoreFormSelect,
  },
  props: {
    value: String,
    bookingId: Number,
  },
  setup(props) {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();

    const disabledStatuses = [BOOKING_STATUSES.DRAFT, BOOKING_STATUSES.TENTATIVE];

    const currentStatus = ref(props.value);

    const user = computed(() => store.state.account.user);
    const canUserEditBookings = computed(() => can(user.value, MODULES.BOOKINGS, [ABILITIES.WRITE]));

    const statuses = computed(() => Object.values(BOOKING_STATUSES).map((status) => ({
      label: i18n.t(`bookings.dicts.statuses.${status}`),
      value: status,
      disabled: disabledStatuses.includes(status),
    })).filter((item) => {
      if (!disabledStatuses.includes(currentStatus.value)) {
        return !item.disabled;
      }

      return true;
    }));

    const options = {
      callbackOnCreateTemplates: (template) => ({
        choice: (classNames, data) => template(`
          <div class="${classNames.item} ${classNames.itemChoice} ${
          data.disabled ? classNames.itemDisabled : classNames.itemSelectable
        } --${data.value}" data-select-text="" data-choice ${
          data.disabled
            ? 'data-choice-disabled aria-disabled="true"'
            : 'data-choice-selectable'
        } data-id="${data.id}" data-value="${data.value}" ${
          data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
        }>
            <span class="circle"></span> ${data.label}
          </div>
        `),
      }),
    };

    const onStatusChanged = (status) => {
      store.dispatch('bookings/changeStatus', { id: props.bookingId, status })
        .then(() => store.dispatch('bookings/refreshEntity', props.bookingId))
        .then(() => uikit.notify('success', i18n.t('bookings.components.statusSelect.successUpdate')))
        .catch((error) => uikit.notify('danger', error.message));
    };

    watch(() => props.value, (value) => {
      currentStatus.value = value;
    });

    return {
      BOOKING_STATUSES,
      statuses,
      currentStatus,
      options,
      canUserEditBookings,

      onStatusChanged,
    };
  },
};
</script>

<style lang="scss" scoped>
.status ::v-deep() {
  min-width: 150px;
  text-transform: uppercase;

  .choices__inner {
    height: 28px;
    min-height: 28px;
    padding: 0;
  }

  [data-value="confirmed"] {
    color: $success-color;
  }

  .--confirmed {
    &.is-highlighted,
    &:hover {
      background-color: rgba($success-color, 0.07) !important;
    }
  }

  [data-value="tentative"] {
    color: $primary-color;
  }

  .--tentative {
    color: $primary-color;

    &.is-highlighted,
    &:hover {
      background-color: rgba($primary-color, 0.07) !important;
    }
  }

  [data-value="canceled"] {
    color: $error-color;
  }

  .--canceled {
    color: $error-color;

    &.is-highlighted,
    &:hover {
      background-color: rgba($error-color, 0.07) !important;
    }
  }

  [data-value="declined"] {
    color: $alt-color;
  }

  .--declined {
    color: $alt-color;

    &.is-highlighted,
    &:hover {
      background-color: rgba($alt-color, 0.07) !important;
    }
  }

  .choices__item.choices__item--selectable,
  .choices__item--disabled {
    &::before {
      content: '';
      display: inline-block;
      height: 4px;
      width: 4px;
      margin-right: 8px;
      border-radius: 50%;
      background-color: currentColor;
      transform: translateY(-50%);
    }
  }

  .choices__list--dropdown {
    padding: 10px 0;
  }

  .choices__inner > * > .choices__item.choices__item--selectable::before {
    margin-left: 6px;
  }
}

.border-confirmed {
  ::v-deep()  .choices__inner {
    border-color: rgba($success-color, 0.5);
  }
}

.border-tentative {
  ::v-deep()  .choices__inner {
    border-color: rgba($primary-color, 0.5);
  }
}

.border-canceled {
  ::v-deep()  .choices__inner {
    border-color: rgba($error-color, 0.5);
  }
}

.border-declined {
  ::v-deep()  .choices__inner {
    border-color: rgba($alt-color, 0.5);
  }
}
</style>
