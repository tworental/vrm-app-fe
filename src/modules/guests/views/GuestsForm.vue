<template>
  <v-form
    name="guest"
    @submit="onSubmit"
    v-e2e
    class="uk-height-1-1"
    v-slot="{ errors, validate }"
  >
    <core-layout-content :displayContent="true">
      <template #header>
        <core-drawer-header>{{ $t('guests.views.form.title') }}</core-drawer-header>
      </template>

      <template #default>
        <core-drawer-content>
          <div class="form-content" v-if="guest">
            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.title }" for="title">
                  {{ $t('guests.views.form.titleLabel') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="title"
                    name="title"
                    :class="{ '--invalid': errors.title }"
                    :label="$t('guests.views.form.titleLabel')"
                    rules="required"
                    :data="titles"
                    :value="guest?.title"
                    :search="false"
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.fullName }" for="fullName">
                  {{ $t('guests.shared.fullName') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="fullName"
                    mode="value"
                    name="fullName"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.fullName }"
                    :placeholder="$t('guests.shared.fullName')"
                    :label="$t('guests.shared.fullName')"
                    :value="guest?.firstName + ' ' + guest?.lastName"
                    rules="required|min:5|max:201|full_name"
                  />
                  <v-error-message class="input-error-message" name="fullName" />
                </div>
              </div>
            </div>
            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                  {{ $t('guests.shared.email') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="email"
                    mode="value"
                    name="email"
                    as="input"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.email }"
                    :placeholder="$t('guests.shared.email')"
                    :label="$t('guests.shared.email')"
                    :value="guest?.email"
                    rules="required|email"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="email" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
                  {{ $t('guests.shared.phoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="phoneNumber"
                    name="phoneNumber"
                    v-e2e
                    :placeholder="$t('guests.shared.phoneNumber')"
                    :label="$t('guests.shared.phoneNumber')"
                    :value="guest?.phoneNumber"
                  />
                  <v-error-message class="input-error-message" name="phoneNumber" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.countryCode }" for="countryCode">
                  {{ $t('guests.shared.countryResidence') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="countryCode"
                    name="countryCode"
                    :class="{ '--invalid': errors.countryCode }"
                    :label="$t('guests.shared.countryResidence')"
                    :value="guest?.countryCode"
                    rules="required"
                    :data="countries"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="countryCode" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.citizenship }" for="citizenship">
                  {{ $t('guests.shared.citizenship') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="citizenship"
                    name="citizenship"
                    :class="{ '--invalid': errors.citizenship }"
                    :label="$t('guests.shared.citizenship')"
                    :value="guest?.citizenship"
                    :data="countries"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="citizenship" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.gender }" for="gender">
                  {{ $t('guests.shared.gender') }}
                </label>
                <div class="gender">
                  <core-form-radio-group
                    id="gender"
                    name="gender"
                    :value="guest?.gender"
                    :items="genderItems"
                    :label="$t('guests.shared.gender')"
                    rules="required"
                  />
                  <v-error-message class="input-error-message" name="gender" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.parlance }" for="parlance">
                  {{ $t('guests.shared.parlance') }}
                </label>
                <div class="input-container">
                  <core-form-tags
                    id="parlance"
                    name="parlance"
                    :placeholder="$t('guests.shared.parlance')"
                    :only-autocomplete="true"
                    :data="langs"
                    :value="guest?.parlance"
                  />
                  <v-error-message class="input-error-message" name="parlance" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.birthDate }" for="birthDate">
                  {{ $t('guests.shared.birthDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="birthDate"
                    name="birthDate"
                    :min="formatDateForInput(minBirthday)"
                    :max="formatDateForInput(maxBirthday)"
                    :rules="'min_date:' + minDateRule + '|max_date:' + maxDateRule"
                    :label="$t('guests.shared.birthDate')"
                    :value="formatDateForInput(guest?.birthDate)"
                  />
                  <v-error-message class="input-error-message" name="birthDate" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.birthPlace }" for="birthPlace">
                  {{ $t('guests.shared.birthPlace') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="birthPlace"
                    name="birthPlace"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.birthPlace }"
                    :placeholder="$t('guests.shared.birthPlace')"
                    :label="$t('guests.shared.birthPlace')"
                    :value="guest?.birthPlace"
                    rules="max:191"
                  />
                  <v-error-message class="input-error-message" name="birthPlace" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.documentType }" for="documentType">
                  {{ $t('guests.shared.documentType') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="documentType"
                    name="documentType"
                    :class="{ '--invalid': errors.documentType }"
                    :label="$t('guests.shared.documentType')"
                    :value="guest?.documentType"
                    :data="documentTypes"
                  />
                  <v-error-message class="input-error-message" name="documentType" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.documentNumber }" for="documentNumber">
                  {{ $t('guests.shared.documentNumber') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="documentNumber"
                    mode="value"
                    name="documentNumber"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.documentNumber }"
                    :placeholder="$t('guests.shared.documentNumber')"
                    :label="$t('guests.shared.documentNumber')"
                    :value="guest?.documentNumber"
                    rules="max:15"
                  />
                  <v-error-message class="input-error-message" name="documentNumber" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.documentIssuedDate }"
                  for="documentIssuedDate"
                >
                  {{ $t('guests.shared.documentIssuedDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="documentIssuedDate"
                    name="documentIssuedDate"
                    :max="formatDateForInput(new Date())"
                    :rules="'max_date:' + maxDocumentIssuedDateRule"
                    :label="$t('guests.shared.documentIssuedDate')"
                    :value="formatDateForInput(guest?.documentIssuedDate)"
                  />
                  <v-error-message class="input-error-message" name="documentIssuedDate" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.documentExpiryDate }"
                  for="documentExpiryDate"
                >
                  {{ $t('guests.shared.documentExpiryDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="documentExpiryDate"
                    name="documentExpiryDate"
                    :min="formatDateForInput(new Date())"
                    :rules="'min_date:' + minDocumentExpiryDateRule"
                    :label="$t('guests.shared.documentExpiryDate')"
                    :value="formatDateForInput(guest?.documentExpiryDate)"
                  />
                  <v-error-message class="input-error-message" name="documentExpiryDate" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.address }"
                  for="address"
                >
                  {{ $t('guests.shared.address') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="address"
                    class="uk-input --outline"
                    name="address"
                    type="text"
                    :label="$t('guests.shared.address')"
                    :placeholder="$t('guests.shared.address')"
                    :class="{ '--invalid': errors.address }"
                    :value="guest?.address"
                    v-e2e
                  />

                  <v-error-message class="input-error-message" name="address" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.city }" for="city">
                  {{ $t('guests.shared.city') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="city"
                    name="city"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.city }"
                    :placeholder="$t('guests.shared.city')"
                    :label="$t('guests.shared.city')"
                    :value="guest?.city"
                    rules="max:191"
                  />
                  <v-error-message class="input-error-message" name="city" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.region }" for="region">
                  {{ $t('guests.shared.region') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="region"
                    name="region"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.region }"
                    :placeholder="$t('guests.shared.region')"
                    :label="$t('guests.shared.region')"
                    rules="max:191"
                    :value="guest?.region"
                  />
                  <v-error-message class="input-error-message" name="region" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label"
                  :class="{ '--invalid': errors.zip }"
                  for="zip"
                >
                  {{ $t('guests.shared.zip') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="zip"
                    class="uk-input --outline"
                    name="zip"
                    type="text"
                    :label="$t('guests.shared.zip')"
                    :placeholder="$t('guests.shared.zip')"
                    :class="{ '--invalid': errors.zip }"
                    :value="guest?.zip"
                    v-e2e
                  />

                  <v-error-message class="input-error-message" name="zip" />
                </div>
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
                {{ $t('guests.shared.notes') }}
              </label>
              <div class="input-container">
                <v-field
                  id="notes"
                  mode="value"
                  name="notes"
                  as="textarea"
                  v-e2e
                  class="uk-textarea --outline uk-width-1-1"
                  :class="{ '--invalid': errors.notes }"
                  :placeholder="$t('guests.shared.notes')"
                  :label="$t('guests.shared.notes')"
                  :value="guest?.notes"
                  rows="4"
                />
                <v-error-message class="input-error-message" name="notes" />
              </div>
            </div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <core-drawer-footer>
          <router-link v-e2e="'cancel'" :to="{ name: 'guests' }" class="uk-margin-right">
            {{ $t('guests.views.form.cancel') }}
          </router-link>
          <button
            v-e2e
            type="submit"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate })"
          >{{ $t('guests.views.form.save') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import COUNTRIES from 'country-region-data';

import {
  LANG_ISO_CODES,
  formatDateForInput,
  formatDate,
  getDefaultBirthday,
} from '@/utils/intl';
import dayjs from '@/utils/dayjs';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import { DOCUMENT_TYPES } from '@/modules/core/services';
import { TITLES } from '@/modules/guests/services/guests';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';
import CoreFormTags from '@/modules/core/components/core-form/CoreFormTags.vue';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormRadioGroup,
    CoreFormDatepicker,
    CoreFormSelect,
    CoreFormTags,
    CoreFormPhoneNumber,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const uikit = useKit();
    const i18n = useI18n();
    const route = useRoute();
    const { formErrorFormatter } = useApiFormatters();

    const guest = computed(() => store.state.guests.guests.guest);

    const langs = LANG_ISO_CODES.map((lang) => ({ label: i18n.t(`guests.dicts.langs.${lang}`), value: lang }));

    const titles = Object.values(TITLES).map((title) => ({
      label: i18n.t(`guests.dicts.titles.${title}`), value: title,
    }));

    const genderItems = [
      { label: i18n.t('core.dicts.gender.m'), value: 'm' },
      { label: i18n.t('core.dicts.gender.f'), value: 'f' },
      { label: i18n.t('core.dicts.gender.other'), value: 'other' },
    ];

    const documentTypes = Object.values(DOCUMENT_TYPES).map((documentType) => ({
      label: i18n.t(`guests.dicts.documentTypes.${documentType}`), value: documentType,
    }));

    const countries = COUNTRIES.map((country) => ({ label: country.countryName, value: country.countryShortCode }));

    const minBirthday = dayjs().subtract(118, 'years');
    const maxBirthday = dayjs().subtract(18, 'years');

    const locale = computed(() => store.state.account.account.settings.locale);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    // const timezone = computed(() => store.getters['core/timezone']);
    const minDateRule = computed(() => `${formatDateForInput(minBirthday)},${formatDate(minBirthday, locale.value, undefined, dateFormat.value, false)}`);
    const maxDateRule = computed(() => `${formatDateForInput(maxBirthday)},${formatDate(maxBirthday, locale.value, undefined, dateFormat.value, false)}`);
    const maxDocumentIssuedDateRule = computed(() => `${formatDateForInput(new Date())},${formatDate(new Date(), locale.value, undefined, dateFormat.value, false)}`);
    const minDocumentExpiryDateRule = computed(() => `${formatDateForInput(new Date())},${formatDate(new Date(), locale.value, undefined, dateFormat.value, false)}`);

    const onSubmit = ({ fullName, ...values }, { setErrors }) => {
      store.commit('guests/guests/SET_FORM_LOADING', true);
      const [firstName, lastName] = fullName.split(' ');

      const payload = {
        ...values,
        firstName,
        lastName,
      };

      store.dispatch('guests/guests/upsertGuest', payload)
        .then(() => store.dispatch('guests/guests/setGuestsList'))
        .then(() => router.push({ name: 'guests' }))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('guests/guests/SET_FORM_LOADING', false));
    };

    onMounted(async () => {
      if (route.params.id) {
        await store.dispatch('guests/guests/setGuestById', route.params.id);
      }
    });

    onUnmounted(() => {
      store.commit('guests/guests/SET_GUEST', null);
    });

    return {
      titles,
      langs,
      genderItems,
      guest,
      countries,
      minBirthday,
      maxBirthday,
      minDateRule,
      maxDateRule,
      documentTypes,
      maxDocumentIssuedDateRule,
      minDocumentExpiryDateRule,
      onSubmit,
      formatDateForInput,
      getDefaultBirthday,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.form-content {
  padding: 0 20px;
}
.half-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}
</style>
