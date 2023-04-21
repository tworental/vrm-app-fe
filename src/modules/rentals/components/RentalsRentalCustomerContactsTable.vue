<template>
  <div class="card">
    <div class="card__header">
      <div>
        <div class="card__heading uk-flex uk-flex-middle">
          <span class="uk-margin-small-right">
            <core-svg
              :width="24"
              :src="require('@/assets/images/icons/house-person.svg')"
            />
          </span>
          <h5 class="card__title">{{ $t('rentals.components.customerContacts.title') }}</h5>
        </div>
        <p class="card__description">
          {{ $t('rentals.components.customerContacts.description') }}
        </p>
      </div>
      <div class="uk-flex uk-flex-top uk-flex-right search__wrapper">
        <core-form-select
          v-can:properties.write="user"
          name="customerContact"
          :data="dict"
          :placeholder="$t('rentals.components.customerContacts.search')"
          class="search uk-width-1-1"
          :search="true"
          :value="customerContactToAttach"
          @change="onAttach($route.params.id, $event)"
        />
        <button
          v-can:properties.write="user"
          type="button"
          class="uk-button uk-button-primary uk-button--add-from-tablet"
          @click="$router.push({ name: 'settings-customer-contacts-create' })"
          v-e2e="'create'"
        >
          <core-svg width="16" :src="require('@/assets/images/icons/add.svg')" />
          <span class="--from-tablet">{{ $t('rentals.components.customerContacts.create') }}</span>
        </button>
      </div>
    </div>
    <div class="uk-overflow-auto">
      <table class="uk-table uk-table-divider table uk-margin-remove uk-text-nowrap">
        <thead>
          <tr>
            <th class="table__heading --filled --bordered">
              {{ $t('rentals.components.customerContacts.name') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('rentals.components.customerContacts.email') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('rentals.components.customerContacts.phoneNumber') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('rentals.components.customerContacts.isDefault') }}
            </th>
            <th class="table__heading --filled --bordered">
              {{ $t('rentals.components.customerContacts.bio') }}
            </th>
            <th class="table__heading table__heading--actions --filled --bordered">
              {{ $t('rentals.components.customerContacts.action') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="(item) in contacts" :key="item.id">
            <td class="table__cell">
              <div class="uk-flex uk-flex-middle">
                <core-avatar
                  :size="30"
                  class="uk-margin-small-right"
                  :username="item.firstName || item.email"
                  :src="item.avatar"
                />
                <div class="uk-text-nowrap">
                  {{ item.firstName }} {{ item.lastName }}
                </div>
              </div>
            </td>
            <td class="table__cell">
              {{ item.email }}
            </td>
            <td class="table__cell">
              <div>{{ item.primaryPhoneNumber }}</div>
              <small
                v-if="item.additionalPhoneNumber"
                class="meta-info"
              >{{ item.additionalPhoneNumber }}</small>
            </td>
            <td class="table__cell">
              <span class="uk-badge badge--success" v-if="item.isDefault">
                {{ $t('rentals.components.customerContacts.default') }}
              </span>
            </td>
            <td class="table__cell">
              <div class="meta-info">
                {{ item.bio }}
              </div>
            </td>
            <td class="table__cell table__cell--actions" :class="{ '--loading': loading === item.id }">
              <div class="actions">
                <template v-if="actionVisible === item.id">
                  <button
                    v-can:properties.delete="user"
                    @click="onDelete($route.params.id, item.id)"
                    v-e2e="'delete'"
                    :uk-tooltip="'title: ' + $t('rentals.components.customerContacts.delete')"
                    class="uk-button uk-button-danger --icon table__action-btn animated-icon"
                  >
                    <core-svg :width="24" :src="require('@/assets/images/icons/delete.svg')" />
                  </button>
                </template>
                <button
                  v-else
                  v-can:properties.delete="user"
                  v-e2e="'actions'"
                  @click="actionVisible = item.id"
                  class="uk-button --icon table__action-dots"
                >
                  <core-svg :width="24" :src="require('@/assets/images/icons/dots.svg')" />
                </button>
                <div v-if="loading === item.id" class="loader table__action-loader" uk-spinner></div>
              </div>
            </td>
          </tr>
        </tbody>
        <tfoot v-if="!contacts.length">
          <tr class="table__row --footer">
            <td colspan="7" class="table__no-data">
              {{ $t('rentals.components.customerContacts.noInfo') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';

export default {
  components: {
    CoreFormSelect,
  },
  setup() {
    const i18n = useI18n();
    const uikit = useKit();
    const store = useStore();

    const actionVisible = ref(null);
    const loading = ref(null);
    const modalRef = ref(null);
    const customerContactToAttach = ref(null);

    const contacts = computed(() => store.state.rentals.customerContacts.list);
    const dict = computed(
      () => store.state.settings.customerContacts.list
        .filter((contact) => !contacts.value.map(({ customerContactId }) => customerContactId).includes(contact.id))
        .map((contact) => ({
          label: `${contact.firstName} ${contact.lastName}`,
          value: contact.id,
        })),
    );
    const user = computed(() => store.state.account.user);

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.components.customerContacts.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/customerContacts/delete', { propertyId, id })
        .then(() => store.dispatch('rentals/customerContacts/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.customerContacts.deleteSuccess')))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onAttach = (propertyId, event) => {
      if (!event.target.value) return;

      customerContactToAttach.value = event.target.value;

      store.dispatch('rentals/customerContacts/create', { propertyId, customerContactId: customerContactToAttach.value })
        .then(() => store.dispatch('rentals/customerContacts/setList', propertyId))
        .then(() => uikit.notify('success', i18n.t('rentals.components.customerContacts.attachSuccess')))
        .then(() => { customerContactToAttach.value = null; })
        .catch((error) => error && uikit.notify('danger', error.message));
    };

    return {
      contacts,
      dict,
      actionVisible,
      loading,
      modalRef,
      customerContactToAttach,
      user,

      onDelete,
      onAttach,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;

  &__header {
    padding: 20px;

    @include mediaFrom(760px) {
      display: flex;
      justify-content: space-between;
    }
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
.table {
  margin: -20px;

  &__row {
    height: 75px;

    &:last-child {
      border-bottom: none !important;
    }
  }

  &__heading {
    padding-top: 10px;
    padding-bottom: 10px;

    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }

  &__heading,
  &__cell {
    &:first-child {
      padding-left: 20px;
    }
    &:last-child {
      padding-right: 20px;
    }
  }
}
.actions {
  width: 100px;
}
.no-border {
  border: none !important;
}
.uk-button-primary {
  min-width: auto;
  white-space: nowrap;

  @include mediaTo(760px) {
    position: absolute;
    top: 20px;
    right: 20px;
    padding-left: 12px;
    padding-right: 12px;

    ::v-deep() svg {
      margin-right: 0;
    }
  }
}
.search {
  margin-top: 20px;

  @include mediaFrom(760px) {
    margin-top: 0;
    margin-right: 20px;
    max-width: 320px;

    &__wrapper {
      width: 60%;
    }
  }
}
.provider-column {
  padding-left: 40px;
}
.--name-col {
  width: 18%;
}
.--name {
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
