<template>
  <div class="card">
    <div class="card__header">
      <div class="card__heading uk-flex uk-flex-middle">
        <core-svg
          :width="24"
          :src="require('@/assets/images/icons/house-like.svg')"
          class="uk-margin-small-right"
        />
        <h5 class="card__title">{{ $t('rentals.components.rentalAmenities.' + ctx + '.title') }}</h5>
      </div>
      <p class="card__description">{{ $t('rentals.components.rentalAmenities.' + ctx + '.description') }}</p>
    </div>

    <div class="room-types">
      <rentals-room-attribute
        v-for="(item, idx) in data"
        :key="idx"
        :name="item.label"
        :icon="'amenities/' + (item.icon || DEFAULT_ICON)"
        :qty="Number(item.count)"
        @delete="onDelete(item)"
      />
    </div>

    <div v-if="amenitiesDict.length" class="uk-margin-top">
      <button
        v-if="!createMode"
        class="uk-button uk-button-link uk-button--add"
        @click="createMode = true"
        v-e2e="'add-amenity'"
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
          v-slot="{ errors }"
          class="uk-flex uk-flex-bottom uk-flex-wrap"
          @submit="onSubmit"
          name="amenity"
          v-e2e
        >
          <div class="room-type-select uk-margin-right">
            <label class="input-label --required" for="roomType" :class="{ '--invalid': errors.roomType }">
              {{ $t('rentals.components.rentalAmenities.amenitiesType') }}
            </label>
            <div id="roomType" class="input-container">
              <core-form-select
                :data="amenitiesDict"
                name="roomType"
                rules="required"
                :label="$t('rentals.components.rentalAmenities.amenitiesType')"
                :class="{ '--invalid': errors.roomType }"
                :search="true"
                :press-label="false"
              />
              <v-error-message class="input-error-message uk-text-nowrap" name="roomType" />
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
              v-e2e="'amenity'"
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
              v-e2e="'cancel-amenity'"
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
import { AMENITIES_CATEGORIES, DEFAULT_ICON } from '../services';
import RentalsRoomAttribute from './RentalsRoomAttribute.vue';

export default {
  name: 'RentalsRentalAmenities',
  props: {
    amenities: {
      type: Array,
    },
    ctx: {
      type: String,
    },
  },
  components: {
    VForm: Form,
    VErrorMessage: ErrorMessage,
    CoreFormSelect,
    RentalsRoomAttribute,
    CoreFormInputNumber,
  },
  setup(props) {
    const i18n = useI18n();
    const store = useStore();

    const getItem = (roomType, count) => {
      const room = store.state.rentals.dicts.amenities.find((amenity) => amenity.id === Number(roomType));

      if (!room) {
        return null;
      }

      return {
        dictAmenityId: roomType,
        icon: room.icon,
        label: i18n.t(`core.dicts.amenities.${room.name}`),
        count,
      };
    };

    const { handleChange, value } = useField('amenities', undefined, {
      initialValue: props.amenities.map(({ dictAmenityId, count }) => getItem(dictAmenityId, count))
        .filter(Boolean),
    });

    const createMode = ref(false);

    const amenities = computed(
      () => store.state.rentals.dicts.amenities
        .filter(({ id }) => !value.value.some(({ dictAmenityId }) => dictAmenityId === id)),
    );

    const amenitiesDict = computed(() => Object.values(AMENITIES_CATEGORIES).map((category) => ({
      id: category,
      label: i18n.t(`rentals.dicts.amenitiesCategories.${category}`),
      choices: amenities.value.filter((amenity) => amenity.category === category)
        .map((amenity) => ({
          value: amenity.id,
          label: i18n.t(`core.dicts.amenities.${amenity.name}`),
        })),
    })));

    const onSubmit = ({ roomType, count }) => {
      createMode.value = false;
      handleChange([
        ...value.value,
        getItem(roomType, count),
      ]);
    };

    const onDelete = (entity) => {
      handleChange(value.value.filter((item) => item !== entity));
    };

    return {
      DEFAULT_ICON,
      createMode,
      data: value,
      amenitiesDict,

      onSubmit,
      onDelete,
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
</style>
