<template>
  <div
    class="navbar navbar--page uk-navbar-container vertical uk-navbar uk-navbar-primary uk-padding-remove"
  >
    <div class="nav">
      <div class="uk-flex uk-flex-middle">
        <core-image
          class="avatar"
          :src="rental.mainImage || ''"
          :gray-placeholder="true"
          :fallback="require('@/assets/images/placeholders/rentals.svg')"
        />
        <div class="uk-margin-small-left uk-overflow-hidden">
          <h5
            :uk-tooltip="rental.name.length > 24 ? 'pos: bottom;title: ' + rental.name : 'title:'"
            class="name"
          >{{ rental.name }}</h5>
          <p class="status">
            {{ rentalStatusCompleted ? $t('rentals.shared.completed') : $t('rentals.shared.notCompleted') }}
          </p>
        </div>
      </div>
      <ul class="uk-nav uk-nav-default uk-margin-small-top">
        <li class="uk-parent" @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rental.completeness.overview ? '--success' : '--error'"
            :to="{ name: 'rental-overview', params: { id: $route.params.id } }"
          >{{ $t('rentals.shared.menu.overview') }}</router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rental.completeness.location ? '--success' : '--error'"
            :to="{ name: 'rental-location', params: { id: $route.params.id } }"
          >{{ $t('rentals.shared.menu.location') }}</router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rental.completeness.photos ? '--success' : '--error'"
            :to="{ name: 'rental-photos', params: { id: $route.params.id } }"
          >{{ $t('rentals.shared.menu.photos') }}</router-link>
        </li>
        <li
          v-access="{ limits, name: LIMITS.APP_CHANNELS_ENABLED, user, acl: MODULES.CHANNELS }"
          @click="onNavItemClicked"
        >
          <router-link
            class="uk-nav-link"
            :class="{ '--disabled': !channelsEnabled }"
            :to="{ name: 'rental-channel-manager', params: { id: $route.params.id } }"
          >
            <span>{{ $t('rentals.shared.menu.channelManager') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
        <li
          v-access="{ limits, name: LIMITS.APP_SERVICES_ENABLED, user, acl: MODULES.SERVICES }"
          @click="onNavItemClicked"
        >
          <router-link
            class="uk-nav-link"
            :to="{ name: 'rental-services', params: { id: $route.params.id } }"
          >
            <span>{{ $t('rentals.shared.menu.services') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :to="{ name: 'rental-fees-and-taxes', params: { id: $route.params.id } }"
          >
            <span>{{ $t('rentals.shared.menu.fees') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :to="{ name: 'rental-settings', params: { id: $route.params.id } }"
          >
            <span>{{ $t('rentals.shared.menu.settings') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
        <li
          @click="onNavItemClicked"
        >
          <router-link
            class="uk-nav-link"
            :to="{ name: 'rental-customer-contacts', params: { id: $route.params.id } }"
          >
            <span>{{ $t('rentals.shared.menu.customerContacts') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="units-nav">
      <div>
        <core-form-select
          name="rentalType"
          ref="rentalTypeSelectRef"
          class="--dark"
          @change="$event.target.value ? onChangeRentalType($event.target.value)
           : $router.push({ name: 'rental-overview', params: { id: $route.params.id } })"
          :value="$route.params.rentalTypeId"
          :data="rentalTypes"
        />
      </div>
      <ul
        v-if="$route.params.rentalTypeId"
        class="uk-nav uk-nav-default uk-margin-small-top"
      >
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rentalType.completeness.overview ? '--success' : '--error'"
            :to="{
              name: 'rental-type-overview',
              params: { id: $route.params.id, rentalTypeId: $route.params.rentalTypeId }
            }"
          >{{ $t('rentals.shared.menu.overview') }}</router-link>
        </li>
        <li
          v-access="{ limits, name: LIMITS.APP_PROPERTIES_UNITS_ENABLED, user, acl: MODULES.PROPERTIES_UNITS }"
          @click="onNavItemClicked"
        >
          <router-link
            class="uk-nav-link"
            :class="rentalType.completeness.units ? '--success' : '--error'"
            :to="{
              name: 'rental-type-units',
              params: { id: $route.params.id, rentalTypeId: $route.params.rentalTypeId },
          }"
          >{{ $t('rentals.shared.menu.units') }}</router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rentalType.completeness.photos ? '--success' : '--error'"
            :to="{
              name: 'rental-type-photos',
              params: {
                id: $route.params.id,
                rentalTypeId: $route.params.rentalTypeId
              }
            }"
          >{{ $t('rentals.shared.menu.photos') }}</router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :class="rentalType.completeness.rates ? '--success' : '--error'"
            :to="{
              name: 'rental-type-rates',
              params: {
                id: $route.params.id,
                rentalTypeId: $route.params.rentalTypeId
              }
            }"
          >{{ $t('rentals.shared.menu.rates') }}</router-link>
        </li>
        <li @click="onNavItemClicked">
          <router-link
            class="uk-nav-link"
            :to="{
              name: 'rental-type-season-rates',
              params: {
                id: $route.params.id,
                rentalTypeId: $route.params.rentalTypeId,
              }
            }"
          >
            <span>{{ $t('rentals.shared.menu.seasonRates') }}</span>
            <span class="uk-badge uk-badge-outline">{{ $t('rentals.shared.menu.optional') }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { LIMITS, MODULES } from '@/utils/acl';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreImage from '@/modules/core/components/CoreImage.vue';

export default {
  name: 'RentalsMultipleUnitTypesMenu',
  components: {
    CoreFormSelect,
    CoreImage,
  },
  props: ['onNavItemClicked'],
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const rentalTypeSelectRef = ref(null);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const channelsEnabled = computed(() => store.getters['channels/enabled']);
    const rental = computed(() => store.state.rentals.rentals.entity);
    const rentalType = computed(() => store.state.rentals.rentalTypes.entity);
    const rentalTypes = computed(() => store.state.rentals.rentalTypes.list.map((rentType) => ({
      label: rentType.name,
      value: rentType.id.toString(),
    })));
    const rentalStatusCompleted = computed(() => Object.values(rental.value.completeness).every(Boolean));

    const onChangeRentalType = async (rentalTypeId) => {
      await router.push({
        name: 'rental-type-overview',
        params: { id: route.params.id, rentalTypeId },
      });
      await store.dispatch('rentals/rentalTypes/setRentalType', {
        propertyId: route.params.id,
        id: rentalTypeId,
      });
    };

    watch(() => store.state.rentals.rentalTypes.entity, () => {
      rentalTypeSelectRef.value.refreshValue();
    });

    return {
      LIMITS,
      MODULES,
      user,
      limits,
      channelsEnabled,
      rental,
      rentalType,
      rentalTypes,
      rentalStatusCompleted,
      rentalTypeSelectRef,

      onChangeRentalType,
    };
  },
};
</script>

<style lang="scss" scoped>
.name {
  color: $color-white;
  font-weight: 500;
  margin: 0;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  white-space: nowrap;
  outline: none;
}
.avatar {
  min-width: 40px;
  width: 40px;
  height: 40px;
  background-color: $color-white;
  border-radius: 50%;

  ::v-deep() img {
    object-fit: cover;
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}
.status {
  color: rgba($color-white, 0.5);
  font-size: 0.875rem;
  margin: 0;
}
.uk-nav-link {
  position: relative;
  display: flex;
  align-items: center;
  padding-left: 25px;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 3px;
    height: 5px;
    width: 5px;
    border-radius: 50%;
    background-color: rgba($color-white, 0.4);
    transform: translateY(-50%);
  }

  &.--success::before {
    background-color: $success-color;
  }

  &.--error::before {
    background-color: $error-color;
  }

  &.--disabled {
    cursor: not-allowed;

    span:first-child {
      opacity: 0.5;
    }
  }
}
.nav {
  padding: 15px;
  border-bottom: 1px solid rgba($color-white, 0.2);
}
.units-nav {
  padding: 15px;
}
.uk-badge-outline {
  font-size: 0.65rem;
  background-color: transparent;
  border: 1px solid rgba($color-white, 0.1);
  color: rgba($color-white, 0.5);
  line-height: 1rem;
  margin-left: auto;
}
</style>
