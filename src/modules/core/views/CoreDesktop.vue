<template>
  <core-line-loading v-if="isLoading" />

  <core-layout :core="true">
    <template #alert v-if="$route.name && $route.name !== 'verification-phone'">
      <core-alert v-if="isTrialVersion" icon="alarm" :type="isTrialExpired ? 'danger' : 'primary'">
        <strong v-if="!isTrialExpired">
          {{
            $t('core.alert.subscriptions.trial.' + (isTrialExpiring ? 'titleExpiring' : 'title'), { trialDaysLeft })
          }}
        </strong>
        <strong v-else>
          {{ $t('core.alert.subscriptions.trial.expired') }}
        </strong>
        {{ $t('core.alert.subscriptions.trial.description') }}

        <router-link :to="{ name: 'billing-overview' }" class="uk-button uk-button-small --outline">
          {{ $t('core.alert.subscriptions.trial.button') }}
        </router-link>
      </core-alert>
    </template>

    <template #nav v-if="displayNav">
      <core-nav />
    </template>

    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import dayjs from '@/utils/dayjs';
import CoreLineLoading from '../components/CoreLineLoading.vue';
import CoreAlert from '../components/CoreAlert.vue';
import CoreNav from '../components/core-nav/CoreNav.vue';

export default {
  name: 'CoreDesktop',
  components: {
    CoreNav,
    CoreLineLoading,
    CoreAlert,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoading = ref(false);
    const displayNav = ref(true);

    const isTrialVersion = computed(() => store.state.account.account?.trialExpirationOn || undefined);
    const trialDaysLeft = computed(() => dayjs(isTrialVersion.value).diff(undefined, 'day'));

    const isTrialExpiring = computed(() => dayjs(isTrialVersion.value).diff(undefined, 'hours') < 24);
    const isTrialExpired = computed(() => dayjs(isTrialVersion.value).isBefore(dayjs()));

    router.beforeEach((route) => {
      displayNav.value = Boolean(route.meta.navbar);
      isLoading.value = true;
    });

    router.afterEach(() => {
      isLoading.value = false;
    });

    return {
      isLoading,
      displayNav,
      trialDaysLeft,
      isTrialVersion,
      isTrialExpiring,
      isTrialExpired,
    };
  },
};
</script>
