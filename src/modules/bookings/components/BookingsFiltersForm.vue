<template>
  <div class="filter-form">
    <core-form-date-range
      v-if="filterShown"
      class="uk-margin-bottom"
      :form-values="values"
      :errors="errors"
      :startDateValue="filters.startDate"
      :endDateValue="filters.endDate"
      :disable-past-days="false"
    />

    <div class="uk-margin-bottom">
      <label class="input-label">{{ $t('bookings.views.main.filters.property') }}</label>
      <div class="input-container">
        <core-form-tree-select
          name="propertyTree"
          :nodes="tree.dict"
          :value="tree.value"
          selection-mode="checkbox"
          @node-expand="onPropertyExpand"
        />
      </div>
    </div>

    <div class="uk-margin-bottom">
      <label class="input-label">{{ $t('bookings.views.main.filters.status') }}</label>
      <div class="input-container statuses-select">
        <core-form-select
          id="statuses"
          name="statuses"
          :class="{ '--invalid': errors.statuses }"
          :value="filters.statuses"
          :data="statuses"
          :multiple="true"
          :press-label="false"
        />
        <v-error-message class="input-error-message" name="statuses" />
      </div>
    </div>

    <div>
      <div class="uk-flex uk-flex-middle">
        <label class="input-label uk-margin-small-right price-label">
          {{ $t('bookings.views.main.filters.from') }}
        </label>
        <core-form-input-number
          name="priceMin"
          :value="filters.priceMin"
          :rules="'between:0,1000000000|max_value:' + (values.priceMax || 0)"
          :currency="defaultCurrency"
        />
        <label class="input-label uk-margin-small-left uk-margin-small-right price-label">
          {{ $t('bookings.views.main.filters.to') }}
        </label>
        <core-form-input-number
          name="priceMax"
          :value="filters.priceMax"
          :rules="'between:0,1000000000|min_value:' + (values.priceMin || 0)"
          :currency="defaultCurrency"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import CoreFormDateRange from '@/modules/core/components/core-form/CoreFormDateRange.vue';
import CoreFormTreeSelect from '@/modules/core/components/core-form/CoreFormTreeSelect.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import {
  BOOKING_STATUSES,
  BOOKINGS_FILTER_PROPERTIES,
  BOOKINGS_FILTER_PROPERTIES_UNITS,
  BOOKINGS_FILTER_PROPERTY_UNIT_TYPES,
} from '@/modules/bookings/services';
import { list as getUnitTypes } from '@/modules/rentals/services/rentalTypes';
import { list as getUnits } from '@/modules/rentals/services/units';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  name: 'BookingsFiltersForm',
  props: {
    values: Object,
    errors: Object,
    filterShown: Boolean,
  },
  components: {
    VErrorMessage: ErrorMessage,
    CoreFormDateRange,
    CoreFormTreeSelect,
    CoreFormSelect,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();

    const statuses = Object.values(BOOKING_STATUSES).map((status) => ({
      label: i18n.t(`bookings.dicts.statuses.${status}`),
      value: status,
    }));

    const defaultCurrency = computed(() => store.state.account.account.settings.currency);
    const filters = computed(() => store.state.bookings.filters);
    const tree = computed(() => store.state.bookings.rentalTree);

    const onPropertyExpand = (event) => {
      if (tree.value.cache[event.key]) return;

      store.commit('bookings/SET_RENTAL_TREE_CACHE', event.key);
      // eslint-disable-next-line no-param-reassign
      event.children = [];
      const [, id, subId] = event.key.split('_');

      if (event.data === BOOKINGS_FILTER_PROPERTIES) {
        getUnitTypes(id)
          .then(({ data }) => {
            // eslint-disable-next-line no-param-reassign
            event.children = data.map((rental) => ({
              key: `${BOOKINGS_FILTER_PROPERTY_UNIT_TYPES}_${rental.propertyId}_${rental.id}`,
              label: rental.name,
              data: BOOKINGS_FILTER_PROPERTY_UNIT_TYPES,
              children: [{}],
            }));
          });
      } else if (event.data === BOOKINGS_FILTER_PROPERTY_UNIT_TYPES) {
        getUnits(id, subId)
          .then(({ data }) => {
            // eslint-disable-next-line no-param-reassign
            event.children = data.map((rental) => ({
              key: `${BOOKINGS_FILTER_PROPERTIES_UNITS}_${rental.id}`,
              label: rental.name,
              data: BOOKINGS_FILTER_PROPERTIES_UNITS,
            }));
          });
      }
    };

    onMounted(() => {
      const treeDict = store.state.rentals.rentals.list.map((rental) => ({
        key: `${BOOKINGS_FILTER_PROPERTIES}_${rental.id}`,
        label: rental.name,
        data: BOOKINGS_FILTER_PROPERTIES,
        leaf: true,
        children: [{}],
      }));

      store.commit('bookings/SET_RENTAL_TREE_DICT', treeDict);
    });

    return {
      defaultCurrency,
      filters,
      statuses,
      tree,

      onPropertyExpand,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-form {
  padding: 20px;

  ::v-deep() .date-range {
    width: 100%;
  }
}
.price-label {
  white-space: nowrap;
}

.statuses-select ::v-deep() {

  .choices__inner {
    [data-value="confirmed"] {
      &.choices__item--selectable {
        background-color: $success-color;
        color: $color-white;
      }
    }

    [data-value="tentative"] {
      &.choices__item--selectable {
        background-color: $primary-color;
        color: $color-white;
      }
    }

    [data-value="canceled"] {
      &.choices__item--selectable {
        background-color: $error-color;
        color: $color-white;
      }
    }

    [data-value="declined"] {
      &.choices__item--selectable {
        background-color: $alt-color;
        color: $color-white;
      }
    }
  }

  .choices__list--dropdown {
    [data-value="draft"] {
      &.is-highlighted,
      &:hover {
        background-color: rgba($alt-color, 0.07) !important;
      }
    }

    [data-value="confirmed"] {
      color: $success-color;

      &.is-highlighted,
      &:hover {
        background-color: rgba($success-color, 0.07) !important;
      }
    }

    [data-value="tentative"] {
      color: $primary-color;

      &.is-highlighted,
      &:hover {
        background-color: rgba($primary-color, 0.07) !important;
      }
    }

    [data-value="canceled"] {
      color: $error-color;

      &.is-highlighted,
      &:hover {
        background-color: rgba($error-color, 0.07) !important;
      }
    }

    [data-value="declined"] {
      color: $alt-color;

      &.is-highlighted,
      &:hover {
        background-color: rgba($alt-color, 0.07) !important;
      }
    }
  }
}
</style>
