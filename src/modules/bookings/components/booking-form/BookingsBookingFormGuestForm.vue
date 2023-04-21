<template>
  <v-form
    name="booking-guest"
    ref="formRef"
    @submit="onSubmit"
    v-e2e
    class="uk-height-1-1 guest-form "
    v-slot="{ validate, values, errors, setValues }"
  >
    <core-layout-content :displayContent="true">
      <template #default>
        <core-drawer-content>
          <div class="guest-form__content">
            <div class="uk-flex uk-flex-middle uk-margin-bottom">
              <core-svg
                :width="24"
                :src="require('@/assets/images/icons/guests.svg')"
              />
              <h3 class="guest-form__title">{{ $t('bookings.components.bookingFormGuestForm.addGuest') }}</h3>
            </div>
            <div class="address-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.title }" for="title">
                  {{ $t('bookings.components.bookingFormGuestForm.title') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="title"
                    name="title"
                    :class="{ '--invalid': errors.title }"
                    :label="$t('bookings.components.bookingFormGuestForm.title')"
                    rules="required"
                    :data="titles"
                    :value="values.title"
                    :search="false"
                  />
                  <v-error-message class="input-error-message" name="title" />
                </div>
              </div>

              <core-form-autocomplete
                id="fullName"
                class="uk-margin-bottom"
                :data="guests"
                :label="$t('bookings.components.bookingFormGuestForm.fullName')"
                field="fullName"
                name="fullName"
                rules="required|min:5|max:201|full_name"
                :value="values.fullName"
                @search="searchGuests($event)"
                @select="onSelectGuest($event); $event && setValues({ ...values, ...$event })"
              >
                <template #item="slotProps">
                  <div>
                    {{ slotProps.item.firstName }}
                    {{ slotProps.item.lastName }}
                    ({{ slotProps.item.phoneNumber }})
                  </div>
                </template>
              </core-form-autocomplete>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                  {{ $t('bookings.components.bookingFormGuestForm.email') }}
                </label>
                <div class="input-container">
                  <v-field
                    id="email"
                    mode="value"
                    name="email"
                    as="input"
                    class="uk-input --outline"
                    :class="{ '--invalid': errors.email }"
                    :placeholder="$t('bookings.components.bookingFormGuestForm.email')"
                    :label="$t('bookings.components.bookingFormGuestForm.email')"
                    rules="required|email"
                    v-e2e
                  />
                  <v-error-message class="input-error-message" name="email" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label --required" :class="{ '--invalid': errors.phoneNumber }" for="phoneNumber">
                  {{ $t('bookings.components.bookingFormGuestForm.phoneNumber') }}
                </label>
                <div class="input-container">
                  <core-form-phone-number
                    id="phoneNumber"
                    name="phoneNumber"
                    v-e2e
                    :value="values.phoneNumber"
                    :placeholder="$t('bookings.components.bookingFormGuestForm.phoneNumber')"
                    :label="$t('bookings.components.bookingFormGuestForm.phoneNumber')"
                  />
                  <v-error-message class="input-error-message" name="phoneNumber" />
                </div>
              </div>
            </div>

            <div class="half-grid">
              <div class="uk-margin-bottom">
                <label
                  class="input-label --required"
                  :class="{ '--invalid': errors.countryCode }"
                  for="countryResidence"
                >
                  {{ $t('bookings.components.bookingFormGuestForm.countryResidence') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="countryResidence"
                    name="countryCode"
                    :class="{ '--invalid': errors.countryCode }"
                    :label="$t('bookings.components.bookingFormGuestForm.countryResidence')"
                    rules="required"
                    :data="countries"
                    :value="values.countryCode"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="countryCode" />
                </div>
              </div>

              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.citizenship }" for="citizenship">
                  {{ $t('bookings.components.bookingFormGuestForm.citizenship') }}
                </label>
                <div class="input-container">
                  <core-form-select
                    id="citizenship"
                    name="citizenship"
                    :class="{ '--invalid': errors.citizenship }"
                    :label="$t('bookings.components.bookingFormGuestForm.citizenship')"
                    :data="countries"
                    :value="values.citizenship"
                    :search="true"
                  />
                  <v-error-message class="input-error-message" name="citizenship" />
                </div>
              </div>
            </div>

            <div class="half-grid" v-if="companiesEnabled">
              <div class="uk-margin-bottom">
                <label class="input-label" :class="{ '--invalid': errors.type }" for="guestType">
                  {{ $t('bookings.components.bookingFormGuestForm.guestType') }}
                </label>
                <div class="gender">
                  <core-form-radio-group
                    id="guestType"
                    name="type"
                    :items="guestTypes"
                    :value="values.type || TYPES.PRIVATE"
                    :label="$t('bookings.components.bookingFormGuestForm.guestType')"
                  />
                  <v-error-message class="input-error-message" name="type" />
                </div>
              </div>

              <div class="uk-margin-bottom" v-if="values.type === TYPES.BUSINESS">
                <label class="input-label" :class="{ '--invalid': errors.vatType }" for="vatType">
                  {{ $t('bookings.components.bookingFormGuestForm.vatType') }}
                </label>
                <div class="gender">
                  <core-form-radio-group
                    id="vatType"
                    name="vatType"
                    :items="vatTypes"
                    :value="values.vatType || VAT_TYPES.LOCAL_VAT"
                    :label="$t('bookings.components.bookingFormGuestForm.vatType')"
                  />
                  <v-error-message class="input-error-message" name="vatType" />
                </div>
              </div>
            </div>
          </div>

          <ul uk-accordion id="guests-accordion" class="uk-margin-remove uk-padding-remove">
            <li class="panel">
              <div class="uk-accordion-title panel__header">
                <div>
                  <div class="uk-flex uk-flex-middle">
                    <core-svg
                      :width="20"
                      :src="require('@/assets/images/icons/house-person.svg')"
                    />
                    <h3 class="panel__title uk-margin-small-left">
                      {{ $t('bookings.components.bookingFormGuestForm.additionalForm') }}
                    </h3>
                  </div>
                </div>
                <div>
                  <core-svg
                    width="12"
                    class="arrow"
                    :src="require('@/assets/images/icons/arrow-down.svg')" />
                </div>
              </div>
              <div class="uk-accordion-content panel__content uk-margin-remove">
                <div>
                  <div class="half-grid">
                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.gender }" for="gender">
                        {{ $t('guests.shared.gender') }}
                      </label>
                      <div class="gender">
                        <core-form-radio-group
                          id="gender"
                          name="gender"
                          :items="genderItems"
                          :value="values.gender"
                          :label="$t('bookings.components.bookingFormGuestForm.gender')"
                        />
                        <v-error-message class="input-error-message" name="gender" />
                      </div>
                    </div>

                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.parlance }" for="parlance">
                        {{ $t('bookings.components.bookingFormGuestForm.parlance') }}
                      </label>
                      <div class="input-container">
                        <core-form-tags
                          id="parlance"
                          name="parlance"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.parlance')"
                          :only-autocomplete="true"
                          :data="langs"
                          :value="values.parlance"
                        />
                        <v-error-message class="input-error-message" name="parlance" />
                      </div>
                    </div>
                  </div>

                  <div class="half-grid">
                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.birthDate }" for="birthDate">
                        {{ $t('bookings.components.bookingFormGuestForm.birthDate') }}
                      </label>
                      <div class="input-container">
                        <core-form-datepicker
                          id="birthDate"
                          name="birthDate"
                          :min="formatDateForInput(minBirthday)"
                          :max="formatDateForInput(maxBirthday)"
                          :rules="'max_date:' + maxDateRule"
                          :label="$t('bookings.components.bookingFormGuestForm.birthDate')"
                          :value="values.birthDate"
                        />
                        <v-error-message class="input-error-message" name="birthDate" />
                      </div>
                    </div>

                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.birthPlace }" for="birthPlace">
                        {{ $t('bookings.components.bookingFormGuestForm.birthPlace') }}
                      </label>
                      <div class="input-container">
                        <v-field
                          id="birthPlace"
                          name="birthPlace"
                          as="input"
                          v-e2e
                          class="uk-input --outline"
                          :class="{ '--invalid': errors.birthPlace }"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.birthPlace')"
                          :label="$t('bookings.components.bookingFormGuestForm.birthPlace')"
                          rules="max:191"
                        />
                        <v-error-message class="input-error-message" name="birthPlace" />
                      </div>
                    </div>
                  </div>

                  <div class="half-grid">
                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.documentType }" for="documentType">
                        {{ $t('bookings.components.bookingFormGuestForm.documentType') }}
                      </label>
                      <div class="input-container">
                        <core-form-select
                          id="documentType"
                          name="documentType"
                          :class="{ '--invalid': errors.documentType }"
                          :label="$t('bookings.components.bookingFormGuestForm.documentType')"
                          :data="documentTypes"
                        />
                        <v-error-message class="input-error-message" name="documentType" />
                      </div>
                    </div>

                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.documentNumber }" for="documentNumber">
                        {{ $t('bookings.components.bookingFormGuestForm.documentNumber') }}
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
                          :placeholder="$t('bookings.components.bookingFormGuestForm.documentNumber')"
                          :label="$t('bookings.components.bookingFormGuestForm.documentNumber')"
                          rules="max:15"
                        />
                        <v-error-message class="input-error-message" name="documentNumber" />
                      </div>
                    </div>
                  </div>

                  <div class="half-grid divider">
                    <div class="uk-margin-bottom">
                      <label
                        class="input-label"
                        :class="{ '--invalid': errors.documentIssuedDate }"
                        for="documentIssuedDate"
                      >
                        {{ $t('bookings.components.bookingFormGuestForm.documentIssuedDate') }}
                      </label>
                      <div class="input-container">
                        <core-form-datepicker
                          id="documentIssuedDate"
                          name="documentIssuedDate"
                          :max="formatDateForInput(new Date())"
                          :rules="'max_date:' + maxDocumentIssuedDateRule"
                          :label="$t('bookings.components.bookingFormGuestForm.documentIssuedDate')"
                          :value="values.documentIssuedDate"
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
                        {{ $t('bookings.components.bookingFormGuestForm.documentExpiryDate') }}
                      </label>
                      <div class="input-container">
                        <core-form-datepicker
                          id="documentExpiryDate"
                          name="documentExpiryDate"
                          :min="formatDateForInput(new Date())"
                          :rules="'min_date:' + minDocumentExpiryDateRule"
                          :label="$t('bookings.components.bookingFormGuestForm.documentExpiryDate')"
                          :value="values.documentExpiryDate"
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
                        {{ $t('bookings.components.bookingFormGuestForm.address') }}
                      </label>
                      <div class="input-container">
                        <v-field
                          id="address"
                          class="uk-input --outline"
                          name="address"
                          type="text"
                          :label="$t('bookings.components.bookingFormGuestForm.address')"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.address')"
                          :class="{ '--invalid': errors.address }"
                          v-e2e
                        />

                        <v-error-message class="input-error-message" name="address" />
                      </div>
                    </div>

                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.city }" for="city">
                        {{ $t('bookings.components.bookingFormGuestForm.city') }}
                      </label>
                      <div class="input-container">
                        <v-field
                          id="city"
                          name="city"
                          as="input"
                          v-e2e
                          class="uk-input --outline"
                          :class="{ '--invalid': errors.city }"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.city')"
                          :label="$t('bookings.components.bookingFormGuestForm.city')"
                          rules="max:191"
                        />
                        <v-error-message class="input-error-message" name="city" />
                      </div>
                    </div>
                  </div>

                  <div class="half-grid divider">
                    <div class="uk-margin-bottom">
                      <label class="input-label" :class="{ '--invalid': errors.region }" for="region">
                        {{ $t('bookings.components.bookingFormGuestForm.region') }}
                      </label>
                      <div class="input-container">
                        <v-field
                          id="region"
                          name="region"
                          as="input"
                          v-e2e
                          class="uk-input --outline"
                          :class="{ '--invalid': errors.region }"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.region')"
                          :label="$t('bookings.components.bookingFormGuestForm.region')"
                          rules="max:191"
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
                        {{ $t('bookings.components.bookingFormGuestForm.zip') }}
                      </label>
                      <div class="input-container">
                        <v-field
                          id="zip"
                          class="uk-input --outline"
                          name="zip"
                          type="text"
                          :label="$t('bookings.components.bookingFormGuestForm.zip')"
                          :placeholder="$t('bookings.components.bookingFormGuestForm.zip')"
                          :class="{ '--invalid': errors.zip }"
                          v-e2e
                        />

                        <v-error-message class="input-error-message" name="zip" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="input-label" :class="{ '--invalid': errors.notes }" for="notes">
                      {{ $t('bookings.components.bookingFormGuestForm.notes') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="notes"
                        mode="value"
                        name="notes"
                        as="textarea"
                        v-e2e
                        class="uk-textarea --outline"
                        :class="{ '--invalid': errors.notes }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.notes')"
                        :label="$t('bookings.components.bookingFormGuestForm.notes')"
                        rows="5"
                      />
                      <v-error-message class="input-error-message" name="notes" />
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li class="panel" v-if="companiesEnabled && values.type === TYPES.BUSINESS">
              <div class="uk-accordion-title panel__header">
                <div>
                  <div class="uk-flex uk-flex-middle">
                    <core-svg
                      :width="20"
                      :src="require('@/assets/images/icons/company-data.svg')"
                    />
                    <h3 class="panel__title uk-margin-small-left">
                      {{ $t('bookings.components.bookingFormGuestForm.companyData') }}
                    </h3>
                  </div>
                </div>
                <div>
                  <core-svg
                    width="12"
                    class="arrow"
                    :src="require('@/assets/images/icons/arrow-down.svg')" />
                </div>
              </div>
              <div class="uk-accordion-content panel__content uk-margin-remove">
                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors['company.name'] }"
                      for="companyName"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyName') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyName"
                        name="company.name"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.name'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyName')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyName')"
                        rules="required|max:191"
                        :value="company?.name"
                      />
                      <v-error-message class="input-error-message" name="company.name" />
                    </div>
                  </div>

                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.type'] }"
                      for="companyType"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyType') }}
                    </label>
                    <div class="gender">
                      <core-form-radio-group
                        id="companyType"
                        name="company.type"
                        :items="companyTypes"
                        :value="company?.type || COMPANY_TYPES.COMPANY"
                        :label="$t('bookings.components.bookingFormGuestForm.companyType')"
                      />
                      <v-error-message class="input-error-message" name="company.type" />
                    </div>
                  </div>
                </div>

                <div class="half-grid divider">
                  <div class="uk-margin-bottom">
                    <label class="input-label" :class="{ '--invalid': errors['company.email'] }" for="companyEmail">
                      {{ $t('bookings.components.bookingFormGuestForm.companyEmail') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyEmail"
                        name="company.email"
                        as="input"
                        type="email"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.email'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyEmail')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyEmail')"
                        rules="max:191"
                        :value="company?.email"
                      />
                      <v-error-message class="input-error-message" name="company.email" />
                    </div>
                  </div>

                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.phoneNumber'] }"
                      for="company.phoneNumber"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyPhoneNumber') }}
                    </label>
                    <div class="input-container">
                      <core-form-phone-number
                        id="company.phoneNumber"
                        name="company.phoneNumber"
                        v-e2e
                        :value="company?.phoneNumber"
                        :required="false"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyPhoneNumber')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyPhoneNumber')"
                      />
                      <v-error-message class="input-error-message" name="company.phoneNumber" />
                    </div>
                  </div>
                </div>

                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.address'] }"
                      for="companyAddress"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyAddress') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyAddress"
                        name="company.address"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.address'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyAddress')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyAddress')"
                        rules="max:191"
                      />
                      <v-error-message class="input-error-message" name="company.address" />
                    </div>
                  </div>

                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.city'] }"
                      for="companyCity"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyCity') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyCity"
                        name="company.city"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.city'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyCity')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyCity')"
                        rules="max:191"
                      />
                      <v-error-message class="input-error-message" name="company.city" />
                    </div>
                  </div>
                </div>

                <div class="half-grid">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.region'] }"
                      for="companyRegion"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyRegion') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyRegion"
                        name="company.region"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.region'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyRegion')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyRegion')"
                        rules="max:191"
                        :value="company?.region"
                      />
                      <v-error-message class="input-error-message" name="company.region" />
                    </div>
                  </div>

                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.zip'] }"
                      for="companyZip"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyZip') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyZip"
                        name="company.zip"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.zip'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyZip')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyZip')"
                        rules="max:191"
                        :value="company?.zip"
                      />
                      <v-error-message class="input-error-message" name="company.zip" />
                    </div>
                  </div>
                </div>

                <div class="half-grid divider">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.countryCode'] }"
                      for="companyCountry"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyCountry') }}
                    </label>
                    <div class="input-container">
                      <core-form-select
                        id="companyCountry"
                        name="company.countryCode"
                        :class="{ '--invalid': errors['company.countryCode'] }"
                        :label="$t('bookings.components.bookingFormGuestForm.companyCountry')"
                        :data="countries"
                        :value="company?.countryCode"
                        :search="true"
                      />
                      <v-error-message class="input-error-message" name="company.countryCode" />
                    </div>
                  </div>
                </div>

                <div class="half-grid divider">
                  <div class="uk-margin-bottom">
                    <label
                      class="input-label --required"
                      :class="{ '--invalid': errors['company.vatId'] }"
                      for="companyVatId"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyVatId') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyVatId"
                        name="company.vatId"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.vatId'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyVatId')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyVatId')"
                        rules="required|check_regex:vatId"
                        :value="company?.vatId"
                      />
                      <v-error-message class="input-error-message" name="company.vatId" />
                    </div>
                  </div>

                  <div class="uk-margin-bottom">
                    <label
                      class="input-label"
                      :class="{ '--invalid': errors['company.registrationNumber'] }"
                      for="companyRegistrationNumber"
                    >
                      {{ $t('bookings.components.bookingFormGuestForm.companyRegistrationNumber') }}
                    </label>
                    <div class="input-container">
                      <v-field
                        id="companyRegistrationNumber"
                        name="company.registrationNumber"
                        as="input"
                        v-e2e
                        class="uk-input --outline"
                        :class="{ '--invalid': errors['company.registrationNumber'] }"
                        :placeholder="$t('bookings.components.bookingFormGuestForm.companyRegistrationNumber')"
                        :label="$t('bookings.components.bookingFormGuestForm.companyRegistrationNumber')"
                        rules="max:191"
                        :value="company?.registrationNumber"
                      />
                      <v-error-message class="input-error-message" name="company.registrationNumber" />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    class="input-label"
                    :class="{ '--invalid': errors['company.notes'] }"
                    for="company.notes"
                  >
                    {{ $t('bookings.components.bookingFormGuestForm.companyNotes') }}
                  </label>
                  <div class="input-container">
                    <v-field
                      id="company.notes"
                      mode="value"
                      name="company.notes"
                      as="textarea"
                      v-e2e
                      class="uk-textarea --outline"
                      :class="{ '--invalid': errors['company.notes'] }"
                      :placeholder="$t('bookings.components.bookingFormGuestForm.companyNotes')"
                      :label="$t('bookings.components.bookingFormGuestForm.companyNotes')"
                      rows="5"
                      :value="company?.notes"
                    />
                    <v-error-message class="input-error-message" name="company.notes" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </core-drawer-content>
      </template>
      <template #footer>
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
            @click="handleSubmitClick({ validate, onInvalid })"
          >
            {{ $t('bookings.shared.' + (isLastStep ? 'saveAndClose' : 'saveAndNext')) }}
          </button>
        </div>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { ErrorMessage, Field, Form } from 'vee-validate';
import COUNTRIES from 'country-region-data';
import { useI18n } from 'vue-i18n';

import useKit from '@/modules/core/composables/uikit';
import dayjs from '@/utils/dayjs';
import { handleSubmitClick, scrollToFirstInvalidControl } from '@/utils/form';
import { DOCUMENT_TYPES } from '@/modules/core/services';
import { TITLES, TYPES, VAT_TYPES } from '@/modules/guests/services/guests';
import { COMPANY_TYPES } from '@/modules/guests/services/companies';
import { formatDate, formatDateForInput, LANG_ISO_CODES } from '@/utils/intl';
import { hasAccess, LIMITS } from '@/utils/acl';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreFormSelect from '@/modules/core/components/core-form/CoreFormSelect.vue';
import CoreFormPhoneNumber from '@/modules/core/components/core-form/CoreFormPhoneNumber.vue';
import CoreFormRadioGroup from '@/modules/core/components/core-form/CoreFormRadioGroup.vue';
import CoreFormTags from '@/modules/core/components/core-form/CoreFormTags.vue';
import CoreFormDatepicker from '@/modules/core/components/core-form/CoreFormDatepicker.vue';
import CoreFormAutocomplete from '@/modules/core/components/core-form/CoreFormAutocomplete.vue';

export default {
  name: 'BookingsBookingFormGuestForm',
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerContent,
    CoreFormSelect,
    CoreFormPhoneNumber,
    CoreFormRadioGroup,
    CoreFormTags,
    CoreFormDatepicker,
    CoreFormAutocomplete,
  },
  props: {
    bookingId: Number,
    isLastStep: Boolean,
  },
  emits: ['save'],
  setup(props, { emit }) {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const { formErrorFormatter } = useApiFormatters();

    const additionalForm = ref(false);
    const existedGuest = ref(null);
    const formRef = ref(null);

    const genderItems = [
      { label: i18n.t('core.dicts.gender.m'), value: 'm' },
      { label: i18n.t('core.dicts.gender.f'), value: 'f' },
      { label: i18n.t('core.dicts.gender.other'), value: 'other' },
    ];

    const guestTypes = Object.values(TYPES).map((title) => ({
      label: i18n.t(`guests.dicts.types.${title}`), value: title,
    }));

    const companyTypes = Object.values(COMPANY_TYPES).map((title) => ({
      label: i18n.t(`guests.dicts.companyTypes.${title}`), value: title,
    }));

    const titles = Object.values(TITLES).map((title) => ({
      label: i18n.t(`guests.dicts.titles.${title}`), value: title,
    }));

    const documentTypes = Object.values(DOCUMENT_TYPES).map((documentType) => ({
      label: i18n.t(`guests.dicts.documentTypes.${documentType}`), value: documentType,
    }));

    const vatTypes = Object.values(VAT_TYPES).map((vatType) => ({
      label: i18n.t(`guests.dicts.vatTypes.${vatType}`), value: vatType,
    }));

    const langs = LANG_ISO_CODES.map((lang) => ({ label: i18n.t(`guests.dicts.langs.${lang}`), value: lang }));

    const countries = COUNTRIES.map((country) => ({ label: country.countryName, value: country.countryShortCode }));

    const minBirthday = dayjs().subtract(118, 'years');
    const maxBirthday = dayjs().subtract(18, 'years');

    const limits = computed(() => store.state.core.limits);
    const user = computed(() => store.state.account.user);
    const guests = computed(() => store.state.guests.guests.search);
    const company = computed(() => store.state.guests.companies.entity);
    const booking = computed(() => store.state.bookings.entity);
    const locale = computed(() => store.state.account.account.settings.locale);
    const dateFormat = computed(() => store.state.account.account.settings.dateFormat);

    // const timezone = computed(() => store.getters['core/timezone']);
    const maxDateRule = computed(() => `${formatDateForInput(maxBirthday)},${formatDate(maxBirthday, locale.value, undefined, dateFormat.value, false)}`);
    const maxDocumentIssuedDateRule = computed(() => `${formatDateForInput(new Date())},${formatDate(new Date(), locale.value, undefined, dateFormat.value, false)}`);
    const minDocumentExpiryDateRule = computed(() => `${formatDateForInput(new Date())},${formatDate(new Date(), locale.value, undefined, dateFormat.value, false)}`);
    const companiesEnabled = computed(() => hasAccess(limits.value, LIMITS.APP_COMPANIES_ENABLED, user.value));

    const selectCompany = (guest) => {
      if (guest.companyId) {
        store.dispatch('guests/companies/setEntity', guest.companyId)
          .then(() => formRef.value.setFieldValue('company', company.value));
      }
    };

    onMounted(() => {
      if (booking.value && booking.value.guest) {
        store.dispatch('guests/guests/setGuestById', booking.value.guest.guestId)
          .then((guest) => {
            selectCompany(guest);

            formRef.value.setValues({
              ...booking.value.guest,
              ...guest,
              fullName: booking.value.guest.fullName,
              notes: booking.value.guest.notes,
              documentIssuedDate: formatDateForInput(guest.documentIssuedDate) || undefined,
              documentExpiryDate: formatDateForInput(guest.documentExpiryDate) || undefined,
            });
          });
      }
    });

    const getGuestHandler = ({ fullName, ...values }) => {
      const [firstName, lastName] = fullName.split(' ');
      if (existedGuest.value || (booking.value && booking.value.guest)) {
        return store.dispatch('guests/guests/updateGuest', {
          id: existedGuest.value?.id || booking.value.guest.guestId,
          firstName,
          lastName,
          ...values,
        });
      }

      return store.dispatch('guests/guests/createGuest', {
        ...values,
        firstName,
        lastName,
      });
    };

    const getCompanyHandler = (data) => (data && companiesEnabled.value ? store.dispatch('guests/companies/upsert', data) : Promise.resolve())
      .catch((error) => {
        const errors = formErrorFormatter(error);

        if (Object.keys(errors).length) {
          formRef.value.setErrors(
            Object.fromEntries(
              Object.entries(errors).map(([label, value]) => [`company.${label}`, value]),
            ),
          );
          scrollToFirstInvalidControl();
        }
        throw error;
      });

    const onInvalid = (ctx) => {
      if (Object.keys(ctx.errors).some((key) => key.includes('company'))) {
        if (!uikit.accordions.isOpen('#guests-accordion', 1)) {
          uikit.accordions.toggle('#guests-accordion', 1);
        }
      }
    };

    const onSubmit = ({
      notes,
      company: companyPayload,
      vatType,
      ...values
    }) => {
      store.commit('bookings/SET_FORM_LOADING', true);

      getCompanyHandler(companyPayload)
        .then((companyData) => {
          if (companyData?.data?.id) {
            store.dispatch('guests/companies/setEntity', companyData?.data?.id);
          }

          const payload = {
            ...values,
            companyId: companyData?.data?.id,
          };

          return getGuestHandler(payload)
            .then(({ data }) => ((!booking.value || !booking.value.guest) ? store.dispatch('bookings/guests/create', {
              bookingId: props.bookingId,
              data: {
                guestId: data ? data.id : existedGuest.value?.id,
                notes,
                vatType,
              },
            }) : store.dispatch('bookings/guests/update', {
              id: booking.value.guest.id,
              bookingId: props.bookingId,
              data: {
                guestId: existedGuest.value?.id || booking.value.guest.guestId,
                notes,
                vatType: booking.value.guest?.vatType === vatType ? null : vatType,
              },
            })));
        })
        .then(() => emit('save'))
        .then(() => store.dispatch('bookings/setList'))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            formRef.value.setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('bookings/SET_FORM_LOADING', false));
    };

    const searchGuests = (event) => {
      store.dispatch('guests/guests/search', event.query);
    };

    const onSelectGuest = (event) => {
      existedGuest.value = event;
      if (event) {
        selectCompany(event);
      }
    };

    const onClose = () => uikit.drawer.hide();

    return {
      TYPES,
      VAT_TYPES,
      COMPANY_TYPES,
      formRef,
      additionalForm,
      genderItems,
      documentTypes,
      langs,
      countries,
      titles,
      guestTypes,
      companyTypes,
      minBirthday,
      maxBirthday,
      maxDateRule,
      maxDocumentIssuedDateRule,
      minDocumentExpiryDateRule,
      guests,
      company,
      vatTypes,
      companiesEnabled,

      onSubmit,
      onInvalid,
      handleSubmitClick,
      formatDateForInput,
      searchGuests,
      onSelectGuest,
      onClose,
    };
  },
};
</script>
