import { createRouter, createWebHistory } from 'vue-router';

import accountRoutes from '@/modules/account/routes';
import authRoutes from '@/modules/auth/routes';
import billingRoutes from '@/modules/billing/routes';
import bookingsRoutes from '@/modules/bookings/routes';
import calendarRoutes from '@/modules/calendar/routes';
import channelsRoutes from '@/modules/channels/routes';
import dashboardRoutes from '@/modules/dashboard/routes';
import documentsRoutes from '@/modules/documents/routes';
import guestsRoutes from '@/modules/guests/routes';
import integrationsRoutes from '@/modules/integrations/routes';
import onboardingRoutes from '@/modules/onboarding/routes';
import organizationRoutes from '@/modules/organization/routes';
import ownersRoutes from '@/modules/owners/routes';
import rentalsRoutes from '@/modules/rentals/routes';
import settings from '@/modules/settings/routes';
import statisticsRoutes from '@/modules/statistics/routes';
import storageRoutes from '@/modules/storage/routes';
import teamRoutes from '@/modules/team/routes';
import websitesRoutes from '@/modules/websites/routes';
import errorsRoutes from '@/modules/errors/routes';

import { hasAccess, LIMITS } from '@/utils/acl';
import store from './store';

const routes = [
  ...accountRoutes,
  ...authRoutes,
  ...billingRoutes,
  ...bookingsRoutes,
  ...calendarRoutes,
  ...channelsRoutes,
  ...dashboardRoutes,
  ...documentsRoutes,
  ...guestsRoutes,
  ...integrationsRoutes,
  ...onboardingRoutes,
  ...organizationRoutes,
  ...ownersRoutes,
  ...rentalsRoutes,
  ...settings,
  ...statisticsRoutes,
  ...storageRoutes,
  ...teamRoutes,
  ...websitesRoutes,
  ...errorsRoutes,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (Object.prototype.hasOwnProperty.call(to.meta, 'requiresAuth')) {
    if (to.meta.requiresAuth && !store.state.auth.isLoggedIn) {
      return next({ name: 'signin' });
    }

    if (!to.meta.requiresAuth && store.state.auth.isLoggedIn) {
      return next('/');
    }
  }

  if (to.matched && to.matched[0].path === '/errors') {
    return next();
  }

  if (
    to.name !== 'verification-phone'
    && hasAccess(store.state.core.limits, LIMITS.APP_PHONE_VERIFICATION_ENABLED)
    && store.state.account.user
    && !store.state.account.user.phoneNumberVerifiedAt
  ) {
    return next({ name: 'verification-phone' });
  }

  if (!hasAccess(store.state.core.limits, to.meta.limitName, store.state.account.user, to.meta.moduleName)) {
    return next('/');
  }

  return next();
});

export default router;
