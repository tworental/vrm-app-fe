<template>
  <core-layout-content :displayContent="true" class="booking-form-services booking-form">
    <template #default>
      <div>
        <ul uk-accordion>
          <li class="panel uk-open">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/cog-hand.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">
                    {{
                      $t('bookings.components.bookingFormServices.services', {
                        count: services.length
                       })
                    }}
                  </h3>
                </div>
              </div>

              <div class="uk-flex uk-flex-middle">
                <h5 class="--total --total-header uk-flex-1 uk-margin-right" v-if="services.length > 0">
                  {{ formatCurrency(totalServices, booking.currency || defaultCurrency) }}
                </h5>
                <core-svg
                  width="12"
                  class="arrow"
                  :src="require('@/assets/images/icons/arrow-down.svg')" />
              </div>
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <div>
                <bookings-booking-service-item
                  v-for="(service, idx) in services"
                  :service="service"
                  :idx="idx"
                  :key="service.id"
                  @delete="$emit('update')"
                />
                <footer class="total-footer">
                  <button
                    type="button"
                    class="uk-button uk-button-link uk-button--add uk-padding-remove"
                    v-e2e="'add-service'"
                    @click="isServiceFormVisible = true"
                  >
                    <core-svg
                      :width="17"
                      :src="require('@/assets/images/icons/add.svg')"
                    />
                    <span>{{ $t('bookings.components.bookingFormServices.addService') }}</span>
                  </button>
                </footer>
              </div>
            </div>
          </li>
          <li class="panel">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/taxes.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">
                    {{
                      $t('bookings.components.bookingFormServices.taxes', {
                        count: taxes.length
                      })
                    }}
                  </h3>
                </div>
              </div>

              <div class="uk-flex uk-flex-middle">
                <h5 class="--total --total-header uk-flex-1 uk-margin-right" v-if="taxes.length > 0">
                  {{ formatCurrency(totalTaxes, booking.currency || defaultCurrency) }}
                </h5>
                <core-svg
                  width="12"
                  class="arrow"
                  :src="require('@/assets/images/icons/arrow-down.svg')" />
              </div>
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <div>
                <bookings-booking-tax-item
                  v-for="(tax, idx) in taxes"
                  :tax="tax"
                  :idx="idx"
                  :key="tax.id"
                  @edit="onEditTax"
                  @delete="$emit('update')"
                />
                <footer class="total-footer uk-flex uk-flex-middle uk-flex-between">
                  <button
                    type="button"
                    class="uk-button uk-button-link uk-button--add uk-padding-remove"
                    v-e2e="'add-tax'"
                    @click="isTaxFormVisible = true"
                  >
                    <core-svg
                      :width="17"
                      :src="require('@/assets/images/icons/add.svg')"
                    />
                    <span>{{ $t('bookings.components.bookingFormServices.addTax') }}</span>
                  </button>
                </footer>
              </div>
            </div>
          </li>
          <li class="panel">
            <div class="uk-accordion-title panel__header">
              <div>
                <div class="uk-flex uk-flex-middle">
                  <core-svg
                    :width="20"
                    :src="require('@/assets/images/icons/cash-network.svg')"
                  />
                  <h3 class="panel__title uk-margin-small-left">
                    {{
                      $t('bookings.components.bookingFormServices.fees', {
                        count: fees.length
                      })
                    }}
                  </h3>
                </div>
              </div>

              <div class="uk-flex uk-flex-middle">
                <h5 class="--total --total-header uk-flex-1 uk-margin-right" v-if="fees.length > 0">
                  {{ formatCurrency(totalFees, booking.currency || defaultCurrency) }}
                </h5>
                <core-svg
                  width="12"
                  class="arrow"
                  :src="require('@/assets/images/icons/arrow-down.svg')" />
              </div>
            </div>
            <div class="uk-accordion-content panel__content uk-margin-remove">
              <div>
                <bookings-booking-fee-item
                  v-for="(fee, idx) in fees"
                  :fee="fee"
                  :idx="idx"
                  :key="fee.id"
                  @edit="onEditFee"
                  @delete="$emit('update')"
                />
                <footer class="total-footer uk-flex uk-flex-middle uk-flex-between">
                  <button
                    type="button"
                    class="uk-button uk-button-link uk-button--add uk-padding-remove"
                    v-e2e="'add-fee'"
                    @click="isFeeFormVisible = true"
                  >
                    <core-svg
                      :width="17"
                      :src="require('@/assets/images/icons/add.svg')"
                    />
                    <span>{{ $t('bookings.components.bookingFormServices.addFee') }}</span>
                  </button>
                </footer>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <Sidebar
        v-model:visible="isServiceFormVisible"
        position="bottom"
        class="drawer-bottom-sidebar bookings-sidebar"
        @hide="clearExtrasEntity()"
      >
        <bookings-booking-service-form
          :booking-id="bookingId"
          :property-id="booking.propertyId"
          @close="isServiceFormVisible = false"
          @save="$emit('update')"
        />
      </Sidebar>
      <Sidebar
        v-model:visible="isTaxFormVisible"
        position="bottom"
        class="drawer-bottom-sidebar bookings-sidebar"
        @hide="clearExtrasEntity()"
      >
        <bookings-booking-tax-form
          :booking-id="bookingId"
          @close="isTaxFormVisible = false"
          @save="$emit('update')"
        />
      </Sidebar>
      <Sidebar
        v-model:visible="isFeeFormVisible"
        position="bottom"
        class="drawer-bottom-sidebar bookings-sidebar"
        @hide="clearExtrasEntity()"
      >
        <bookings-booking-fee-form
          :booking-id="bookingId"
          @close="isFeeFormVisible = false"
          @save="$emit('update')"
        />
      </Sidebar>
    </template>
    <template #footer>
      <div class="booking-footer">
        <h5 class="--total --footer">
          {{
            $t('bookings.components.bookingFormServices.total', {
              num: formatCurrency(total, booking.currency || defaultCurrency)
            })
          }}
        </h5>
      </div>
      <div class="booking-footer">
        <button
          type="button"
          class="uk-button uk-button-link uk-margin-right"
          v-e2e="'cancel-booking'"
          @click="onClose"
        >
          {{ $t('bookings.views.bookingForm.cancel') }}
        </button>
        <button
          v-e2e
          type="submit"
          class="uk-button uk-button-success"
          @click="onClose"
        >
          {{ $t('bookings.shared.' + (isLastStep ? 'saveAndClose' : 'saveAndNext')) }}
        </button>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import Sidebar from 'primevue/sidebar';

import useKit from '@/modules/core/composables/uikit';
import { formatCurrency } from '@/utils/intl';
import BookingsBookingServiceItem from './extras/BookingsBookingServiceItem.vue';
import BookingsBookingTaxItem from './extras/BookingsBookingTaxItem.vue';
import BookingsBookingFeeItem from './extras/BookingsBookingFeeItem.vue';
import BookingsBookingServiceForm from './extras/BookingsBookingServiceForm.vue';
import BookingsBookingTaxForm from './extras/BookingsBookingTaxForm.vue';
import BookingsBookingFeeForm from './extras/BookingsBookingFeeForm.vue';

export default {
  name: 'BookingsBookingFormServices',
  components: {
    Sidebar,
    BookingsBookingServiceItem,
    BookingsBookingServiceForm,
    BookingsBookingTaxForm,
    BookingsBookingFeeForm,
    BookingsBookingTaxItem,
    BookingsBookingFeeItem,
  },
  props: {
    bookingId: Number,
    isLastStep: Boolean,
  },
  emits: ['next', 'update'],
  setup(props) {
    const store = useStore();
    const uikit = useKit();

    const isServiceFormVisible = ref(false);
    const isTaxFormVisible = ref(false);
    const isFeeFormVisible = ref(false);

    const booking = computed(() => store.state.bookings.entity);
    const defaultCurrency = computed(() => store.state.account.account.settings.currency);

    const services = computed(() => store.getters['bookings/extras/services']);
    const taxes = computed(() => store.getters['bookings/extras/taxes']);
    const fees = computed(() => store.getters['bookings/extras/fees']);

    const totalServices = computed(() => store.getters['bookings/extras/totalServices']);
    const totalTaxes = computed(() => store.getters['bookings/extras/totalTaxes']);
    const totalFees = computed(() => store.getters['bookings/extras/totalFees']);

    const total = computed(() => store.getters['bookings/extras/total']);

    const onEditTax = (id) => {
      store.dispatch('bookings/extras/setEntity', {
        id,
        bookingId: booking.value.id,
      }).then(() => { isTaxFormVisible.value = true; });
    };

    const onEditFee = (id) => {
      store.dispatch('bookings/extras/setEntity', {
        id,
        bookingId: booking.value.id,
      }).then(() => { isFeeFormVisible.value = true; });
    };

    const clearExtrasEntity = () => {
      store.commit('bookings/extras/SET_ENTITY');
    };

    const onClose = () => uikit.drawer.hide();

    onMounted(() => {
      store.dispatch('bookings/extras/setList', { bookingId: props.bookingId });
    });

    return {
      isServiceFormVisible,
      isTaxFormVisible,
      isFeeFormVisible,
      booking,
      defaultCurrency,
      services,
      taxes,
      fees,
      totalServices,
      totalTaxes,
      totalFees,
      total,

      formatCurrency,
      onEditTax,
      onEditFee,
      clearExtrasEntity,
      onClose,
    };
  },
};
</script>
