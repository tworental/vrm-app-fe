export const ABILITIES = Object.freeze({
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
});

// These data should be the same as backend has for (abilities) ACL
export const MODULES_PERMISSIONS_MAPPING = Object.freeze({
  ACCOUNT: 'account',
  BILLINGS: 'billings',
  BOOKINGS: 'bookings',
  INTEGRATIONS: 'integrations',
  DOCUMENTS_INVOICES: 'documentsInvoices',
  SETTINGS: 'settings',
  OWNERS: 'owners',
  GUESTS: 'guests',
  COMPANIES: 'companies',
  CHANNELS: 'channels',
  PROPERTIES: 'properties',
  STORAGE: 'storage',
  STATISTICS: 'statistics',
  USERS: 'users',
  RATE_SEASONS: 'rateSeasons',
  SALES_CHANNELS: 'salesChannels',
  CUSTOMER_CONTACTS: 'customerContacts',
  SERVICES: 'services',
  FEES: 'fees',
  TAXES: 'taxes',
  WEBSITES: 'websites',
});

// All modules in frontend
export const MODULES = Object.freeze({
  ...MODULES_PERMISSIONS_MAPPING,
  ORGANIZATION: 'organization',
  ONBOARDING: 'onboarding',
  PAYMENTS: 'payments',
  SERVICES_REMINDERS: 'services.reminders',
});

export const LIMITS = Object.freeze({
  APP_SETTINGS_ENABLED: 'account.module.settings.enabled',
  APP_ONBOARDING_ENABLED: 'account.module.onboarding.enabled',
  APP_BILLINGS_ENABLED: 'account.module.billings.enabled',
  APP_PHONE_VERIFICATION_ENABLED: 'account.module.auth.phoneVerification.enabled',
  APP_LANGUAGES_LIST: 'account.module.languages.list',
  APP_LANGUAGES_DEFAULT: 'account.module.languages.default',
  APP_STORAGE_ENABLED: 'account.module.storage.enabled',
  APP_STORAGE_QUOTA: 'account.module.storage.quota',
  APP_STORAGE_FILES_MAX_SIZE: 'account.module.storage.files.maxSize',
  APP_TEAM_ENABLED: 'account.module.team.enabled',
  APP_TEAM_SIZE_LIMIT: 'account.module.team.limit',
  APP_OWNERS_ENABLED: 'account.module.owners.enabled',
  APP_GUESTS_ENABLED: 'account.module.guests.enabled',
  APP_COMPANIES_ENABLED: 'account.module.companies.enabled',
  APP_BOOKINGS_ENABLED: 'account.module.bookings.enabled',
  APP_BOOKINGS_CALENDAR_ENABLED: 'account.module.calendar.enabled',
  APP_STATISTICS_ENABLED: 'account.module.statistics.enabled',
  APP_WEBSITE_BUILDER_ENABLED: 'account.module.websites.enabled',
  APP_DOCUMENTS_ENABLED: 'account.module.documents.enabled',
  APP_DOCUMENTS_INVOICES_ENABLED: 'account.module.documents.invoices.enabled',
  APP_INTEGRATIONS_ENABLED: 'account.module.integrations.enabled',
  APP_PROPERTIES_ENABLED: 'account.module.properties.enabled',
  APP_PROPERTIES_SIZE_LIMIT: 'account.module.properties.limit',
  APP_PROPERTIES_HOTEL_MODE_ENABLED: 'account.module.properties.hotelMode.enabled',
  APP_PROPERTIES_UNIT_TYPES_ENABLED: 'account.module.properties.unitTypes.enabled',
  APP_PROPERTIES_UNIT_TYPES_SIZE_LIMIT: 'account.module.properties.unitTypes.limit',
  APP_PROPERTIES_UNITS_ENABLED: 'account.module.properties.units.enabled',
  APP_PROPERTIES_UNITS_SIZE_LIMIT: 'account.module.properties.units.limit',
  APP_PROPERTIES_UNIT_TYPES_SEASONS_SIZE_LIMIT: 'account.module.properties.unitTypes.rateSeasons.limit',
  APP_CHANNELS_ENABLED: 'account.module.channels.enabled',
  APP_CHANNELS_CHANNEX_ENABLED: 'account.module.channels.channex.enabled',
  APP_SERVICES_ENABLED: 'account.module.services.enabled',
  APP_SERVICES_SIZE_LIMIT: 'account.module.services.limit',
  APP_SERVICES_REMINDERS_ENABLED: 'account.module.services.reminders.enabled',
  APP_SERVICES_REMINDERS_SIZE_LIMIT: 'account.module.services.reminders.limit',
  APP_FEES_ENABLED: 'account.module.fees.enabled',
  APP_FEES_SIZE_LIMIT: 'account.module.fees.limit',
  APP_TAXES_ENABLED: 'account.module.taxes.enabled',
  APP_TAXES_SIZE_LIMIT: 'account.module.taxes.limit',
  APP_RATE_SEASONS_ENABLED: 'account.module.rateSeasons.enabled',
  APP_RATE_SEASONS_SIZE_LIMIT: 'account.module.rateSeasons.limit',
  APP_SALES_CHANNELS_ENABLED: 'account.module.salesChannels.enabled',
});

export const can = (user, acl, actions = []) => {
  if (!user || !user.permissions) {
    throw new Error('User has not permissions attached!');
  }

  const abilities = Object.values(ABILITIES);
  const permissions = user.permissions[acl] || abilities;

  return permissions.some((item) => actions.includes(item));
};

export const hasAccess = (limits, limitName, user, acl) => {
  if (user?.permissions && acl && user.permissions[acl]) {
    if (!user.permissions[acl].includes(ABILITIES.READ)) {
      return false;
    }
  }

  if (Object.prototype.hasOwnProperty.call(limits || {}, limitName)) {
    return Number(limits[limitName]);
  }
  return true;
};

export const isQuotaExceeded = (limits, limitName, value) => {
  if (Object.prototype.hasOwnProperty.call(limits || {}, limitName)) {
    return Number(limits[limitName]) <= value;
  }
  return false;
};
