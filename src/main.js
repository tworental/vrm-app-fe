import { createApp } from 'vue';

import Sentry from './plugins/sentry';
import LogRocket from './plugins/logrocket';

import Core from './modules/core/Core.vue';
import directives from './directives';
import components from './components';
import plugins from './plugins';

import './registerServiceWorker';

import './assets/scss/main.scss';

(async () => {
  // TODO: Add a "ping" request to backend and check lost internet connection
  if (plugins.store.state.auth.isLoggedIn) {
    try {
      await Promise.all([
        plugins.store.dispatch('account/setAccount'),
        plugins.store.dispatch('account/setUser'),
        plugins.store.dispatch('core/setLimits'),
        plugins.store.dispatch('core/setConfig'),
      ]);

      const { user, account } = plugins.store.state.account;

      Sentry.setUser({
        id: user.id,
        accountId: account.id,
        email: user.email,
      });

      LogRocket.identify(user.id, {
        name: [user.firstName, user.lastName].join(' '),
        email: user.email,
        subscriptionType: account.packageId,
      });
    } catch (err) {
      if (err.message === 'Failed to fetch' || [500, 401, 403].includes(err.status)) {
        await plugins.store.dispatch('auth/signout').then(() => {
          switch (err.status) {
            case 500:
            case 403:
              window.top.location.href = `/errors/${err.status}`;
              break;
            default:
              window.top.location.href = '/';
          }
        });
      }
    }
  }

  const app = createApp(Core);

  Object.entries(directives).forEach(([name, directive]) => app.directive(name, directive));
  Object.entries(components).forEach(([name, component]) => app.component(name, component));
  Object.entries(plugins).forEach(([, plugin]) => app.use(plugin));

  app.config.errorHandler = (error) => {
    Sentry.captureException(error);
  };

  app.mount('#app');

  window.addEventListener('error', (event) => {
    Sentry.captureException(event);
  });

  window.addEventListener('unhandledrejection', (event) => {
    Sentry.captureException(event);
  });
})();
