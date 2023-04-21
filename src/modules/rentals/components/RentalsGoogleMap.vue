<template>
  <div class="uk-position-relative">
    <div class="uk-margin-small-bottom autocomplete-input">
      <label v-if="label" class="input-label">{{ label }}</label>
      <div class="input-container">
        <input
          ref="inputRef"
          type="text"
          class="uk-input --outline"
          :value="formattedAddress"
          :disabled="values.address?.manualAddress"
        />
      </div>
    </div>
    <div class="uk-margin-small-bottom uk-flex">
      <core-form-checkbox
        name="address.manualAddress"
        :checked="Boolean(address?.manualAddress)"
        :label="$t('rentals.components.locationAddress.manualAddress')"
      />
    </div>
    <div v-show="values.address?.manualAddress" class="uk-margin-small-bottom autocomplete-input">
      <div class="half-grid">
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors['address.city'] }" for="city">
            {{ $t('rentals.components.locationAddress.city') }}
          </label>
          <div class="input-container">
            <v-field
              id="city"
              name="address.city"
              as="input"
              v-e2e
              class="uk-input --outline"
              :class="{ '--invalid': errors['address.city'] }"
              :placeholder="$t('rentals.components.locationAddress.city')"
              :label="$t('rentals.components.locationAddress.city')"
              :value="address?.city || ''"
              rules="required_if:address.manualAddress,1|max:191"
            />
            <v-error-message class="input-error-message" name="address.city" />
          </div>
        </div>

        <div class="uk-margin-bottom">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors['address.countryCode'] }"
            for="countryCode"
          >
            {{ $t('rentals.components.locationAddress.country') }}
          </label>
          <div class="input-container">
            <core-form-select
              id="countryCode"
              name="address.countryCode"
              :class="{ '--invalid': errors['address.countryCode'] }"
              :label="$t('rentals.components.locationAddress.country')"
              :value="address?.countryIsoCode || ''"
              rules="required_if:address.manualAddress,1"
              :data="countries"
              :search="true"
            />
            <v-error-message class="input-error-message" name="address.countryCode" />
          </div>
        </div>
      </div>

      <div class="half-grid">
        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors['address.street1'] }" for="street1">
            {{ $t('rentals.components.locationAddress.street1') }}
          </label>
          <div class="input-container">
            <v-field
              id="street1"
              name="address.street1"
              as="input"
              v-e2e
              class="uk-input --outline"
              :class="{ '--invalid': errors['address.street1'] }"
              :placeholder="$t('rentals.components.locationAddress.street1')"
              :label="$t('rentals.components.locationAddress.street1')"
              :value="address?.street1 || ''"
              rules="required_if:address.manualAddress,1|max:191"
            />
            <v-error-message class="input-error-message" name="address.street1" />
          </div>
        </div>

        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors['address.street2'] }" for="street2">
            {{ $t('rentals.components.locationAddress.street2') }}
          </label>
          <div class="input-container">
            <v-field
              id="street2"
              name="address.street2"
              as="input"
              v-e2e
              class="uk-input --outline"
              :class="{ '--invalid': errors['address.street2'] }"
              :placeholder="$t('rentals.components.locationAddress.street2')"
              :label="$t('rentals.components.locationAddress.street2')"
              :value="address?.street2 || ''"
              rules="required_if:address.manualAddress,1|max:191"
            />
            <v-error-message class="input-error-message" name="address.street2" />
          </div>
        </div>
      </div>

      <div class="half-grid">
        <div class="uk-margin-bottom">
          <label
            class="input-label --required"
            :class="{ '--invalid': errors['address.stateProvince'] }"
            for="stateProvince"
          >
            {{ $t('rentals.components.locationAddress.stateProvince') }}
          </label>
          <div class="input-container">
            <v-field
              id="stateProvince"
              name="address.stateProvince"
              as="input"
              v-e2e
              class="uk-input --outline"
              :class="{ '--invalid': errors['address.stateProvince'] }"
              :placeholder="$t('rentals.components.locationAddress.stateProvince')"
              :label="$t('rentals.components.locationAddress.stateProvince')"
              :value="address?.stateProvince || ''"
              rules="required_if:address.manualAddress,1|max:191"
            />
            <v-error-message class="input-error-message" name="address.stateProvince" />
          </div>
        </div>

        <div class="uk-margin-bottom">
          <label class="input-label --required" :class="{ '--invalid': errors['address.zipCode'] }" for="zipCode">
            {{ $t('rentals.components.locationAddress.zipCode') }}
          </label>
          <div class="input-container">
            <v-field
              id="zipCode"
              name="address.zipCode"
              as="input"
              v-e2e
              class="uk-input --outline"
              :class="{ '--invalid': errors['address.zipCode'] }"
              :placeholder="$t('rentals.components.locationAddress.zipCode')"
              :label="$t('rentals.components.locationAddress.zipCode')"
              :value="address?.zipCode || ''"
              rules="required_if:address.manualAddress,1|max:191"
            />
            <v-error-message class="input-error-message" name="address.zipCode" />
          </div>
        </div>
      </div>

      <div class="uk-margin-bottom">
        <label
          class="input-label --required"
          :class="{ '--invalid': errors['address.formattedAddress'] }"
          for="formattedAddress"
        >
          {{ $t('rentals.components.locationAddress.formattedAddress') }}
        </label>
        <div class="input-container">
          <v-field
            id="formattedAddress"
            name="address.formattedAddress"
            as="input"
            v-e2e
            class="uk-input --outline"
            :class="{ '--invalid': errors['address.formattedAddress'] }"
            :placeholder="$t('rentals.components.locationAddress.formattedAddress')"
            :label="$t('rentals.components.locationAddress.formattedAddress')"
            :value="address?.formattedAddress || ''"
            rules="required_if:address.manualAddress,1|max:191"
          />
          <v-error-message class="input-error-message" name="address.formattedAddress" />
        </div>
      </div>
    </div>
    <div class="map" ref="mapRef"></div>
    <div class="uk-position-cover uk-overlay uk-overlay-default" v-if="loading">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </div>
</template>

<script>
import {
  computed, onBeforeMount, ref, watch,
} from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field } from 'vee-validate';
import COUNTRIES from 'country-region-data';

import { loadGoogleMapScript } from '@/utils/google';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';

export default {
  name: 'RentalsGoogleMap',
  components: {
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreFormCheckbox,
    CoreFormSelect,
  },
  props: {
    label: {
      type: String,
    },
    formattedAddress: {
      type: String,
    },
    coordinates: {
      type: Object,
    },
    address: {
      type: Object,
    },
    values: {
      type: Object,
    },
    errors: {
      type: Object,
    },
  },
  emits: [
    'placeChanged',
    'markerDragged',
    'coordinatesChanged',
    'defaultCoordinatesChanged',
  ],
  setup(props, { emit }) {
    const store = useStore();

    const inputRef = ref(null);
    const loading = ref(false);

    const mapRef = ref(null);
    const mapInstance = ref(null);
    const markerInstance = ref(null);

    const countries = COUNTRIES.map((country) => ({
      label: country.countryName,
      value: country.countryShortCode,
    }));

    const user = computed(() => store.state.account.user);

    const DEFAULT_LAT = 40.749933;
    const DEFAULT_LNG = -73.98633;

    const setMapCoordinates = (lat, lng) => {
      const map = mapInstance.value;
      const marker = markerInstance.value;
      const latLng = new window.google.maps.LatLng(lat, lng);

      if (map) {
        map.setCenter(latLng);
      }

      if (marker) {
        marker.setPosition(latLng);
        marker.setVisible(true);
      }
    };

    const initMap = () => {
      const latLng = new window.google.maps.LatLng(
        props.coordinates?.lat || DEFAULT_LAT,
        props.coordinates?.lng || DEFAULT_LNG,
      );

      const options = {
        center: latLng,
        zoom: 13,
        controlSize: 24,
      };
      mapInstance.value = new window.google.maps.Map(mapRef.value, options);
      markerInstance.value = new window.google.maps.Marker({
        map: mapInstance.value,
        draggable: true,
        position: latLng,
        anchorPoint: new window.google.maps.Point(0, -29),
      });
      markerInstance.value.setVisible(!!props.coordinates);
      markerInstance.value.addListener('dragend', (event) => {
        emit('markerDragged', event);
      });

      if (!props.coordinates || (props.coordinates.lat == null && props.coordinates.lng == null)) {
        const address = Intl.DateTimeFormat().resolvedOptions().timeZone.replace('/', ', ');
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ address }, ([place]) => {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();

          emit('defaultCoordinatesChanged', { lat, lng });
        });
      }
    };

    const initAutocomplete = () => {
      const options = {};
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.value, options);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          return;
        }

        const map = mapInstance.value;
        const marker = markerInstance.value;

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        emit('placeChanged', place);
      });
    };

    onBeforeMount(() => {
      loading.value = true;
      loadGoogleMapScript(store.state.core.config.google.maps.apiKey, user.value.language).then(() => {
        initAutocomplete();
        initMap();
        loading.value = false;
      });
    });

    watch(() => props.coordinates, (coords) => {
      if (window.google && coords && coords.lat != null && coords.lng != null) {
        setMapCoordinates(coords.lat, coords.lng);
      }
    });

    return {
      countries,
      inputRef,
      mapRef,
      loading,
    };
  },
};
</script>

<style lang="scss" scoped>
.map {
  height: 360px;
  width: 100%;
}
.autocomplete-input {
  @include fromTablet {
    width: 50%;
  }
}
.half-grid {
  display: grid;

  @include fromWideMobile {
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
  }
}
</style>
