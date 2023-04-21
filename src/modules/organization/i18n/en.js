export default {
  organization: {
    shared: {
      name: 'Name',
      companyAddress: 'Address',
      companyCountry: 'Country',
      companyCity: 'City',
      companyZip: 'ZIP',
      companyVatId: 'Vat ID',
      uiLanguage: 'UI Language',
      timezone: 'Timezone',
      currency: 'Currency',
      currencyTooltip: 'The selected currency will be a default currency for your property rates. You can adjust them in the Property creation screen (Rates page)',
      measuringUnits: 'Measuring Units',
      dateFormat: 'Date Format',
      form: {
        domainSettings: {
          title: 'Domain Settings',
          description: 'Add or edit your Identifier name',
        },
        globalSettings: {
          title: 'Global Settings',
          description: 'Add or edit your Settings',
        },
        companyData: {
          title: 'Company Details',
          description: 'Add or edit your Company Details',
        },
      },
      btn: {
        save: 'Save',
      },
      identifier: 'Identifier Name',
    },
    views: {
      main: {
        title: 'Organization',
      },
    },
    components: {
      domainSettings: {
        successUpdate: 'Your domain settings have been updated successfully!',
      },
      globalSettings: {
        successUpdate: 'Your global settings have been updated successfully!',
      },
      companySettings: {
        successUpdate: 'Your company data has been updated successfully!',
      },
    },
    dicts: {
      languages: {
        en: 'English',
        ru: 'Russian',
      },
      measuringUnits: {
        imperial: 'Imperial (US)',
        metric: 'Metric (EU)',
      },
      dateFormats: {
        auto: 'Auto',
      },
    },
  },
};
