<template>
  <core-layout :has-nav="true">
    <template #nav>
      <div class="onboarding-nav">
        <router-link class="logo-link" to="/" v-e2e="'logo'">
          <core-svg width="32" class="logo --no-stroke" :src="require('@/assets/images/logo.svg')" />
          <span class="logo__text --from-tablet">{{ $t('onboarding.shared.logo') }}</span>
        </router-link>

        <nav class="onboarding-nav__steps">
          <ul class="onboarding-nav__steps-list">
            <li v-for="(item, idx) in steps" :key="item.id">
              <onboarding-step
                :done="isDone(item.key)"
                :active="item.key === step?.key"
                :step="item.id"
                :lang-key="item.key"
                @click="selectStep(idx, item.key)"
              />
            </li>
          </ul>
        </nav>
      </div>
    </template>
    <core-layout-content :displayContent="true">
      <template #default>
        <div class="onboarding__wrapper">
          <router-link class="uk-button uk-button-text onboarding__close" to="/" tag="button" v-e2e="'logo'">
            <core-svg width="24" :src="require('@/assets/images/icons/close.svg')" />
          </router-link>
          <div class="onboarding__content">
            <h1 class="onboarding__heading">{{ $t('onboarding.shared.title') }}</h1>
            <p class="onboarding__description">
              {{ $t('onboarding.shared.description') }}
            </p>
            <h2 class="onboarding__progress">{{ setupPercentage }}%</h2>
            <progress
              class="uk-progress uk-margin-remove onboarding__progress-bar"
              :value="setupPercentage"
              max="100"
            ></progress>

            <div class="onboarding__current-step" v-if="step">
              {{ stepNo }}. {{ $t('onboarding.dicts.' + step?.key + '.title') }}
            </div>

            <div>
              <onboarding-item
                v-for="(item, index) in step?.children"
                :key="index"
                :lang-key="`${step.key}.${item}`"
                :completed="confirmed[step.key][item]"
              />
            </div>
          </div>
        </div>
      </template>
    </core-layout-content>
  </core-layout>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

import OnboardingItem from '../components/OnboardingItem.vue';
import OnboardingStep from '../components/OnboardingStep.vue';

export default {
  components: { OnboardingStep, OnboardingItem },
  setup() {
    const store = useStore();

    const setupPercentage = computed(() => store.state.account.setupPercentage);
    const steps = computed(() => store.getters['onboarding/steps']);
    const step = computed(() => store.state.onboarding.step);
    const stepNo = computed(() => store.state.onboarding.stepIdx + 1);
    const confirmed = computed(() => store.state.account.setupProgress);

    const isDone = (key) => Object.values(store.state.account.setupProgress[key])
      .every((value) => value);

    const selectStep = (idx, key) => {
      store.commit('onboarding/SET_STEP_IDX', idx);
      store.commit('onboarding/SET_CURRENT_STEP', key);
    };

    return {
      stepNo,
      setupPercentage,
      selectStep,
      steps,
      step,
      confirmed,
      isDone,
    };
  },
};
</script>

<style lang="scss">
  @include fromTablet {
    .onboarding {
      &-nav {
        padding: 40px 4vw;
        height: 100%;
        background-color: $color-white;
        border-right: 1px solid rgba($base-color-darken, 0.15);

        &__steps {
          margin-top: 60px;

          &-list {
            margin: 0;
            padding: 0;
            list-style: none;
          }
        }
      }

      &__content {
        padding: 0.5rem 3rem 1.5rem;
        width: 80%;
      }

      &__heading {
        margin: 0;
        font-size: 2.25rem;
        font-weight: 500;
        color: $base-color-darken;
      }

      &__description {
        margin: 0.5rem 0 1rem;
        font-size: 1.1rem;
        color: rgba($base-color-darken, 0.7);
      }

      &__progress {
        margin: 1.5rem 0 0.3rem;
        font-weight: 500;
        color: $base-color-darken;

        &-bar {
          border: none;

          &::-webkit-progress-bar,
          &::-webkit-progress-inner-element,
          &::-webkit-progress-value {
            border: none;
          }
          &::-webkit-progress-bar {
            background-color: rgba($base-color-darken, 0.1);;
          }
        }
      }

      &__wrapper {
        position: relative;
      }

      &__close {
        position: absolute;
        top: 1.2rem;
        right: 1.5rem;
        color: $base-color-darken;
      }

      &__current-step {
        margin-top: 3rem;
        color: $primary-color;
        font-weight: 700;
      }
    }
  }
</style>
