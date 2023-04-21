<template>
  <v-form
    ref="formRef"
    v-slot="{ validate, errors, values }"
    class="uk-height-1-1"
    @submit.stop
  >
    <core-layout-content :header-has-margins="false">
      <template #header>
        <core-drawer-header>
          <template v-if="invoice">
            {{ $t('documents.views.invoicesForm.titleUpdate') }}
          </template>
          <template v-else>
            {{ $t('documents.views.invoicesForm.titleCreate') }}
          </template>
        </core-drawer-header>
      </template>
      <template #default>
        <core-drawer-content>
          <div class="invoices__container --bordered">
            <div class="triple-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.invoiceNo }" for="invoiceNo">
                  {{ $t('documents.views.invoicesForm.invoiceNo') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="invoiceNo"
                    class="uk-input --outline"
                    as="input"
                    type="text"
                    name="invoiceNo"
                    :label="$t('documents.views.invoicesForm.invoiceNo')"
                    :placeholder="$t('documents.views.invoicesForm.invoiceNo')"
                    :class="{ '--invalid': errors.invoiceNo }"
                    rules="required|min:2"
                    :value="expectedInvoiceNo || invoice?.invoiceNo"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="invoiceNo" />
                </div>
              </div>
            </div>

            <div class="triple-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.invoiceDate }"
                  for="invoiceDate"
                >
                  {{ $t('documents.views.invoicesForm.invoiceDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="invoiceDate"
                    name="invoiceDate"
                    :label="$t('documents.views.invoicesForm.invoiceDate')"
                    :rules="'required'"
                    :value="values.invoiceDate"
                  />
                  <v-error-message class="input-error-message" name="invoiceDate" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.invoiceDueDate }"
                  for="invoiceDueDate"
                >
                  {{ $t('documents.views.invoicesForm.dueDate') }}
                </label>
                <div class="input-container">
                  <core-form-datepicker
                    id="invoiceDueDate"
                    name="invoiceDueDate"
                    :label="$t('documents.views.invoicesForm.dueDate')"
                    :rules="'required'"
                    :value="values.invoiceDueDate"
                  />
                  <v-error-message class="input-error-message" name="invoiceDueDate" />
                </div>
              </div>
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.paymentType }" for="paymentType">
                  {{ $t('documents.views.invoicesForm.paymentType') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="paymentType"
                    name="paymentType"
                    :class="{ '--invalid': errors.paymentType }"
                    :label="$t('documents.views.invoicesForm.paymentType')"
                    rules="required"
                    :press-label="false"
                    :data="paymentTypes"
                    :value="values.paymentType"
                  />
                  <v-error-message class="input-error-message" name="paymentType" />
                </div>
              </div>
            </div>
          </div>
          <div class="invoices__container --bordered">
            <div class="half-grid">
              <div>
                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label class="input-label --required" :class="{ '--invalid': errors.sellerName }" for="sellerName">
                      {{ $t('documents.views.invoicesForm.sellerName') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="sellerName"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="sellerName"
                        :label="$t('documents.views.invoicesForm.sellerName')"
                        :placeholder="$t('documents.views.invoicesForm.sellerName')"
                        :class="{ '--invalid': errors.sellerName }"
                        rules="required|min:2"
                        :value="values.sellerName"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="sellerName" />
                    </div>
                  </div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.sellerTaxId }"
                      for="sellerTaxId"
                    >
                      {{ $t('documents.views.invoicesForm.sellerTaxId') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="sellerTaxId"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="sellerTaxId"
                        :label="$t('documents.views.invoicesForm.sellerTaxId')"
                        :placeholder="$t('documents.views.invoicesForm.sellerTaxId')"
                        :class="{ '--invalid': errors.sellerTaxId }"
                        rules="required|min:2"
                        :value="values.sellerTaxId"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="sellerTaxId" />
                    </div>
                  </div>
                </div>
                <div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.sellerAddress }"
                      for="sellerAddress"
                    >
                      {{ $t('documents.views.invoicesForm.sellerAddress') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="sellerAddress"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="sellerAddress"
                        :label="$t('documents.views.invoicesForm.sellerAddress')"
                        :placeholder="$t('documents.views.invoicesForm.sellerAddress')"
                        :class="{ '--invalid': errors.sellerAddress }"
                        rules="required|min:2"
                        :value="values.sellerAddress"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="sellerAddress" />
                    </div>
                  </div>
                </div>
                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.sellerCity }"
                      for="sellerCity"
                    >
                      {{ $t('documents.views.invoicesForm.sellerCity') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="sellerCity"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="sellerCity"
                        :label="$t('documents.views.invoicesForm.sellerCity')"
                        :placeholder="$t('documents.views.invoicesForm.sellerCity')"
                        :class="{ '--invalid': errors.sellerCity }"
                        rules="required|min:2"
                        :value="values.sellerCity"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="sellerCity" />
                    </div>
                  </div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.sellerZip }"
                      for="sellerZip"
                    >
                      {{ $t('documents.views.invoicesForm.sellerZip') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="sellerZip"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="sellerZip"
                        :label="$t('documents.views.invoicesForm.sellerZip')"
                        :placeholder="$t('documents.views.invoicesForm.sellerZip')"
                        :class="{ '--invalid': errors.sellerZip }"
                        rules="required|min:2"
                        :value="values.sellerZip"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="sellerZip" />
                    </div>
                  </div>
                </div>
                <div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.sellerCountry }"
                      for="sellerCountry"
                    >
                      {{ $t('documents.views.invoicesForm.sellerCountry') }}
                    </label>
                    <div class="input-container">
                      <core-form-select
                        id="sellerCountry"
                        name="sellerCountry"
                        :class="{ '--invalid': errors.sellerCountry }"
                        :label="$t('documents.views.invoicesForm.sellerCountry')"
                        rules="required"
                        :press-label="false"
                        :search="true"
                        :data="countries"
                        :value="values.sellerCountry"
                      />
                      <v-error-message class="input-error-message" name="sellerCountry" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label class="input-label --required" :class="{ '--invalid': errors.buyerName }" for="buyerName">
                      {{ $t('documents.views.invoicesForm.buyerName') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="buyerName"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="buyerName"
                        :label="$t('documents.views.invoicesForm.buyerName')"
                        :placeholder="$t('documents.views.invoicesForm.buyerName')"
                        :class="{ '--invalid': errors.buyerName }"
                        rules="required|min:2"
                        :value="values.buyerName"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="buyerName" />
                    </div>
                  </div>
                  <div class="uk-margin-bottom">
                    <label class="input-label --required" :class="{ '--invalid': errors.buyerTaxId }" for="buyerTaxId">
                      {{ $t('documents.views.invoicesForm.buyerTaxId') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="buyerTaxId"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="buyerTaxId"
                        :label="$t('documents.views.invoicesForm.buyerTaxId')"
                        :placeholder="$t('documents.views.invoicesForm.buyerTaxId')"
                        :class="{ '--invalid': errors.buyerTaxId }"
                        :value="values.buyerTaxId"
                        rules="required|min:2"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="buyerTaxId" />
                    </div>
                  </div>
                </div>
                <div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.buyerAddress }"
                      for="buyerAddress"
                    >
                      {{ $t('documents.views.invoicesForm.buyerAddress') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="buyerAddress"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="buyerAddress"
                        :label="$t('documents.views.invoicesForm.buyerAddress')"
                        :placeholder="$t('documents.views.invoicesForm.buyerAddress')"
                        :class="{ '--invalid': errors.buyerAddress }"
                        rules="required|min:2"
                        :value="values.buyerAddress"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="buyerAddress" />
                    </div>
                  </div>
                </div>
                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.buyerCity }"
                      for="buyerCity"
                    >
                      {{ $t('documents.views.invoicesForm.buyerCity') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="buyerCity"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="buyerCity"
                        :label="$t('documents.views.invoicesForm.buyerCity')"
                        :placeholder="$t('documents.views.invoicesForm.buyerCity')"
                        :class="{ '--invalid': errors.buyerCity }"
                        :value="values.buyerCity"
                        rules="required|min:2"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="buyerCity" />
                    </div>
                  </div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.buyerZip }"
                      for="buyerZip"
                    >
                      {{ $t('documents.views.invoicesForm.buyerZip') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="buyerZip"
                        class="uk-input --outline"
                        as="input"
                        type="text"
                        name="buyerZip"
                        :label="$t('documents.views.invoicesForm.buyerZip')"
                        :placeholder="$t('documents.views.invoicesForm.buyerZip')"
                        :class="{ '--invalid': errors.buyerZip }"
                        rules="required|min:2"
                        :value="values.buyerZip"
                        v-e2e
                      />
                      <v-error-message class="input-error-message" name="buyerZip" />
                    </div>
                  </div>
                </div>
                <div>
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors.buyerCountry }"
                      for="buyerCountry"
                    >
                      {{ $t('documents.views.invoicesForm.buyerCountry') }}
                    </label>
                    <div class="input-container">
                      <core-form-select
                        id="buyerCountry"
                        name="buyerCountry"
                        :class="{ '--invalid': errors.buyerCountry }"
                        :label="$t('documents.views.invoicesForm.buyerCountry')"
                        rules="required"
                        :press-label="false"
                        :search="true"
                        :data="countries"
                        :value="values.buyerCountry"
                      />
                      <v-error-message class="input-error-message" name="buyerCountry" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="invoices__container --bordered">
            <div class="triple-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.currency }"
                  for="currency"
                >
                  {{ $t('documents.views.invoicesForm.currency') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="currency"
                    name="currency"
                    :label="$t('documents.views.invoicesForm.currency')"
                    :class="{ '--invalid': errors.currency }"
                    rules="required"
                    :value="invoice?.currency || defaultCurrency"
                    :data="currencies"
                    :press-label="false"
                    :search="true"
                    :show-placeholder="false"
                  />
                  <v-error-message class="input-error-message" name="currency" />
                </div>
              </div>
            </div>
            <table class="invoices__table" v-if="values.invoiceItems">
              <thead>
                <tr>
                  <th>{{ $t('documents.views.invoicesForm.table.name') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.quantity') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.price') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.discount') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.amount') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.tax') }}</th>
                  <th>{{ $t('documents.views.invoicesForm.table.total') }}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in invoiceItems" :key="i">
                  <td class="name">
                    <v-field
                      class="uk-input --outline"
                      as="input"
                      type="text"
                      :name="'invoiceItems['+ i +'].name'"
                      :placeholder="$t('documents.views.invoicesForm.table.name')"
                      :class="{ '--invalid': errors['invoiceItems['+ i +'].name'] }"
                      rules="required|min:2"
                      v-model="item.name"
                      v-e2e
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].quantity'"
                      :placeholder="$t('documents.views.invoicesForm.table.quantity')"
                      :rules="'required'"
                      :show-error="false"
                      :validate-on-value-update="false"
                      :min="1"
                      :value="values.invoiceItems[i].quantity"
                      @input="calculateInvoiceItems(values.invoiceItems, i)"
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].price'"
                      :placeholder="$t('documents.views.invoicesForm.table.price')"
                      :rules="'required'"
                      :show-error="false"
                      :currency="values.currency"
                      :validate-on-value-update="false"
                      :min="0"
                      :value="values.invoiceItems[i].price"
                      float
                      @input="calculateInvoiceItems(values.invoiceItems, i)"
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].discount'"
                      :placeholder="$t('documents.views.invoicesForm.table.discount')"
                      :rules="'required'"
                      :show-error="false"
                      :currency="values.currency"
                      :validate-on-value-update="false"
                      :value="values.invoiceItems[i].discount"
                      :min="0"
                      :max="values.invoiceItems[i].quantity * values.invoiceItems[i].price"
                      float
                      @input="calculateInvoiceItems(values.invoiceItems, i)"
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].net'"
                      :placeholder="$t('documents.views.invoicesForm.table.amount')"
                      :rules="'required'"
                      :disabled="true"
                      :show-error="false"
                      :currency="values.currency"
                      :value="values.invoiceItems[i].net"
                      :validate-on-value-update="false"
                      :min="0"
                      float
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].tax'"
                      :placeholder="$t('documents.views.invoicesForm.table.tax')"
                      :rules="'required'"
                      :show-error="false"
                      suffix="%"
                      :validate-on-value-update="false"
                      :value="values.invoiceItems[i].tax"
                      :min="0"
                      :max="100"
                      float
                      @input="calculateInvoiceItems(values.invoiceItems, i)"
                    />
                  </td>
                  <td>
                    <core-form-input-number
                      :name="'invoiceItems['+ i +'].gross'"
                      :placeholder="$t('documents.views.invoicesForm.table.total')"
                      :rules="'required'"
                      :disabled="true"
                      :show-error="false"
                      :currency="values.currency"
                      :value="values.invoiceItems[i].gross"
                      :validate-on-value-update="false"
                      :min="0"
                      float
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      class="uk-button uk-button-link uk-text-danger"
                      @click="onRemoveInvoiceItem(i)"
                      :disabled="values.invoiceItems.length <= 1"
                    >
                      <core-svg :width="20" :src="require('@/assets/images/icons/delete.svg')" />
                    </button>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>
                    <button
                      type="button"
                      class="uk-button uk-button-link uk-button--add uk-padding-remove"
                      v-e2e="'add-invoice-item'"
                      @click="onAddInvoiceItem"
                    >
                      <core-svg
                        :width="17"
                        :src="require('@/assets/images/icons/add.svg')"
                      />
                      <span>{{ $t('documents.views.invoicesForm.table.addItem') }}</span>
                    </button>
                  </td>
                  <td colspan="6" class="uk-text-right footer-total">
                    {{
                      $t('documents.views.invoicesForm.table.totalAmount', {
                        num: formatCurrency(getTotal(values.invoiceItems), 'EUR', locale)
                      })
                    }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div class="invoices__container">
            <div class="uk-margin-bottom">
              <label class="input-label" :class="{ '--invalid': errors.invoiceNote }" for="notes">
                {{ $t('documents.views.invoicesForm.notes') }}
              </label>
              <div class="input-container">
                <v-field
                  id="notes"
                  mode="value"
                  name="invoiceNote"
                  as="textarea"
                  v-e2e="'notes'"
                  rows="4"
                  class="uk-textarea --outline"
                  :class="{ '--invalid': errors.invoiceNote }"
                  :placeholder="$t('documents.views.invoicesForm.notes')"
                  :label="$t('documents.views.invoicesForm.notes')"
                />
                <v-error-message class="input-error-message" name="invoiceNote" />
              </div>
            </div>
          </div>
        </core-drawer-content>
      </template>
      <template #footer>
        <core-drawer-footer>
          <router-link v-e2e="'cancel'" :to="{ name: 'documents-invoices' }" class="uk-margin-right">
            {{ $t('documents.views.invoicesForm.cancel') }}
          </router-link>
          <button
            v-e2e
            type="submit"
            class="uk-button uk-button-success uk-margin-small-right"
            @click="handleSubmitClick({ validate, onSubmit: onSubmit('draft', values) })"
          >{{ $t('documents.views.invoicesForm.saveAsDraft') }}</button>
          <button
            v-e2e
            type="submit"
            class="uk-button uk-button-primary"
            @click="handleSubmitClick({ validate, onSubmit: onSubmit('issued', values) })"
          >{{ $t('documents.views.invoicesForm.saveAsIssued') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { ErrorMessage, Field, Form } from 'vee-validate';
import COUNTRIES from 'country-region-data';

import { handleSubmitClick, scrollToFirstInvalidControl } from '@/utils/form';
import { formatCurrency, formatDate, formatCountryName } from '@/utils/intl';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreLayoutContent from '@/modules/core/components/core-layout/CoreLayoutContent.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormInputNumber from '@/modules/core/components/core-form/CoreFormInputNumber.vue';
import { DEFAULT_INVOICE_ITEM, PAYMENT_TYPES } from '@/modules/documents/services/invoices';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreLayoutContent,
    CoreFormDatepicker,
    CoreFormSelect,
    CoreFormInputNumber,
  },
  setup() {
    const store = useStore();
    const i18n = useI18n();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const paymentTypes = Object.values(PAYMENT_TYPES).map((type) => ({
      label: i18n.t(`documents.dicts.invoices.paymentTypes.${type}`),
      value: type,
    }));

    const countries = COUNTRIES.map((country) => ({ label: country.countryName, value: country.countryShortCode }));

    const invoiceItems = ref([{ ...DEFAULT_INVOICE_ITEM }]);
    const formRef = ref(null);

    const properties = computed(() => store.getters['rentals/rentals/autocompleteList']);
    const invoice = computed(() => store.state.documents.invoices.invoice);
    const expectedInvoiceNo = computed(() => store.state.documents.invoices.expectedInvoiceNo);
    const account = computed(() => store.state.account.account);
    const locale = computed(() => store.state.account.account.settings.locale);
    const timezone = computed(() => store.getters['core/timezone']);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);
    const currencies = computed(() => store.getters['core/currencies']);
    const defaultCurrency = computed(() => store.state.account.account.settings.currency);

    const onAddInvoiceItem = () => {
      invoiceItems.value = [
        ...invoiceItems.value,
        { ...DEFAULT_INVOICE_ITEM },
      ];

      formRef.value.setFieldValue('invoiceItems', invoiceItems.value);
    };

    const onRemoveInvoiceItem = (idx) => {
      invoiceItems.value = invoiceItems.value.filter((_, i) => i !== idx);

      formRef.value.setFieldValue('invoiceItems', invoiceItems.value);
    };

    const calculateInvoiceItems = (items, idx) => {
      const newItems = items.map((item, i) => {
        const discount = Math.min(item.discount, item.quantity * item.price);
        const net = item.quantity * item.price - discount;
        const gross = net * ((item.tax / 100) + 1);

        return {
          ...item,
          ...(idx === i
            ? { net, gross, discount }
            : {}),
        };
      });

      invoiceItems.value = newItems;

      formRef.value.setFieldValue('invoiceItems', newItems);
    };

    const getTotal = (items) => items.reduce((acc, { gross }) => acc + gross, 0);

    const onSubmit = (status = 'draft', values) => () => {
      store.dispatch('invoices/upsert', {
        ...values,
        status,
        invoiceType: 'invoice',
        taxNotation: 'vat',
      })
        .then(() => uikit.notify('success', i18n.t('documents.views.invoicesForm.successSave')))
        .then(() => store.dispatch('invoices/setInvoicesList'))
        .then(() => uikit.drawer.hide())
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            formRef.value.setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        });
    };

    const populateSellerInfo = () => {
      const payload = {
        sellerName: account.value.companyName,
        sellerTaxId: account.value.companyVatId,
        sellerAddress: account.value.companyAddress,
        sellerCity: account.value.companyCity,
        sellerZip: account.value.companyZip,
        sellerCountry: account.value.companyCountry,
      };

      Object.entries(payload)
        .forEach(([key, value]) => formRef.value.setFieldValue(key, value));
    };

    onMounted(() => {
      if (invoice.value) {
        formRef.value.setValues({
          ...invoice.value,
        });
        invoiceItems.value = invoice.value.invoiceItems;
      } else {
        populateSellerInfo();
        formRef.value.setFieldValue('invoiceItems', invoiceItems.value);
      }
    });

    return {
      countries,
      invoiceItems,
      paymentTypes,
      invoice,
      expectedInvoiceNo,
      properties,
      account,
      locale,
      timezone,
      dateFormat,
      formRef,
      currencies,
      defaultCurrency,
      calculateInvoiceItems,

      handleSubmitClick,
      formatCurrency,
      formatDate,
      formatCountryName,
      onAddInvoiceItem,
      onRemoveInvoiceItem,
      onSubmit,
      getTotal,
    };
  },
};
</script>

<style lang="scss" scoped>
.invoices {
  &__container {
    padding: 20px;

    &.--bordered {
      border-bottom: 1px solid rgba($alt-color, 0.2);
    }
  }
  &__table {
    width: 100%;
    border-collapse: collapse;

    thead th {
      color: rgba($base-color-darken, 0.5);
      font-size: 0.75rem;
      font-weight: 400;
      text-transform: uppercase;
      text-align: left;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba($alt-color, 0.1);
    }

    tbody td {
      padding: 4px 2px;

      &:first-child {
        padding-left: 0;
      }
      &:last-child {
        padding-right: 0;
      }
    }

    .name {
      width: 140px;
    }

    .uk-button--add {
      font-size: 0.75rem;
    }

    .footer-total {
      font-size: 0.875rem;
    }
  }
}
.half-grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
}

.triple-grid {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;

  .--double-gap {
    grid-column-start: 1;
    grid-column-end: 3;
  }
}
</style>
