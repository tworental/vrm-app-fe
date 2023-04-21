<template>
  <core-layout>
    <core-layout-content :displayContent="true">
      <template #default>
        <div class="onboarding__content">
          <router-link class="uk-button uk-button-text onboarding__close" to="/" tag="button" v-e2e="'logo'">
            <core-svg width="24" :src="require('@/assets/images/icons/close.svg')" />
          </router-link>
          <h2 class="onboarding__title">{{ $t('onboarding.shared.title') }}</h2>
          <p class="onboarding__description">{{ $t('onboarding.shared.description') }}</p>

          <div>
            <div class="onboarding__progress-num">
              {{ setupPercentage }}%
            </div>
            <progress
              class="uk-progress uk-margin-remove onboarding__progress-bar"
              :value="setupPercentage"
              max="100"
            ></progress>
          </div>

          <div class="onboarding__list">
            <ul uk-accordion>
              <li v-for="(step, idx) in steps" :key="step.id" class="onboarding__list-item">
                <button
                  class="btn--reset uk-accordion-title onboarding__item-title"
                  :class="{ '--done': isDone(step.key) }"
                >
                  <span class="onboarding__item-circle" :class="{ '--done': isDone(step.key) }">
                    <core-svg v-if="isDone(step.key)" class="icon" width="12"
                              :src="require('@/assets/images/icons/check.svg')" />
                    <span v-else>{{ idx + 1 }}</span>
                  </span>
                  <span>
                    {{ $t('onboarding.dicts.' + step?.key + '.title') }}
                  </span>

                  <core-svg width="12" class="arrow"
                            :src="require('@/assets/images/icons/arrow-down.svg')" />
                </button>
                <div class="uk-accordion-content uk-margin-remove">
                  <onboarding-item
                    v-for="(item, index) in step?.children"
                    :key="index"
                    :lang-key="`${step.key}.${item}`"
                    :completed="confirmed[step.key][item]"
                  />
                </div>
              </li>
            </ul>
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

export default {
  components: {
    OnboardingItem,
  },
  setup() {
    const store = useStore();

    const setupPercentage = computed(() => store.state.account.setupPercentage);
    const steps = computed(() => store.getters['onboarding/steps']);
    const confirmed = computed(() => store.state.account.setupProgress);

    const isDone = (key) => Object.values(store.state.account.setupProgress[key])
      .every((value) => value);

    return {
      setupPercentage,
      steps,
      confirmed,
      isDone,
    };
  },
};
</script>

<style lang="scss" scoped>
  .onboarding {
    &__content {
      position: relative;
      padding: 0 1.25rem;
    }
    &__close {
      position: absolute;
      top: 0;
      right: 15px;
    }
    &__title {
      font-size: 1.5rem;
      margin: 0;
      color: $base-color-darken;
      font-weight: 500;

      @include fromWideMobile {
        font-size: 1.7rem;
      }
    }
    &__description {
      font-size: 0.9rem;
      margin-top: 0.5rem;
      color: rgba($base-color-darken, 0.7);

      @include fromWideMobile {
        font-size: 1rem;
      }
    }
    &__progress {
      &-num {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
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
    &__list {
      margin-top: 2rem;

      &-item {
        margin-bottom: 2rem;
      }
    }
    &__item {
      &-title {
        display: flex;
        width: 100%;
        align-items: center;
        font-size: 1rem;
        font-weight: 500;
        text-transform: uppercase;
        text-decoration: none;
        cursor: pointer;

        &,
        &:hover {
          color: $base-color-darken;

          &.--done {
            color: rgba($base-color-darken, 0.3);
          }
        }
      }
      &-circle {
        position: relative;
        display: block;
        height: 1.25rem;
        width: 1.25rem;
        line-height: 1.25rem;
        margin-right: 0.5rem;
        border: 1px solid rgba($base-color, 0.7);
        border-radius: 50%;
        text-align: center;

        .icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        &.--done {
          border-color: $success-color;
          background-color: $success-color;
          color: $color-white;
        }
      }
    }
  }

  .arrow {
    margin-left: auto;
    transition: all 0.25s ease;
  }
  .uk-open .arrow {
    transform: rotateZ(180deg);
  }
</style>
