<template>
  <div
    class="uk-card uk-card-default card-grid-view website"
    @click="$router.push({ name: 'website-form', params: { id: website.id } })"
  >
    <div class="uk-card__wrapper">
      <div class="uk-card__figure">
        <core-image
          :src="website.faviconUrl || ''"
          :fallback="require('@/assets/images/placeholders/websites.svg')"
          :grayPlaceholder="true"
        />
        <div uk-grid class="card-grid-view__actions">
          <div class="card-grid-view__badges">
            <span class="uk-badge badge--primary" v-if="website.active">
              {{ $t('websites.components.card.activated') }}
            </span>
            <span class="uk-badge badge--light" v-else>
              {{ $t('websites.components.card.disabled') }}
            </span>
          </div>
          <div class="uk-inline uk-width-auto actions">
            <button class="uk-button card-grid-view__btn-dropdown btn--reset" type="button" @click.stop>
              <core-svg width="16" :src="require('@/assets/images/icons/nav-menu-horizontal.svg')" />
            </button>
            <div uk-dropdown="mode: click" class="dropdown uk-margin-remove-top">
              <ul class="uk-dropdown-nav uk-nav-default">
                <li class="uk-dropdown-close">
                  <button
                    v-if="!website.active"
                    type="button"
                    class="uk-nav__link uk-flex uk-flex-middle"
                    v-e2e="'activate'"
                    @click.stop="onActiveToggle(true)"
                  >
                    <core-svg
                      class="icon"
                      width="14"
                      height="14"
                      :src="require('@/assets/images/icons/check-circle.svg')"
                    />
                    <span>{{ $t('websites.components.card.actions.activate') }}</span>
                  </button>
                  <button
                    v-else
                    type="button"
                    class="uk-nav__link uk-flex uk-flex-middle"
                    v-e2e="'disable'"
                    @click.stop="onActiveToggle(false)"
                  >
                    <core-svg
                      class="icon"
                      width="14"
                      height="14"
                      :src="require('@/assets/images/icons/close-circle.svg')"
                    />
                    <span>{{ $t('websites.components.card.actions.disable') }}</span>
                  </button>
                </li>
                <li class="uk-dropdown-close">
                  <button
                    type="button"
                    class="uk-nav__link uk-flex uk-flex-middle"
                    v-e2e="'preview'"
                    @click.stop
                  >
                    <core-svg
                      class="icon"
                      width="14"
                      height="14"
                      :src="require('@/assets/images/icons/eye-open.svg')"
                    />
                    <span>{{ $t('websites.components.card.actions.preview') }}</span>
                  </button>
                </li>
                <li class="uk-dropdown-close">
                  <button
                    type="button"
                    class="uk-nav__link uk-text-danger uk-flex uk-flex-middle"
                    v-e2e="'delete'"
                    @click.stop="onDelete"
                  >
                    <core-svg
                      class="icon"
                      width="14"
                      height="14"
                      :src="require('@/assets/images/icons/delete.svg')"
                    />
                    <span>{{ $t('websites.components.card.actions.delete') }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="uk-card-body">
        <div>
          <h5 class="website__title uk-margin-remove">{{ website.name }}</h5>
        </div>
        <div class="website__meta">
          <small>
            {{ $t('websites.components.card.edited', { time: getRelativeDate(website.updatedAt) }) }}
          </small>
          <small v-if="website.currentVersion">
            {{ $t('websites.components.card.version', { version: website.currentVersion }) }}
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import { getRelativeDate } from '@/utils/datetime';
import CoreImage from '@/modules/core/components/CoreImage.vue';

export default {
  name: 'WebsitesCard',
  components: {
    CoreImage,
  },
  props: {
    website: Object,
  },
  setup(props) {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const onActiveToggle = (active) => {
      store.dispatch('websites/update', { id: props.website.id, data: { active: Number(active) } })
        .then(() => store.dispatch('websites/setList'))
        .then(() => uikit.notify('success', i18n.t('websites.shared.activeToggleSuccess')))
        .catch((error) => uikit.notify('danger', error.message));
    };

    const onDelete = () => {
      uikit.modals.deleteConfirm(i18n.t('websites.components.card.deleteConfirm'))
        .then((dialog) => store.dispatch('websites/delete', props.website.id)
          .then(() => store.dispatch('websites/setList'))
          .finally(() => dialog.hide()))
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      getRelativeDate,
      onActiveToggle,
      onDelete,
    };
  },
};
</script>

<style lang="scss" scoped>
.website {
  &__title {
    font-weight: 500;
    font-size: 0.875rem;
  }
  &__description {
    margin: 0;
    font-size: 0.875rem;
    color: rgba($base-color-darken, 0.7);
  }
  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    color: rgba($base-color-darken, 0.5);
  }
  &__preview {
    text-transform: uppercase;
    color: $primary-color;
    text-decoration: none;

    &:hover,
    &:focus,
    &:active {
      color: darken($primary-color, 7%);
    }
  }
  &__delete {
    display: none;
    position: absolute;
    bottom: 0;
    right: 0;
    background: none;
    border: none;
    outline: none;
    padding: 15px;
    cursor: pointer;
  }

  &:hover {
    .website__delete {
      display: inline-block;
    }
  }
}
.uk-card {
  &__wrapper {
    display: flex;
    flex-direction: column;
  }
  &-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: auto;
  }
}
</style>
