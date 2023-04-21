<template>
  <v-form
    name="reminder"
    @submit="onSubmit"
    v-e2e
    class="uk-height-1-1"
    v-slot="{ errors, validate, values, setErrors }"
  >
    <core-layout-content :displayContent="true" :isLoading="loading">
      <template #header>
        <core-drawer-header>{{ $t('settings.components.serviceReminderForm.title') }}</core-drawer-header>
      </template>

      <template #default>
        <core-drawer-content>
          <div class="form-content">
            <div class="half-grid uk-margin-bottom">
              <div class="checkbox-grid">
                <div class="checks input-container">
                  <core-form-checkbox
                    class="uk-margin-right"
                    :class="{ '--invalid': errors.reminderSms }"
                    :name="'reminderSms'"
                    :label="$t('settings.components.serviceReminderForm.sms')"
                    :checked="Boolean(reminder?.reminderSms)"
                    @change="setErrors({ phoneNumber: null, reminderEmail: null })"
                    v-e2e="'sms-enabled'"
                  />
                  <v-error-message class="input-error-message uk-text-nowrap" :name="'reminderSms'" />
                </div>
                <div>
                  <label
                    class="input-label"
                    :class="{ '--invalid': errors['phoneNumber'] }"
                  >
                    {{ $t('settings.components.serviceReminderForm.phone') }}
                  </label>
                  <div class="input-container">
                    <core-form-phone-number
                      name="phoneNumber"
                      :label="$t('settings.components.serviceReminderForm.phone')"
                      :placeholder="$t('settings.components.serviceReminderForm.phone')"
                      :disabled="!values?.reminderSms"
                      :value="reminder?.phoneNumber"
                      v-e2e
                    />
                    <v-error-message class="input-error-message uk-text-nowrap" :name="'phoneNumber'" />
                  </div>
                </div>
              </div>
              <div class="checkbox-grid">
                <div class="checks input-container">
                  <core-form-checkbox
                    :name="'reminderEmail'"
                    :class="{ '--invalid': errors.reminderEmail }"
                    :label="$t('settings.components.serviceReminderForm.email')"
                    :checked="Boolean(reminder?.reminderEmail)"
                    @change="setErrors({ email: null, reminderSms: null })"
                    v-e2e="'email-enabled'"
                  />
                  <v-error-message class="input-error-message uk-text-nowrap" :name="'reminderEmail'" />
                </div>
                <div>
                  <label
                    class="input-label --required"
                    :class="{ '--invalid': errors['email'] }"
                  >
                    {{ $t('settings.components.serviceReminderForm.email') }}
                  </label>
                  <div class="input-container">
                    <v-field
                      class="uk-input --outline"
                      as="input"
                      type="email"
                      :name="'email'"
                      :label="$t('settings.components.serviceReminderForm.email')"
                      :placeholder="$t('settings.components.serviceReminderForm.email')"
                      :class="{ '--invalid': errors['email'] }"
                      :rules="'required_if:reminderEmail,1' + (values.reminderEmail ? '|email' : '')"
                      :disabled="!values?.reminderEmail"
                      :value="reminder?.email"
                      v-e2e
                    />
                    <v-error-message class="input-error-message uk-text-nowrap" :name="'email'" />
                  </div>
                </div>
              </div>
            </div>
            <div class="grid">
              <core-form-input-number
                name="time"
                :label="$t('settings.components.serviceReminderForm.frequency')"
                rules="required|min_value:1"
                :value="reminder?.time || 1"
              />
              <div>
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors['timeUnit'] }"
                >
                  {{ $t('settings.components.serviceReminderForm.period') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    :name="'timeUnit'"
                    :label="$t('settings.components.serviceReminderForm.period')"
                    :class="{ '--invalid': errors['timeUnit'] }"
                    rules="required"
                    :data="periods"
                    :value="reminder?.timeUnit || PERIOD_TYPES.HOURS"
                  />
                  <v-error-message class="input-error-message uk-text-nowrap" :name="'timeUnit'" />
                </div>
              </div>

              <div>
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors['eventType'] }"
                >
                  {{ $t('settings.components.serviceReminderForm.eventType') }}
                  <span
                    class="question-tooltip"
                    uk-icon="icon: question; ratio: 0.5"
                    :uk-tooltip="'title:' + $t('settings.components.serviceReminderForm.eventTypeTooltip')"
                  ></span>
                </label>
                <div class="input-container repeat-type">
                  <core-form-select
                    :name="'eventType'"
                    :label="$t('settings.components.serviceReminderForm.repeatType')"
                    :class="{ '--invalid': errors['eventType'] }"
                    rules="required"
                    :data="notificationTimes"
                    :value="reminder?.eventType || NOTIFICATION_TIME_TYPES.BEFORE_SERVICE"
                  />
                  <v-error-message class="input-error-message uk-text-nowrap" :name="'eventType'" />
                </div>
              </div>
            </div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <core-drawer-footer>
          <button
            v-e2e="'reminder'"
            type="submit"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate })"
          >{{ $t('settings.shared.save') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { NOTIFICATION_TIME_TYPES, PERIOD_TYPES } from '@/modules/settings/services/services';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormCheckbox,
    CoreFormSelect,
    CoreFormPhoneNumber,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const uikit = useKit();
    const i18n = useI18n();
    const router = useRouter();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const notificationTimes = Object.values(NOTIFICATION_TIME_TYPES).map((period) => ({
      label: i18n.t(`settings.dicts.notificationTimes.${period}`),
      value: period,
    }));

    const periods = Object.values(PERIOD_TYPES).map((period) => ({
      label: i18n.t(`settings.dicts.periods.${period}`),
      value: period,
    }));

    const service = computed(() => store.state.settings.services.entity);
    const reminder = computed(() => store.state.settings.services.reminders.entity);
    const loading = computed(() => store.state.settings.services.reminders.entityLoading);

    const onSubmit = (values, { setErrors }) => {
      const payload = { ...values };

      if (!values.reminderSms && !values.reminderEmail) {
        return setErrors({
          reminderSms: i18n.t('settings.components.serviceReminderForm.oneRequired'),
          reminderEmail: i18n.t('settings.components.serviceReminderForm.oneRequired'),
        });
      }

      if (!values.reminderSms) {
        payload.phoneNumber = '';
      }

      if (!values.reminderEmail) {
        payload.email = '';
      }

      store.commit('settings/services/reminders/SET_FORM_LOADING', true);

      return store.dispatch('settings/services/reminders/upsert', { ...payload, serviceId: service.value.id })
        .then(() => store.dispatch('settings/services/reminders/setList', service.value.id))
        .then(() => router.push({ name: 'settings-services-overview', params: { id: service.value.id } }))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('settings/services/reminders/SET_FORM_LOADING', false));
    };

    onMounted(() => {
      if (route.params.id && route.params.reminderId) {
        store.dispatch('settings/services/reminders/setEntity', {
          serviceId: route.params.id,
          id: route.params.reminderId,
        });
      }
    });

    onUnmounted(() => {
      store.commit('settings/services/reminders/SET_ENTITY', null);
    });

    return {
      NOTIFICATION_TIME_TYPES,
      PERIOD_TYPES,
      notificationTimes,
      periods,
      reminder,
      loading,

      onSubmit,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.checks {
  height: 40px;
  display: flex;
  align-items: center;
  margin-right: 20px;
  min-width: 65px;
}
.form-content {
  padding: 0 20px;
}
.grid {
  display: grid;
  grid-gap: 20px;

  @include fromWideMobile {
    grid-template-columns: 1fr 2fr 2fr;
  }
}
.checkbox-grid {
  display: grid;
  grid-template-columns: 100px 1fr;
  width: 100%;
  align-items: flex-end;
}
.half-grid {
  display: grid;
  grid-gap: 20px;
}
</style>
