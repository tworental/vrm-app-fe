<template>
  <v-form
    name="owner"
    @submit="onSubmit"
    v-e2e
    class="uk-height-1-1"
    v-slot="{ errors, validate }"
  >
    <core-layout-content :displayContent="true">
      <template #header>
        <core-drawer-header>{{ $t('owners.views.form.title') }}</core-drawer-header>
      </template>

      <template #default>
        <core-drawer-content>
          <div class="uk-padding-small uk-padding-remove-top">
            <div class="half-grid">
              <div
                :class="{
                  'uk-margin-bottom': errors.email || !owner?.id || !emailInvitationVisible,
                  'uk-margin-small-bottom': !(errors.email || !owner?.id) && emailInvitationVisible
                }"
              >
                <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                  {{ $t('owners.shared.email') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="email"
                    mode="value"
                    name="email"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.email }"
                    :placeholder="$t('owners.shared.email')"
                    :label="$t('owners.shared.email')"
                    :value="owner?.email"
                    rules="required|email"
                    @input="emailInvitationVisible = $event.target.value !== owner?.email"
                  />
                  <v-error-message class="input-error-message" name="email" />
                </div>
              </div>

              <div
                :class="{
                  'uk-margin-bottom': errors.phoneNumber || !owner?.id || !emailInvitationVisible,
                  'uk-margin-small-bottom': !(errors.phoneNumber || !owner?.id) && emailInvitationVisible
                }"
              >
                <label class="input-label --required" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
                  {{ $t('owners.shared.phoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="phoneNumber"
                    name="phoneNumber"
                    v-e2e
                    :placeholder="$t('owners.shared.phoneNumber')"
                    :label="$t('owners.shared.phoneNumber')"
                    :value="owner?.phoneNumber"
                  />
                  <v-error-message class="input-error-message" name="phoneNumber" />
                </div>
              </div>
            </div>
            <div v-if="owner?.id && emailInvitationVisible" class="uk-margin-small-bottom">
              <core-form-checkbox
                name="sendInvitation"
                :label="$t('owners.views.form.sendInvitation')"
                :small="true"
              />
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.firstName }"
                  for="firstName"
                >
                  {{ $t('owners.shared.firstName') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="firstName"
                    mode="value"
                    name="firstName"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.firstName }"
                    :placeholder="$t('owners.shared.firstName')"
                    :label="$t('owners.shared.firstName')"
                    :value="owner?.firstName"
                    rules="required|min:1|max:191"
                  />
                  <v-error-message class="input-error-message" name="firstName" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.lastName }"
                  for="lastName"
                >
                  {{ $t('owners.shared.lastName') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="lastName"
                    mode="value"
                    name="lastName"
                    as="input"
                    v-e2e
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.lastName }"
                    :placeholder="$t('owners.shared.lastName')"
                    :label="$t('owners.shared.lastName')"
                    :value="owner?.lastName"
                    rules="required|min:1|max:191"
                  />
                  <v-error-message class="input-error-message" name="lastName" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.birthDate }"
                  for="birthDate"
                >
                  {{ $t('owners.shared.birthDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="birthDate"
                    name="birthDate"
                    v-e2e="'birthDate'"
                    :min="formatDateForInput(minBirthday)"
                    :max="formatDateForInput(maxBirthday)"
                    :rules="'required|max_date:' + maxDateRule"
                    :label="$t('owners.shared.birthDate')"
                    :value="formatDateForInput(owner?.birthDate)"
                  />
                  <v-error-message class="input-error-message" name="birthDate" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.gender }"
                  for="gender"
                >
                  {{ $t('owners.shared.gender') }}
                </label>
                <div class="gender">
                  <core-form-radio-group
                    id="gender"
                    name="gender"
                    v-e2e="'gender'"
                    :value="owner?.gender"
                    :items="genderItems"
                    :label="$t('owners.shared.gender')"
                    rules="required"
                  />
                  <v-error-message class="input-error-message" name="gender" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.citizenship }"
                  for="citizenship"
                >
                  {{ $t('owners.shared.citizenship') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="citizenship"
                    name="citizenship"
                    :label="$t('owners.shared.citizenship')"
                    :value="owner?.citizenship"
                    rules="required"
                    :class="{ '--invalid': errors.citizenship }"
                    :data="countries"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="citizenship" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.residence }"
                  for="residence"
                >
                  {{ $t('owners.shared.residence') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="residence"
                    name="residence"
                    :class="{ '--invalid': errors.residence }"
                    :label="$t('owners.shared.residence')"
                    :value="owner?.residence"
                    rules="required"
                    :data="countries"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="residence" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.documentType }"
                  for="documentType"
                >
                  {{ $t('owners.shared.documentType') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="documentType"
                    name="documentType"
                    :class="{ '--invalid': errors.documentType }"
                    :label="$t('owners.shared.documentType')"
                    :value="owner?.documentType"
                    rules="required"
                    :data="documentTypes"
                  />
                  <v-error-message class="input-error-message" name="documentType" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.documentNumber }"
                  for="documentNumber"
                >
                  {{ $t('owners.shared.documentNumber') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="documentNumber"
                    mode="value"
                    name="documentNumber"
                    as="input"
                    v-e2e="'documentNumber'"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.documentNumber }"
                    :placeholder="$t('owners.shared.documentNumber')"
                    :label="$t('owners.shared.documentNumber')"
                    :value="owner?.documentNumber"
                    rules="required|min:1|max:15"
                  />
                  <v-error-message class="input-error-message" name="documentNumber" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <core-form-input-number
                class="uk-margin-bottom"
                :label="$t('owners.shared.agencyCommission')"
                name="agencyCommission"
                :placeholder="$t('owners.shared.agencyCommission')"
                :value="owner?.agencyCommission"
                rules="between:0,100"
              />
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.parlance }" for="parlance">
                {{ $t('owners.shared.parlance') }}
              </label>
              <div class="input-container">
                <core-form-tags
                  id="parlance"
                  name="parlance"
                  :placeholder="$t('owners.shared.parlance')"
                  :value="owner?.parlance"
                  :only-autocomplete="true"
                  :data="langs"
                />
                <v-error-message class="input-error-message" name="parlance" />
              </div>
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.units }" for="units">
                {{ $t('owners.shared.units') }}
              </label>
              <core-form-tags
                id="units"
                name="units"
                :no-items-label="$t('owners.views.form.noUnits')"
                :placeholder="$t('owners.shared.units')"
                :value="unitsValue"
                :only-autocomplete="true"
                :data="units"
              />
              <v-error-message class="input-error-message" name="units" />
            </div>

            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
                {{ $t('owners.shared.notes') }}
              </label>
              <div class="input-container">
                <v-field
                  id="notes"
                  mode="value"
                  name="notes"
                  as="textarea"
                  v-e2e="'notes'"
                  class="uk-textarea --outline"
                  :class="{ '--invalid': errors.notes }"
                  :placeholder="$t('owners.shared.notes')"
                  :label="$t('owners.shared.notes')"
                  :value="owner?.notes"
                />
                <v-error-message class="input-error-message" name="notes" />
              </div>
            </div>

            <!-- <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.documents }" for="documents">
                {{ $t('owners.shared.documents') }}
              </label>
              <div class="input-container">
                <core-form-upload-button
                  id="documents"
                  name="documents"
                  :label="$t('owners.shared.uploadDocuments')"
                  :multiple="true"
                />
                <v-error-message class="input-error-message" name="documents" />
              </div>
            </div> -->

            <div>
              <core-form-switcher
                v-e2e="'hasPanelAccess'"
                id="hasPanelAccess"
                name="hasPanelAccess"
                :checked="Boolean(owner?.hasPanelAccess)"
                :label="$t('owners.shared.hasPanelAccess')"
              />
            </div>
          </div>
        </core-drawer-content>
      </template>

      <template #footer>
        <core-drawer-footer>
          <router-link v-e2e="'close'" :to="{ name: 'owners' }" class="uk-margin-medium-right">
            {{ $t('owners.views.form.cancel') }}
          </router-link>
          <button
            v-e2e
            type="submit"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate })"
          >{{ $t('owners.views.form.save') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onUnmounted, ref } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRouter } from 'vue-router';
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
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';
import CoreFormCheckbox from '@/modules/core/components/core-form/CoreFormCheckbox.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormTags from '@/modules/core/components/core-form/CoreFormTags.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
// import CoreFormUploadButton from '@/modules/core/components/core-form/CoreFormUploadButton.vue';
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
    CoreFormSwitcher,
    CoreFormCheckbox,
    CoreFormRadioGroup,
    CoreFormTags,
    CoreFormDatepicker,
    // CoreFormUploadButton,
    CoreFormSelect,
    CoreFormPhoneNumber,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const uikit = useKit();
    const i18n = useI18n();
    const { formErrorFormatter } = useApiFormatters();

    const emailInvitationVisible = ref(false);

    const owner = computed(() => store.state.owners.owner);

    const langs = LANG_ISO_CODES.map((lang) => ({ label: i18n.t(`owners.dicts.langs.${lang}`), value: lang }));

    const genderItems = [
      { label: i18n.t('core.dicts.gender.m'), value: 'm' },
      { label: i18n.t('core.dicts.gender.f'), value: 'f' },
      { label: i18n.t('core.dicts.gender.other'), value: 'other' },
    ];

    const documentTypes = Object.values(DOCUMENT_TYPES).map((documentType) => ({
      label: i18n.t(`owners.dicts.documentTypes.${documentType}`), value: documentType,
    }));

    // TODO: this is wrong - we should get units - not properties
    const units = computed(() => store.getters['rentals/rentals/autocompleteList']);

    const unitsValue = computed(() => store.state.owners.owner?.units.map((p) => p.id));
    const countries = COUNTRIES.map((country) => ({ label: country.countryName, value: country.countryShortCode }));

    const minBirthday = dayjs().subtract(118, 'years');
    const maxBirthday = dayjs().subtract(18, 'years');

    const locale = computed(() => store.state.account.account.settings.locale);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    // const timezone = computed(() => store.getters['core/timezone']);
    const maxDateRule = computed(() => `${formatDateForInput(maxBirthday)},${formatDate(maxBirthday, locale.value, undefined, dateFormat.value, false)}`);

    const onSubmit = (values, { setErrors }) => {
      store.commit('owners/SET_LOADING', true);

      store.dispatch('owners/upsertOwner', values)
        .then(() => router.push({ name: 'owners' }))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('owners/SET_LOADING', false));
    };

    onUnmounted(() => {
      store.commit('owners/SET_OWNER', null);
    });

    return {
      emailInvitationVisible,
      langs,
      genderItems,
      owner,
      countries,
      minBirthday,
      maxBirthday,
      maxDateRule,
      units,
      unitsValue,
      documentTypes,
      onSubmit,
      formatDateForInput,
      getDefaultBirthday,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
.half-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
}
.gender {
  margin-top: 5px;
}
</style>
