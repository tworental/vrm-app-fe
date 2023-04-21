<template>
  <core-layout-content
    :displayContent="true"
    :headerHasMargins="false"
    class="billing-page"
  >
    <template #header>
      <core-layout-content-header :title="$t('billing.views.main.title')" icon="billing" />
    </template>
    <template #default>
      <div class="billing-page__main">
        <div class="uk-text-center content billing-content">
          <div>
            <h3 class="billing-content__heading">{{ $t('billing.views.main.heading') }}</h3>
          </div>
          <div>
            <div class="billing-content__control uk-margin-bottom">
              <div class="uk-margin-right billing-content__label">
                {{ $t('billing.views.main.chooseRentalsNumber') }}
              </div>

              <div class="slider-wrapper">
                <Slider
                  v-model="quantity"
                  :min="minQuantity"
                  :max="maxQuantity"
                  :step="5"
                />
                <span
                  class="tier-line"
                  v-for="tier in visibleTiers"
                  :key="tier.upTo"
                  :style="{ width: (100 * tier.upTo / maxQuantity) + '%' }"
                ></span>
              </div>
            </div>
            <div class="billing-content__control">
              <div class="uk-margin-right billing-content__label">
                {{ $t('billing.views.main.chooseBillingPeriod') }}
              </div>
              <billing-period-switcher v-model="interval" />
            </div>
          </div>
        </div>
        <div class="prices-wrapper uk-margin-bottom">
          <div class="plan-wrapper row-grid">
            <div class="plan --draft">
              <div class="plan__header">
                <div>
                  <h3 class="plan__title">
                    {{ $t('billing.views.main.chooseBestPlan') }}
                  </h3>
                </div>
                <p class="plan__description">
                  {{ $t('billing.views.main.bestPlanDescription') }}
                </p>
              </div>
            </div>
            <div
              class="plan"
              v-for="plan in plans"
              :key="plan.id"
              :class="{ '--recommended': plan.popular && !isPlanActive(plan) }"
            >
              <div class="plan__prefix" v-if="plan.popular && !isPlanActive(plan)">
                {{ $t('billing.views.main.recommended') }}
              </div>
              <div class="plan__header">
                <div class="uk-flex uk-flex-middle">
                  <h3 class="plan__title">
                    {{ $t('billing.dicts.plans.' + plan.metadata.packageName + '.title') }}
                  </h3>
                  <template v-if="isPlanActive(plan)">
                    <span
                      v-if="currentSubscription?.status === SUBSCRIPTION_STATUSES.ACTIVE"
                      class="uk-badge badge--success"
                    >
                      {{ $t('billing.views.main.currentPlan') }}
                    </span>
                    <span
                      v-else
                      class="uk-badge badge--danger"
                    >
                      {{ $t('billing.views.main.currentPlan') }}
                    </span>
                  </template>
                </div>
                <p class="plan__description">
                  {{ $t('billing.dicts.plans.' + plan.metadata.packageName + '.description') }}
                </p>
              </div>

              <strong class="plan__price">{{ formatCurrency(getPrice(plan), plan.currency) }}</strong>
              <div class="plan__meta">
                <small>
                  {{
                    interval === BILLING_PERIODS.MONTHLY
                      ? $t('billing.views.main.monthlyDescription')
                      : $t('billing.views.main.yearlyDescription')
                  }}
                </small>
              </div>
              <div class="uk-margin-small-top">
                <template v-if="!isPlanActive(plan)">
                  <button
                    v-if="!currentSubscription"
                    type="button"
                    class="uk-button uk-button-primary"
                    @click="goToCheckout(plan.id)"
                    v-e2e="'choose-plan'"
                  >
                    <div v-if="billingLoading === plan.id" uk-spinner="ratio: 0.5"></div>
                    {{ $t('billing.views.main.choosePlan') }}
                  </button>
                  <button
                    v-else
                    type="button"
                    class="uk-button uk-button-primary"
                    @click="updateSubscription(plan.id)"
                    v-e2e="'update-plan'"
                  >
                    <div v-if="billingLoading === plan.id" uk-spinner="ratio: 0.5"></div>
                    {{ $t('billing.views.main.' + (isUpgrade(plan) ? 'upgrade' : 'downgrade')) }}
                  </button>
                </template>
                <button
                  v-else-if="currentSubscription?.status === SUBSCRIPTION_STATUSES.ACTIVE"
                  type="button"
                  class="uk-button uk-button-success"
                  @click="goToBillingSystem(plan.id)"
                  v-e2e="'go-billing'"
                >
                  <div v-if="billingLoading === plan.id" uk-spinner="ratio: 0.5"></div>
                  {{ $t('billing.views.main.goBilling') }}
                </button>
                <button
                  v-else
                  type="button"
                  class="uk-button uk-button-danger"
                  @click="goToCheckout(plan.id)"
                  v-e2e="'pay'"
                >
                  <div v-if="billingLoading === plan.id" uk-spinner="ratio: 0.5"></div>
                  {{ $t('billing.views.main.pay') }}
                </button>
              </div>
            </div>
          </div>
          <ul uk-accordion="multiple: true" class="uk-margin-remove-vertical">
            <li
              class="plans-table uk-margin-remove-vertical"
              v-for="section in sections"
              :key="section.id"
              :class="{ 'uk-open': section.open }"
            >
              <div class="plans-table__title uk-accordion-title">
                <div>
                  {{ section.name }}
                </div>
                <div>
                  <core-svg
                    width="12"
                    class="arrow"
                    :src="require('@/assets/images/icons/arrow-down.svg')" />
                </div>
              </div>
              <div class="uk-accordion-content uk-margin-remove-vertical">
                <div class="row-grid plans-table__row" v-for="(cells, i) in section.children" :key="i">
                  <div
                    class="plans-table__cell"
                    v-for="(cell, j) in cells"
                    :key="j"
                    :class="{ '--recommended': (j > 0 && plans[j - 1].popular) && !isPlanActive(plans[j - 1]) }"
                  >
                    <template v-if="typeof cell === 'boolean'">
                    <span v-if="cell" class="uk-text-success">
                      <core-svg :width="16" :src="require('@/assets/images/icons/check-circle.svg')" />
                    </span>
                      <span v-else class="uk-text-danger">
                      <core-svg :width="16" :src="require('@/assets/images/icons/close-circle.svg')" />
                    </span>
                    </template>
                    <template v-else>{{ cell }}</template>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </core-layout-content>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { loadStripe } from '@stripe/stripe-js/pure';
import Slider from 'primevue/slider';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import { formatCurrency } from '@/utils/intl';
import BillingPeriodSwitcher from '@/modules/billing/components/BillingPeriodSwitcher.vue';
import { getFeatureSections } from '@/modules/billing/utils/serializer';
import {
  BILLING_PERIODS,
  SUBSCRIPTION_STATUSES,
  createBillingSession,
  createCheckoutSession, updateCurrentSubscription,
} from '../services';

let stripe;

export default {
  components: {
    Slider,
    BillingPeriodSwitcher,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();

    const billingLoading = ref(false);
    const quantity = ref(store.getters['billing/currentSubscription']?.quantity || 5);
    const minQuantity = ref(5);
    const maxQuantity = ref(300);
    const interval = ref(store.getters['billing/currentSubscription']?.interval || BILLING_PERIODS.MONTHLY);

    const config = computed(() => store.state.core.config.payments);
    const subscriptions = computed(() => store.state.billing.subscriptions);
    const currentSubscription = computed(() => store.getters['billing/currentSubscription']);

    const plans = computed(() => store.state.billing.plans
      .filter((item) => item.interval === interval.value)
      .sort((a, b) => a.metadata.packageId - b.metadata.packageId));

    const visibleTiers = computed(() => (plans.value[0]?.tiers || []).filter(({ upTo }) => Boolean(upTo)));

    const sections = computed(() => getFeatureSections(plans.value));

    const isPlanActive = (plan) => currentSubscription.value?.stripeProductId === plan.productId;

    const goToBillingSystem = (id) => {
      billingLoading.value = id;

      return createBillingSession()
        .then(({ data }) => { window.top.location.href = data.url; })
        .catch((error) => error && uikit.notify('danger', error.message))
        .finally(() => { billingLoading.value = null; });
    };

    const goToCheckout = (id) => {
      billingLoading.value = id;

      return createCheckoutSession([{ id, quantity: quantity.value }])
        .then(({ data }) => stripe.redirectToCheckout({ sessionId: data.id }))
        .catch((error) => error && uikit.notify('danger', error.message))
        .finally(() => { billingLoading.value = null; });
    };

    const updateSubscription = (price) => {
      billingLoading.value = price;

      return updateCurrentSubscription(currentSubscription.value?.id, {
        quantity: quantity.value,
        price,
      })
        .then(() => {
          uikit.notify('success', i18n.t('billing.views.main.updateSubscriptionSuccess'));

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {
          if (error) uikit.notify('danger', error.message);
          billingLoading.value = null;
        });
    };

    const getPrice = (plan) => plan.tiers
      .find((tier) => tier.upTo >= quantity.value || tier.upTo === null)
      ?.unitAmount / 100 || 0;

    const isUpgrade = (plan) => {
      const planIndex = plans.value.findIndex((item) => item.id === plan.id);
      const currentIndex = plans.value.findIndex((item) => item.id === currentSubscription.value?.stripePriceId);

      return currentIndex < planIndex;
    };

    onMounted(async () => {
      stripe = await loadStripe(config.value.stripePublicKey, {
        apiVersion: config.value.apiVersion,
      });
    });

    return {
      BILLING_PERIODS,
      SUBSCRIPTION_STATUSES,
      sections,
      plans,
      subscriptions,
      currentSubscription,
      billingLoading,
      interval,
      quantity,
      minQuantity,
      maxQuantity,
      visibleTiers,

      isPlanActive,
      goToCheckout,
      goToBillingSystem,
      getPrice,
      formatCurrency,
      updateSubscription,
      isUpgrade,
    };
  },
};
</script>

<style lang="scss" scoped>
.prices-wrapper {
  margin-top: 36px;
  border-top: 1px solid rgba($alt-color, 0.2);
  border-left: 1px solid rgba($alt-color, 0.2);
  border-right: 1px solid rgba($alt-color, 0.2);
}
.plan-wrapper {
  border-bottom: 1px solid rgba($alt-color, 0.2);
}
.row-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.plan {
  position: relative;
  padding: 16px;
  background-color: $color-white;
  border-right: 1px solid rgba($alt-color, 0.15);

  &:last-child {
    border-right: none;
  }

  &.--draft {
    padding-right: 40px;

    .plan__title {
      font-size: 1rem;
      color: inherit;
    }
  }

  &.--recommended {
    box-shadow: 0 6px 30px 0 rgba($alt-color, 0.2);
    z-index: 1;

    .plan__title {
      color: $primary-color;
    }
  }

  &__prefix {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    padding: 2px 6px;
    background-color: $primary-color;
    color: $color-white;
    text-align: center;
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
  }
  &__header {
    min-height: 80px;

    .uk-badge {
      margin-left: 10px;
      margin-bottom: 5px;
    }
  }
  &__title {
    font-size: 1.25rem;
    margin: 0 0 5px;
    font-weight: 700;
  }
  &__description {
    font-size: 0.75rem;
    margin: 0;
    color: rgba($base-color-darken, 0.7);
  }
  &__price {
    display: block;
    font-size: 1.5rem;
  }
  &__meta {
    margin-bottom: 20px;
    line-height: 1rem;
    color: rgba($base-color-darken, 0.7);

    small {
      font-size: 65%;
    }
  }
}
.plans-table {
  .arrow {
    transition: transform 0.15s linear;
  }

  &.uk-open .arrow {
    transform: rotateZ(180deg);
  }

  .plans-table__row:first-child {
    .plans-table__cell {
      border-top: none;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    font-size: 0.875rem;
    font-weight: 500;
    color: $base-color-darken;
    background-color: #eef1f7;
    border-bottom: 1px solid rgba($alt-color, 0.15);
    cursor: pointer;
  }
  &__cell {
    background-color: $color-white;
    padding: 8px 16px;
    border-top: 1px solid rgba($alt-color, 0.15);
    border-right: 1px solid rgba($alt-color, 0.15);
    font-size: 0.875rem;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;

    &:not(:first-child) {
      text-align: center;
    }

    &:last-child {
      border-right: none;
    }

    &.--recommended {
      position: relative;
      overflow: inherit;

      &::before {
        box-shadow: inset -12px 0 12px -8px rgba($alt-color, 0.1);
        content: " ";
        height: 100%;
        left: -25px;
        position: absolute;
        top: 0;
        width: 25px;
      }

      &::after {
        box-shadow: inset 12px 0 12px -8px rgba($alt-color, 0.1);
        content: " ";
        height: 100%;
        position: absolute;
        top: 0;
        right: -25px;
        width: 25px;
      }
    }
  }
  &__row {
    &:last-child {
      .plans-table {
        &__cell {
          border-bottom: 1px solid rgba($alt-color, 0.15);
        }
      }
    }
  }
}
.slider-wrapper {
  min-width: 292px;
  position: relative;

  .tier-line {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    border-right: 2px solid $color-white;
    z-index: 1;
    pointer-events: none;
  }
}
.billing-page {
  &__main {
    max-width: 1000px;
    margin: 0 30px;
    min-width: 680px;
    overflow-x: auto;
  }
}
.billing-content {
  padding-top: 30px;
  padding-bottom: 40px;
  background-color: $color-white;
  border: 1px solid rgba($alt-color, 0.2);

  &__heading {
    font-weight: 700;
    margin-bottom: 50px;
  }

  &__control {
    display: flex;
    align-items: center;
    width: 550px;
    margin: 0 auto;
  }

  &__label {
    font-size: 0.75rem;
    width: 190px;
    text-align: right;
  }
}
</style>
