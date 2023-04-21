<template>
  <div class="card">
    <div class="uk-margin-small-bottom">
      <rentals-google-map
        :label="$t('rentals.components.locationAddress.address')"
        :formatted-address="address?.formattedAddress"
        :address="address"
        :coordinates="formValues.coordinates"
        :values="formValues"
        :errors="errors"
        @placeChanged="onChangePlace"
        @markerDragged="onMarkerDragged"
        @coordinatesChanged="onSaveCoordinates"
        @defaultCoordinatesChanged="onDefaultCoordinatesSet"
      />
    </div>
    <div
      class="map-footer"
      :class="{ 'uk-flex-middle': !editMode, 'uk-flex-top': editMode }"
    >
      <div class="coords uk-margin-small-top" v-show="!editMode">
        <span>
          {{ $t('rentals.components.locationAddress.lat', { num: formValues.coordinates?.lat || '-' }) }} -
          {{ $t('rentals.components.locationAddress.lng', { num: formValues.coordinates?.lng || '-' }) }}
        </span>
        <button
          class="uk-button uk-button-text"
          type="button"
          @click="editMode = true"
        >
          <core-svg
            width="18"
            :src="require('@/assets/images/icons/edit.svg')"
          />
        </button>
      </div>
      <div v-show="editMode" class="uk-margin-small-top uk-margin-small-right">
        <div
          class="coords-form"
        >
          <core-form-input-number
            class="coords-form__item"
            :label="$t('rentals.shared.lat')"
            name="coordinates.lat"
            :value="formValues.coordinates?.lat"
            @input="$emit('setValues', { coordinates: { ...formValues.coordinates } })"
            rules="required|between:-90,90"
            :maxFractionDigits="10"
            float
          />
          <core-form-input-number
            class="coords-form__item"
            :label="$t('rentals.shared.lng')"
            name="coordinates.lng"
            :value="formValues.coordinates?.lng"
            @input="$emit('setValues', { coordinates: { ...formValues.coordinates } })"
            rules="required|between:-180,180"
            :maxFractionDigits="10"
            float
          />

          <div class="uk-flex uk-flex-middle uk-margin-top">
            <button
              class="uk-button uk-button-primary"
              type="button"
              @click="editMode = false"
              :disabled="errors['coordinates.lat'] || errors['coordinates.lng']"
              v-e2e
            >
              {{ $t('rentals.shared.save') }}
            </button>
          </div>
        </div>
      </div>
      <div class="uk-margin-small-top">
        <core-form-checkbox
          name="isAddressPublic"
          :label="$t('rentals.components.locationAddress.hideRental')"
          :class="{ 'hide-rental': editMode }"
          :checked="Boolean(rental.isAddressPublic)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import {
  useField,
} from 'vee-validate';
import { useStore } from 'vuex';

import { getAddress } from '@/utils/google';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import RentalsGoogleMap from './RentalsGoogleMap.vue';

export default {
  name: 'RentalsLocationAddress',
  components: {
    RentalsGoogleMap,
    CoreFormCheckbox,
    CoreFormInputNumber,
  },
  props: {
    errors: {
      type: Object,
    },
    formValues: {
      type: Object,
    },
  },
  emits: ['setValues', 'setBaseValues'],
  setup(props, { emit }) {
    const store = useStore();

    const editMode = ref(false);

    const rental = computed(() => store.state.rentals.rentals.entity);

    const addressField = useField('address', undefined, {
      initialValue: rental.value.address,
    });

    const onSaveCoordinates = (coordinates) => {
      editMode.value = false;
      emit('setValues', { coordinates });
    };

    const onChangePlace = (place) => {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      addressField.handleChange(getAddress(place));
      emit('setValues', { coordinates: { lat, lng } });
    };

    const onMarkerDragged = (markerEvent) => {
      const lat = markerEvent.latLng.lat();
      const lng = markerEvent.latLng.lng();

      emit('setValues', { coordinates: { lat, lng } });
    };

    onMounted(() => {
      emit('setBaseValues', {
        coordinates: { ...rental.value.coordinates || {} },
      });
    });

    const onDefaultCoordinatesSet = (coordinates) => {
      emit('setBaseValues', {
        coordinates,
      });
    };

    return {
      rental,
      editMode,
      address: addressField.value,

      onSaveCoordinates,
      onChangePlace,
      onMarkerDragged,
      onDefaultCoordinatesSet,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  padding: 20px;
}
.map-footer {
  @include fromTablet {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}
.coords {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  color: rgba($base-color-darken, 0.7);
  font-size: 0.875rem;
}
.address-field {
  display: grid;

  @include fromWideMobile {
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
  }
}
.hide-rental {
  height: 33px;
}
.coords-form {
  @include fromWideMobile {
    display: flex;

    &__item {
      margin-right: 20px;
    }
  }
}
</style>
