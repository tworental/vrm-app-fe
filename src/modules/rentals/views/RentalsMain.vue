<template>
  <core-layout-content :displayContent="!!rentals.length">
    <template #header>
      <core-layout-content-header :title="$t('rentals.views.main.title')" icon="properties">
        <div class="core-layout-header__actions uk-margin-auto-left">
          <button
            type="button"
            class="uk-button uk-button-primary uk-button--add"
            @click="onAddRental"
            v-e2e="'create-rental'"
            v-quota="{
              limits,
              name: LIMITS.APP_PROPERTIES_SIZE_LIMIT,
              value: rentals.length,
              label: $t('core.limits.quotaExceeded')
            }"
            v-can:properties.write="user"
          >
            <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
            {{ $t('rentals.views.main.addRental') }}
          </button>
        </div>
      </core-layout-content-header>
    </template>

    <template #placeholder>
      <core-placeholder
        image="rentals.svg"
        :title="$t('rentals.views.main.placeholder.title')"
        :label="$t('rentals.views.main.placeholder.label')"
        :description="$t('rentals.views.main.placeholder.description')"
      >
        <button
          class="uk-button uk-button-primary uk-button--add"
          @click="onAddRental"
          v-e2e="'create-rental'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          {{ $t('rentals.views.main.addRental') }}
        </button>
      </core-placeholder>
    </template>

    <template #default>
      <div class="card-list">
        <div class="card-list__item" v-for="(rental) in rentals" :key="rental.id" @click="showRental(rental.id)">
          <div class="uk-card uk-card-default card-grid-view">
            <div class="uk-card__figure">
              <core-image
                :src="rental.mainImage || ''"
                :gray-placeholder="true"
                :fallback="require('@/assets/images/placeholders/rentals.svg')"
              />

              <div uk-grid class="card-grid-view__actions">
                <div class="card-grid-view__badges">
                  <span class="uk-badge badge--primary" v-if="rental.isCompleted">
                    {{ $t('rentals.shared.completed') }}
                  </span>
                  <span class="uk-badge badge--light" v-else>
                    {{ $t('rentals.shared.notCompleted') }}
                  </span>
                </div>
                <div class="uk-inline uk-width-auto actions">
                  <button class="uk-button card-grid-view__btn-dropdown actions__btn" type="button" @click.stop>
                    <core-svg width="16" :src="require('@/assets/images/icons/nav-menu-horizontal.svg')" />
                  </button>
                  <div uk-dropdown="mode: click" class="dropdown">
                    <ul class="uk-dropdown-nav uk-nav-default">
                      <li class="uk-dropdown-close">
                        <router-link
                          :to="{ params: { id: rental.id } }"
                          class="uk-nav__link"
                          v-e2e="'edit-rental'"
                        >
                          <core-svg class="icon" width="16" :src="require('@/assets/images/icons/edit.svg')" />
                          <span>{{ $t('rentals.views.main.actions.edit') }}</span>
                        </router-link>
                      </li>
                      <li class="uk-dropdown-close">
                        <button
                          type="button"
                          @click.stop="deleteRental(rental.id)"
                          class="uk-nav__link uk-text-danger"
                          v-e2e="'delete-rental'"
                        >
                          <core-svg class="icon" width="16" :src="require('@/assets/images/icons/delete.svg')" />
                          <span>{{ $t('rentals.views.main.actions.delete') }}</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="uk-card-body">
              <p class="card-grid-view__overline">ID: {{ rental.id }}</p>
              <h3 class="uk-card-title">{{ rental.name }}</h3>

              <button
                type="button"
                class="uk-button uk-button-primary card-grid-view__btn"
                v-e2e="'view-rental'"
              >
                {{ $t('rentals.shared.view') }}
              </button>
            </div>
          </div>
          <div class="uk-overlay-default uk-position-cover" v-if="loading === rental.id">
            <div class="uk-position-center" uk-spinner></div>
          </div>
        </div>
      </div>
    </template>

    <template #footer></template>
  </core-layout-content>
  <rentals-create ref="modalRef" />
</template>

<script>
import {
  computed,
  ref,
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import { LIMITS } from '@/utils/acl';
import CoreImage from '@/modules/core/components/CoreImage.vue';
import { BOOKINGS_ATTACHED_ERROR } from '@/modules/rentals/services';
import RentalsCreate from './RentalsCreate.vue';

export default {
  components: {
    CoreImage,
    RentalsCreate,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const search = ref('');
    const modalRef = ref(null);
    const loading = ref(null);

    const user = computed(() => store.state.account.user);
    const limits = computed(() => store.state.core.limits);
    const rentals = computed(() => store.state.rentals.rentals.list.filter(
      (rental) => rental.name.toLowerCase().includes(search.value.toLowerCase()),
    ));

    const showRental = (id) => {
      loading.value = id;
      router.push({ name: 'rental-overview', params: { id } })
        .finally(() => { loading.value = null; });
    };

    const deleteRental = (id) => {
      uikit.dropdowns.closeAll();

      uikit.modals.deleteConfirm(i18n.t('rentals.views.main.deleteConfirm'))
        .then((dialog) => store.dispatch('rentals/rentals/deleteRental', id)
          .then(() => uikit.notify('success', i18n.t('rentals.views.main.deleteSuccess')))
          .finally(() => dialog.hide()))
        .catch((error) => {
          if (error) {
            if (error.code === BOOKINGS_ATTACHED_ERROR) {
              uikit.modals.warning(i18n.t('rentals.shared.deleteRentalBookingsError'));
            } else {
              uikit.notify('danger', error.message);
            }
          }
        });
    };

    const assignRental = () => {
      uikit.dropdowns.closeAll();
    };

    const onAddRental = () => uikit.modals.show(modalRef.value?.$el);

    return {
      LIMITS,
      user,
      limits,
      modalRef,
      search,
      rentals,
      loading,

      showRental,
      deleteRental,
      assignRental,
      onAddRental,
    };
  },
};
</script>

<style lang="scss" scoped>
  .card-list {
    --card-list-min-width: 16.1875em;
    --card-list-max-width: 16.1875em;
    padding: 5px 10px;
    justify-items: center;
    grid-gap: 0;
  }
  .actions {
    display: none;

    &__btn {
      background-color: transparent;

      ::v-deep() svg {
        fill: $color-white;
      }
    }
  }
  .card-list__item {
    position: relative;
    width: 13.625em;
    margin-bottom: 30px;

    .uk-card-title {
      min-height: 48px;
    }

    .card-grid-view {
      border: none;
    }

    &:hover {
      z-index: 2;

      .actions {
        display: block;
      }
    }
  }
  .uk-nav__link {
    text-decoration: none;

    span {
      padding-left: 4px;
    }
  }
  .dropdown {
    top: 25px !important;
  }
</style>
