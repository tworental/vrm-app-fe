<template>
  <div class="card">
    <div class="card__header">
      <div class="card__heading uk-flex uk-flex-middle">
        <core-svg
          :width="24"
          :src="require('@/assets/images/icons/hotel-info.svg')"
          class="uk-margin-small-right"
        />
        <h5 class="card__title">{{ $t('rentals.components.sleepingArrangements.title') }}</h5>
      </div>
      <p class="card__description">{{ $t('rentals.components.sleepingArrangements.description') }}</p>
    </div>

    <div class="room-types">
      <rentals-room-attribute
        v-for="(item, idx) in data"
        :key="idx"
        :name="item.label"
        :icon="'sleepingArrangements/' + (item.icon || DEFAULT_ICON)"
        :qty="Number(item.count)"
        @delete="onDelete(item)"
      />
    </div>

    <div v-if="sleepings.length" class="uk-margin-top">
      <button
        v-if="!createMode"
        class="uk-button uk-button-link uk-button--add"
        @click="createMode = true"
        v-e2e="'add-arrangement'"
        type="button"
      >
        <core-svg
          :width="17"
          :src="require('@/assets/images/icons/add.svg')"
        />
        <span>{{ $t('rentals.shared.add') }}</span>
      </button>
      <template v-else>
        <v-form
          v-slot="{ errors, values }"
          class="uk-flex uk-flex-bottom uk-flex-wrap"
          name="sleeping"
          v-e2e
          @submit="onSubmit"
        >
          <div class="room-type-select uk-margin-small-right">
            <label class="input-label" for="roomType" :class="{ '--invalid': errors.dictArrangementId }">
              {{ $t('rentals.components.sleepingArrangements.sleepingType') }}
            </label>
            <div id="roomType" class="input-container">
              <core-form-select
                :data="sleepings"
                name="dictArrangementId"
                rules="required"
                :label="$t('rentals.components.sleepingArrangements.sleepingType')"
                :class="{ '--invalid': errors.dictArrangementId }"
                :search="true"
              />
              <v-error-message class="input-error-message uk-text-nowrap" name="dictArrangementId" />
            </div>
          </div>
          <div class="privacy-select uk-margin-small-right">
            <label
              class="input-label"
              :class="{ '--invalid': errors.privacy }"
              for="privacy"
            >{{ $t('rentals.shared.privacy') }}</label>
            <div class="input-container">
              <core-form-select
                id="privacy"
                name="privacy"
                :label="$t('rentals.shared.privacy')"
                :class="{ '--invalid': errors.privacy }"
                rules="required"
                :value="getPrivacies(values.dictArrangementId)[0].value"
                :data="getPrivacies(values.dictArrangementId)"
                :show-placeholder="false"
              />
              <v-error-message class="input-error-message uk-text-nowrap" name="privacy" />
            </div>
          </div>
          <core-form-input-number
            class="qty-select uk-margin-right"
            :label="$t('rentals.shared.quantity')"
            name="count"
            rules="required|between:1,100"
            :value="1"
          />
          <div class="uk-flex uk-flex-middle uk-margin-top">
            <button
              class="uk-button uk-button-primary uk-button--add uk-margin-right"
              type="submit"
              v-e2e="'arrangement'"
            >
              <core-svg
                :width="17"
                :src="require('@/assets/images/icons/add.svg')"
              />
              <span>{{ $t('rentals.shared.add') }}</span>
            </button>
            <button
              type="button"
              class="uk-button uk-button-link"
              @click="createMode = false"
              v-e2e="'cancel-arrangement'"
            >
              {{ $t('rentals.shared.cancel') }}
            </button>
          </div>
        </v-form>
      </template>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ErrorMessage,
  Form,
  useField,
} from 'vee-validate';

import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import RentalsRoomAttribute from './RentalsRoomAttribute.vue';
import { ARRANGEMENT_TYPES, DEFAULT_ICON, PRIVACY_TYPES } from '../services';

export default {
  name: 'RentalsSleepingArrangements',
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    RentalsRoomAttribute,
    CoreFormInputNumber,
  },
  props: {
    arrangements: {
      type: Array,
    },
  },
  setup(props) {
    const i18n = useI18n();
    const store = useStore();

    const privacies = Object.values(PRIVACY_TYPES).map((privacy) => ({
      label: i18n.t(`rentals.dicts.privacy.${privacy}`),
      value: privacy,
    }));

    const getItem = (dictArrangementId, count, privacy) => {
      const item = store.state.rentals.dicts.sleeping.find((sleeping) => sleeping.id === Number(dictArrangementId));

      if (!item) {
        return null;
      }

      return {
        dictArrangementId: Number(dictArrangementId),
        value: Number(count),
        icon: item.icon,
        count,
        privacy,
        type: ARRANGEMENT_TYPES.SLEEPING,
        label: [
          i18n.t(`core.dicts.sleepingArrangements.${item.name}`),
          `(${i18n.t(`rentals.dicts.privacy.${privacy}`)})`.toLowerCase(),
        ].join(' '),
      };
    };

    const { handleChange, value } = useField(ARRANGEMENT_TYPES.SLEEPING, undefined, {
      initialValue: props.arrangements
        .map(({ dictArrangementId, count, privacy }) => getItem(dictArrangementId, count, privacy))
        .filter(Boolean),
    });

    const createMode = ref(false);

    const sleepings = computed(
      () => store.state.rentals.dicts.sleeping
        .filter(
          ({ id }) => value.value.filter(
            ({ dictArrangementId }) => dictArrangementId === id,
          ).length < privacies.length,
        )
        .map((sleeping) => ({
          value: sleeping.id,
          label: i18n.t(`core.dicts.sleepingArrangements.${sleeping.name}`),
        })),
    );

    const onSubmit = ({ dictArrangementId, count, privacy }) => {
      handleChange([
        ...value.value,
        getItem(dictArrangementId, count, privacy),
      ]);

      createMode.value = false;
    };

    const onDelete = (entity) => {
      handleChange(value.value.filter((item) => item !== entity));
    };

    const getPrivacies = (dictArrangementId) => {
      if (!dictArrangementId) {
        return privacies;
      }

      const disabledPrivacies = value.value.filter(
        (item) => item.dictArrangementId === Number(dictArrangementId),
      ).map(({ privacy }) => privacy);

      return privacies
        .filter((privacy) => !disabledPrivacies.includes(privacy.value));
    };

    return {
      DEFAULT_ICON,
      createMode,
      data: value,
      sleepings,

      onSubmit,
      onDelete,
      getPrivacies,
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
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0;
  }
}
.description {
  min-height: 100px;
}
.room-types {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-auto-flow: row dense;
  grid-gap: 10px;
}
.room-type-select {
  min-width: 130px;

  @include fromWideMobile {
    min-width: 280px;
  }
}
.privacy-select {
  min-width: 100px;
}
.qty-select {
  min-width: 60px;
}
</style>
