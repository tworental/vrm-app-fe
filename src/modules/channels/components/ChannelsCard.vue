<template>
  <div
    class="uk-card uk-card-default card-grid-view"
    :class="{ '--disabled': !channel.enabled }"
  >
    <div class="uk-card__wrapper">
      <div class="uk-card__figure">
        <core-svg
          width="150"
          height="150"
          class="img --no-stroke"
          :src="require('@/assets/images/channels/' + channel.name + '.svg')"
        />
        <div class="uk-position-top-right active-switcher">
          <core-form-switcher
            :uk-tooltip="'title: ' + $t('channels.components.card.' + (channel.enabled ? 'disactivate' : 'activate'))"
            :checked="Boolean(channel.enabled)"
            :disabled="!canUserEditChannel"
            @change="onActivateToggle"
          />
        </div>
      </div>
      <div class="uk-card-body">
        <span class="uk-badge badge--primary" v-if="channel.enabled">
          <span class="status-text">{{ $t('channels.components.card.status.activated') }}</span>
          <core-svg width="8" :src="require('@/assets/images/icons/check.svg')" />
        </span>
        <span class="uk-badge badge--light" v-else>{{ $t('channels.components.card.status.disabled') }}</span>
      </div>
    </div>
    <div v-if="loading" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import { ABILITIES, can, MODULES } from '@/utils/acl';

export default {
  name: 'ChannelsCard',
  components: { CoreFormSwitcher },
  props: {
    channel: Object,
  },
  setup(props) {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const loading = ref(false);

    const user = computed(() => store.state.account.user);
    const canUserEditChannel = computed(() => can(user.value, MODULES.CHANNELS, [ABILITIES.WRITE]));

    const onActivateToggle = (enabled) => {
      loading.value = true;

      store.commit('channels/UPDATE_LIST_ITEM', {
        id: props.channel.id,
        data: {
          enabled: Number(enabled),
        },
      });

      store.dispatch('channels/update', {
        id: props.channel.id,
        data: { enabled },
      })
        .then(() => uikit.notify('success', i18n.t('channels.components.card.successUpdate')))
        .catch((error) => {
          store.commit('channels/UPDATE_LIST_ITEM', {
            id: props.channel.id,
            data: {
              enabled: Number(!enabled),
            },
          });
          if (error) {
            if (error.code === 'ALREADY_EXISTS') {
              uikit.notify('warning', i18n.t('rentals.views.channels.existActiveChannel'));
            } else {
              uikit.notify('danger', error.message);
            }
          }
        })
        .finally(() => { loading.value = false; });
    };

    return {
      loading,
      canUserEditChannel,

      onActivateToggle,
    };
  },
};
</script>

<style lang="scss" scoped>
.uk-card {
  aspect-ratio: 1/1;

  &__figure {
    --card-grid-ratio: 81.25%;
  }
  &-body {
    font-size: 0.875rem;
  }
}
.active-switcher {
  padding: 10px;
}
.status-text {
  padding-right: 5px;
}
</style>
