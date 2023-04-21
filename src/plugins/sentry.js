import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import release from '../utils/release';

if (process.env.VUE_APP_SENTRY_DNS) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DNS,
    release,
    environment: process.env.NODE_ENV,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.2,
  });

  Sentry.configureScope((scope) => {
    scope.setTag('version', process.env.APP_VERSION);
  });
}

export default Sentry;
