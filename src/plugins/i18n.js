import { createI18n } from 'vue-i18n';

import coreI18n from '@/modules/core/i18n';
import accountI18n from '@/modules/account/i18n';
import authI18n from '@/modules/auth/i18n';
import billingI18n from '@/modules/billing/i18n';
import bookingsI18n from '@/modules/bookings/i18n';
import calendarI18n from '@/modules/calendar/i18n';
import channelsI18n from '@/modules/channels/i18n';
import dashboardI18n from '@/modules/dashboard/i18n';
import documentsI18n from '@/modules/documents/i18n';
import guestsI18n from '@/modules/guests/i18n';
import integrationsI18n from '@/modules/integrations/i18n';
import onboardingI18n from '@/modules/onboarding/i18n';
import organizationI18n from '@/modules/organization/i18n';
import ownersI18n from '@/modules/owners/i18n';
import rentalsI18n from '@/modules/rentals/i18n';
import settingsI18n from '@/modules/settings/i18n';
import statisticsI18n from '@/modules/statistics/i18n';
import storageI18n from '@/modules/storage/i18n';
import teamI18n from '@/modules/team/i18n';
import websitesI18n from '@/modules/websites/i18n';
import errorsI18n from '@/modules/errors/i18n';

const fallbackLocale = process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en';

const availableLocales = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',');

const matches = document.cookie.match(new RegExp('(^| )lang=([^;]+)'));

const locale = matches && availableLocales.includes(matches[2])
  ? matches[2]
  : (process.env.VUE_APP_I18N_LOCALE || fallbackLocale);

export default createI18n({
  legacy: true,
  locale,
  availableLocales,
  fallbackLocale,
  messages: availableLocales.reduce((stack, lang) => ({
    ...stack,
    [lang]: [
      coreI18n,
      accountI18n,
      authI18n,
      billingI18n,
      bookingsI18n,
      calendarI18n,
      channelsI18n,
      dashboardI18n,
      documentsI18n,
      guestsI18n,
      integrationsI18n,
      onboardingI18n,
      organizationI18n,
      ownersI18n,
      rentalsI18n,
      settingsI18n,
      statisticsI18n,
      storageI18n,
      teamI18n,
      websitesI18n,
      errorsI18n,
    ].reduce((acc, curr) => ({ ...acc, ...(curr[lang] || {}) }), {}),
  }), {}),
});
