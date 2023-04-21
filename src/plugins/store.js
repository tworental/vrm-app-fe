import LogRocket from 'logrocket';
import createPlugin from 'logrocket-vuex';
import { createStore } from 'vuex';

import account from '@/modules/account/store';
import auth from '@/modules/auth/store';
import billing from '@/modules/billing/store';
import bookings from '@/modules/bookings/store';
import calendar from '@/modules/calendar/store';
import channels from '@/modules/channels/store';
import core from '@/modules/core/store';
import dashboard from '@/modules/dashboard/store';
import documents from '@/modules/documents/store';
import guests from '@/modules/guests/store';
import integrations from '@/modules/integrations/store';
import onboarding from '@/modules/onboarding/store';
import owners from '@/modules/owners/store';
import rentals from '@/modules/rentals/store';
import settings from '@/modules/settings/store';
import statistics from '@/modules/statistics/store';
import storage from '@/modules/storage/store';
import team from '@/modules/team/store';
import websites from '@/modules/websites/store';

export default createStore({
  modules: {
    account,
    auth,
    billing,
    bookings,
    calendar,
    channels,
    core,
    dashboard,
    documents,
    guests,
    integrations,
    onboarding,
    owners,
    rentals,
    settings,
    statistics,
    storage,
    team,
    websites,
  },
  plugins: [createPlugin(LogRocket)],
});
