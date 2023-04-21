<template>
  <button
    type="button"
    v-e2e="'send'"
    class="uk-button --icon animated-icon"
    :disabled="lastClickAt && lastClickAt > new Date()"
    @click="onClick"
    :uk-tooltip="tooltip ? 'title: ' + tooltip : ''"
  >
    <core-svg :width="24" :src="require('@/assets/images/icons/send-email.svg')" />
  </button>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import dayjs from '@/utils/dayjs';

export default {
  name: 'CoreSendEmail',
  props: {
    tooltip: {
      type: String,
      default: null,
    },
    id: {
      type: String,
    },
  },

  emits: ['click'],

  setup(props, { emit }) {
    const lastClickAt = ref(null);
    const getParams = () => props.id.split(':');

    const storageKey = computed(() => `tworentals:${getParams()[0]}`);

    const getItemFromStorage = () => {
      const [, id] = getParams();

      const itemsStr = localStorage.getItem(storageKey.value);
      if (itemsStr) {
        const items = JSON.parse(itemsStr);

        return items.find((item) => item.id === id);
      }

      return null;
    };

    const addItemToStorage = (sentAt) => {
      const [module, id] = getParams();

      const itemsStr = localStorage.getItem(`tworentals:${module}`);
      let items;
      if (itemsStr) {
        items = [...JSON.parse(itemsStr), { id, sentAt }];
      } else {
        items = [{ id, sentAt }];
      }

      localStorage.setItem(`tworentals:${module}`, JSON.stringify(items));
    };

    const removeItemFromStorage = () => {
      const [, id] = getParams();

      const itemsStr = localStorage.getItem(storageKey.value);
      if (itemsStr) {
        const items = JSON.parse(itemsStr).filter((item) => item.id !== id);
        if (items.length) {
          localStorage.setItem(storageKey.value, JSON.stringify(items));
        } else {
          localStorage.removeItem(storageKey.value);
        }
      }
    };

    const clearLastClick = (timeout = 5 * 60 * 1000) => {
      setTimeout(() => {
        lastClickAt.value = null;
        removeItemFromStorage();
      }, timeout);
    };

    const onClick = () => {
      const expiresAt = dayjs().add(5, 'minute');
      addItemToStorage(expiresAt.toString());

      emit('click');
      lastClickAt.value = expiresAt.toDate();
      clearLastClick();
    };

    onMounted(() => {
      const item = getItemFromStorage();
      if (item) {
        const expiresAtDayJs = dayjs(item.sentAt);
        lastClickAt.value = expiresAtDayJs.toDate();

        if (expiresAtDayJs.isAfter(dayjs())) {
          clearLastClick(expiresAtDayJs.diff(dayjs(), 'millisecond'));
        }
      }
    });

    return {
      onClick,
      lastClickAt,
    };
  },
};
</script>
