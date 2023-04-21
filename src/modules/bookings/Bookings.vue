<template>
  <core-layout class="bookings-layout" :has-nav="true">
    <template #nav v-if="rentals.length > 0">
      <v-form
        class="navbar navbar--page uk-navbar-container vertical uk-navbar uk-navbar-transparent --booking"
        name="bookings-filter"
        v-e2e
        v-slot="{ values, errors }"
        @submit="onSubmit"
      >
        <core-layout-content :isLoading="loading">
          <template #header>
            <template v-if="filterMode">
              <div class="bookings-layout__header">
                <core-layout-content-header
                  :title="$t('bookings.views.main.title')"
                  icon="bookings"
                />
              </div>
            </template>
            <template v-else>
              <div class="bookings-layout__header">
                <core-layout-content-header
                  :title="$t('bookings.views.main.title')"
                  icon="bookings"
                />
                <bookings-filters-badges @click="filterMode = true" />
              </div>
            </template>
          </template>
          <template #default>
            <div v-show="!filterMode" :class="{ 'no-bookings': bookings.length === 0 }">
              <router-link
                v-for="booking in bookings"
                :key="booking.id"
                class="no-decoration booking"
                :to="{ name: 'bookings-overview', params: { id: booking.id } }"
                v-slot="{ isActive }"
              >
                <bookings-booking-item
                  :booking="booking"
                  :active="isActive"
                />
              </router-link>

              <core-placeholder
                v-if="bookings.length === 0"
                image="bookings.svg"
                :title="$t('bookings.views.main.placeholder.title')"
                :description="$t('bookings.views.main.placeholder.description')"
                :small="true"
              />
            </div>
            <div v-show="filterMode">
              <bookings-filters-form
                :values="values"
                :errors="errors"
                :filter-shown="filterMode"
              />
            </div>
          </template>
          <template #footer>
            <div v-if="filterMode" class="filter-form" ref="footerRef">
              <div class="uk-text-right">
                <button
                  type="button"
                  class="uk-button uk-button-link uk-margin-right"
                  @click="filterMode = false"
                  v-e2e="'filter-close'"
                >
                  {{ $t('bookings.views.main.filters.cancel') }}
                </button>
                <button
                  class="uk-button uk-button-success"
                  v-e2e="'filter-apply'"
                >
                  {{ $t('bookings.views.main.filters.apply') }}
                </button>
              </div>
            </div>
            <template v-else>
              <div class="bookings-sidebar__footer" ref="footerRef">
                <div>
                  <button
                    type="button"
                    @click="$router.push({ name: 'bookings-create' })"
                    class="uk-button uk-button-primary uk-button--add uk-width-1-1"
                    :disabled="!canUserEditBookings"
                  >
                    <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
                    {{ $t('bookings.views.main.create') }}
                  </button>
                </div>
              </div>
            </template>
          </template>
        </core-layout-content>
      </v-form>
    </template>
    <template #default>
      <router-view />
    </template>
  </core-layout>
  <core-drawer
    ref="drawerRef"
    :loading="formLoading"
    class="bookings-drawer"
  >
    <component :is="drawerComponent"></component>
  </core-drawer>
</template>

<script>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watchEffect,
} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { Form } from 'vee-validate';

import errorHandler from '@/utils/errorHandler';
import useKit from '@/modules/core/composables/uikit';
import CoreDrawer from '@/modules/core/components/core-drawer/CoreDrawer.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormDateRange from '@/modules/core/components/core-form/CoreFormDateRange.vue';
import BookingsBookingItem from '@/modules/bookings/components/BookingsBookingItem.vue';
import BookingsBookingForm from '@/modules/bookings/views/BookingsBookingForm.vue';
import BookingsFiltersBadges from '@/modules/bookings/components/BookingsFiltersBadges.vue';
import CoreFormTreeSelect from '@/modules/core/components/core-form/CoreFormTreeSelect.vue';
import BookingsFiltersForm from '@/modules/bookings/components/BookingsFiltersForm.vue';
import { getArraysFromTree } from '@/modules/bookings/utils/filters';
import { ABILITIES, can, MODULES } from '@/utils/acl';

export default {
  components: {
    VForm: Form,
    BookingsFiltersForm,
    CoreFormTreeSelect,
    CoreDrawer,
    CoreFormSelect,
    CoreFormDateRange,
    BookingsBookingItem,
    BookingsFiltersBadges,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();
    const router = useRouter();

    const drawerRef = ref(null);
    const scrollRef = ref(null);
    const footerRef = ref(null);
    const filterMode = ref(false);
    const drawerShown = ref(false);

    const formLoading = computed(() => store.state.bookings.formLoading);
    const rentals = computed(() => store.state.rentals.rentals.list);
    const bookings = computed(() => store.state.bookings.list);
    const loading = computed(() => store.state.bookings.loading);
    const canLoadMore = computed(() => store.getters['bookings/canLoadMore']);
    const user = computed(() => store.state.account.user);
    const canUserEditBookings = computed(() => can(user.value, MODULES.BOOKINGS, [ABILITIES.WRITE]));

    const components = {
      'bookings-create': BookingsBookingForm,
      'bookings-overview-edit': BookingsBookingForm,
    };

    const drawerComponent = computed(() => components[route.name]);

    const getScrollRef = () => document.querySelector('.bookings-layout .core-layout-content__main');

    watchEffect(() => {
      uikit.drawer.toggle(drawerRef.value.$el, !!route.meta.drawer);
    }, { flush: 'post' });

    const handleScroll = () => {
      const fullHeight = scrollRef.value.children[0].getBoundingClientRect().bottom
        + (footerRef.value?.clientHeight || 0);

      if (fullHeight < window.innerHeight && canLoadMore.value) {
        store.dispatch('bookings/loadMore');
      }
    };

    onMounted(() => {
      store.commit('bookings/SET_LOADING', true);

      Promise.all([
        store.dispatch('rentals/rentals/setRentals'),
        store.dispatch('bookings/setList'),
      ])
        .then(() => store.commit('bookings/SET_LOADING', false))
        .catch((error) => router.push(errorHandler(error)));

      scrollRef.value = getScrollRef();
      scrollRef.value.addEventListener('scroll', handleScroll);

      uikit.util.on(drawerRef.value?.$el, 'beforeshow', () => {
        drawerShown.value = true;
      }, { self: true });

      uikit.util.on(drawerRef.value?.$el, 'hidden', () => {
        drawerShown.value = false;
      }, { self: true });

      uikit.util.on(drawerRef.value?.$el, 'hide', () => {
        if (route.params.id) {
          router.push({ name: 'bookings-overview', params: { id: route.params.id } });
        } else {
          router.push({ name: 'bookings' });
        }
      }, { self: true });
    });

    onUnmounted(() => {
      scrollRef.value.removeEventListener('scroll', handleScroll);
    });

    const onSubmit = (payload) => {
      const { propertyTree, ...values } = payload;

      store.commit('bookings/SET_RENTAL_TREE_VALUE', propertyTree);

      store.commit('bookings/SET_FILTERS', {
        ...values,
        ...getArraysFromTree(propertyTree || {}),
      });

      store.dispatch('bookings/setList')
        .then(() => { filterMode.value = false; })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      BookingsBookingForm,
      drawerRef,
      drawerComponent,
      formLoading,
      rentals,
      bookings,
      footerRef,
      loading,
      filterMode,
      drawerShown,
      canUserEditBookings,

      onSubmit,
    };
  },
};
</script>

<style lang="scss" scoped>
.no-decoration {
  text-decoration: none;
}
.bookings-layout ::v-deep() {
  .core-skeleton__nav {
    overflow-y: auto;
  }
  .navbar .core-layout-content__header {
    margin-bottom: 0;
  }
  .bookings-layout__header {
    border-bottom: 1px solid rgba($base-color-darken, 0.1);
    padding: 10px 12px;

    .core-layout-content-header {
      min-height: 40px;
      padding: 0;
    }
  }
}
.bookings-sidebar__footer {
  padding: 20px;
  border-top: 1px solid rgba($base-color-darken, 0.1);
}
.booking {
  &:last-child {
    ::v-deep() > * {
      border-bottom: none;
    }
  }
}
.--booking {
  padding: 0;
  height: 100%;
  --navbar-width: 320px;
}
.filter-form {
  padding: 20px;
}
.no-bookings {
  height: 100%;
  align-items: center;
  display: flex;
  justify-content: center;
}
</style>
