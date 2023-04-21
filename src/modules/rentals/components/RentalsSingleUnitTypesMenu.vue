<template>
  <div
    class="navbar navbar--page uk-navbar-container vertical uk-navbar uk-navbar-primary"
  >
    <div class="uk-flex uk-flex-middle">
      <core-image
        class="avatar"
        :src="rental.mainImage || ''"
        :gray-placeholder="true"
        :fallback="require('@/assets/images/placeholders/rentals.svg')"
      />
      <div class="uk-margin-small-left uk-overflow-hidden">
        <h5
          class="name"
          :uk-tooltip="rental.name.length > 24 ? 'pos: bottom;title: ' + rental.name : 'title:'"
        >{{ rental.name }}</h5>
        <p class="status">
          {{ rentalStatusCompleted ? $t('rentals.shared.completed') : $t('rentals.shared.notCompleted') }}
        </p>
      </div>
    </div>
    <ul class="uk-nav uk-nav-default uk-margin-small-top">
      <li class="uk-nav-header">{{ $t('rentals.shared.menu.required') }}</li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :class="rental.completeness.overview ? '--success' : '--error'"
          :to="{ name: 'rental-overview', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.overview') }}</router-link>
      </li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :class="rental.completeness.location ? '--success' : '--error'"
          :to="{ name: 'rental-location', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.location') }}</router-link>
      </li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :class="rental.completeness.photos ? '--success' : '--error'"
          :to="{ name: 'rental-photos', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.photos') }}</router-link>
      </li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :class="rental.completeness.rates ? '--success' : '--error'"
          :to="{ name: 'rental-rates', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.rates') }}</router-link>
      </li>
      <li class="uk-nav-header">{{ $t('rentals.shared.menu.optional') }}</li>
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
        </router-link>
      </li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :to="{ name: 'rental-season-rates', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.seasonRates') }}</router-link>
      </li>
      <li
        v-access="{ limits, name: LIMITS.APP_SERVICES_ENABLED, user, acl: MODULES.SERVICES }"
        @click="onNavItemClicked"
      >
        <router-link
          class="uk-nav-link"
          :to="{ name: 'rental-services', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.services') }}</router-link>
      </li>
      <li
        v-access="{
          limits,
          name: [LIMITS.APP_FEES_ENABLED, LIMITS.APP_TAXES_ENABLED],
          user,
          acl: [MODULES.FEES, MODULES.TAXES]
        }"
        @click="onNavItemClicked"
      >
        <router-link
          class="uk-nav-link"
          :to="{ name: 'rental-fees-and-taxes', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.fees') }}</router-link>
      </li>
      <li @click="onNavItemClicked">
        <router-link
          class="uk-nav-link"
          :to="{ name: 'rental-settings', params: { id: rental.id } }"
        >{{ $t('rentals.shared.menu.settings') }}</router-link>
      </li>
      <li
        @click="onNavItemClicked"
      >
        <router-link
          class="uk-nav-link"
          :to="{ name: 'rental-customer-contacts', params: { id: $route.params.id } }"
        >
          <span>{{ $t('rentals.shared.menu.customerContacts') }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { LIMITS, MODULES } from '@/utils/acl';
import CoreImage from '@/modules/core/components/CoreImage.vue';

export default {
  name: 'RentalsSingleUnitTypesMenu',
  props: ['onNavItemClicked'],
  components: {
    CoreImage,
  },
  setup() {
    const store = useStore();

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const rental = computed(() => store.state.rentals.rentals.entity);
    const channelsEnabled = computed(() => store.getters['channels/enabled']);
    const rentalStatusCompleted = computed(() => Object.values(rental.value.completeness).every(Boolean));

    return {
      LIMITS,
      MODULES,
      user,
      limits,
      rental,
      channelsEnabled,
      rentalStatusCompleted,
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
  padding-left: 25px;

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
</style>
