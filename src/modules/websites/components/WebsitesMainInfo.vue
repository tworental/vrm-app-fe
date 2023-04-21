<template>
  <div class="card">
    <div class="card__header">
      <h5 class="card__title">{{ $t('websites.components.mainInfo.title') }}</h5>
      <p class="card__description">{{ $t('websites.components.mainInfo.description') }}</p>
    </div>

    <div class="grid">
      <div>
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors.name }" for="name">
            {{ $t('websites.components.mainInfo.fields.name') }}
          </label>
          <div class="input-container">
            <v-field
              id="name"
              class="uk-input --outline"
              name="name"
              :label="$t('websites.components.mainInfo.fields.name')"
              :class="{ '--invalid': errors.name }"
              v-e2e
              rules="required|min:2|max:191"
              :value="website.name"
            />
            <v-error-message class="input-error-message" name="name" />
          </div>
        </div>
        <div class="uk-margin-bottom">
          <label class="input-label" :class="{ '--invalid': errors.link }" for="link">
            {{ $t('websites.components.mainInfo.fields.link') }}
          </label>
          <div class="input-container">
            <v-field
              id="link"
              class="uk-input --outline"
              name="link"
              :label="$t('websites.components.mainInfo.fields.link')"
              :class="{ '--invalid': errors.link }"
              v-e2e
              rules="max:191"
              :value="website.link"
            />
            <v-error-message class="input-error-message" name="link" />
          </div>
        </div>
        <div class="uk-margin-bottom">
          <label class="input-label" :class="{ '--invalid': errors.description }" for="description">
            {{ $t('websites.components.mainInfo.fields.description') }}
          </label>
          <div class="input-container">
            <v-field
              id="description"
              class="uk-textarea --outline description"
              as="textarea"
              name="description"
              :label="$t('websites.components.mainInfo.fields.description')"
              :class="{ '--invalid': errors.description }"
              v-e2e
              :value="website.description"
            />
            <v-error-message class="input-error-message" name="description" />
          </div>
        </div>
        <div class="uk-margin-bottom">
          <websites-favicon-uploader name="favicon" :photo-url="website.faviconUrl || ''" />
        </div>
        <div>
          <core-form-switcher
            :checked="Boolean(website.active)"
            name="active"
            :label="$t('websites.components.mainInfo.fields.enable')"
          />
        </div>
      </div>
    </div>

    <div class="uk-text-right">
      <router-link
        v-e2e="'cancel-website'"
        :to="{ name: 'websites' }"
        class="uk-margin-right">
        {{ $t('websites.shared.cancel') }}
      </router-link>
      <button
        v-e2e
        type="submit"
        :disabled="loading"
        class="uk-button uk-button-success uk-padding uk-padding-remove-vertical"
        @click="handleSubmitClick({ validate, onSubmit })"
      >
        <div v-if="loading" uk-spinner="ratio: 0.5"></div>
        {{ $t('websites.shared.save') }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { onBeforeRouteLeave } from 'vue-router';

import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import { handleSubmitClick } from '@/utils/form';
import { showModalForDirtyForm } from '@/utils/modal';
import useKit from '@/modules/core/composables/uikit';
import WebsitesFaviconUploader from './WebsitesFaviconUploader.vue';

export default {
  name: 'WebsitesMainInfo',
  props: {
    website: Object,
  },
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormSwitcher,
    WebsitesFaviconUploader,
  },
  setup(props) {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const {
      validate,
      errors,
      meta,
      handleSubmit,
    } = useForm();

    const loading = ref(false);
    const onSubmit = handleSubmit((data) => {
      loading.value = true;
      store.dispatch('websites/update', { id: props.website.id, data })
        .then(() => uikit.notify('success', i18n.t('websites.views.form.updateSuccess')))
        .catch((error) => uikit.notify('danger', error.message))
        .finally(() => { loading.value = false; });
    });

    onBeforeRouteLeave(showModalForDirtyForm({
      uikit,
      i18n,
      meta,
    }));

    return {
      loading,
      errors,

      validate,
      handleSubmitClick,
      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  padding: 20px;

  &__header {
    margin-bottom: 24px;
  }

  &__heading {
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 500;
    color: $base-color-darken;
    margin: 0;
    text-transform: uppercase;
  }

  &__description {
    color: rgba($base-color-darken, 0.35);
    font-size: 0.75rem;
    margin: 4px 0 0;
  }
}

.description {
  min-width: 100%;
  min-height: 100px;
}

.grid {
  display: grid;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: 1fr 1fr;
  }

  @include fromTablet {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
