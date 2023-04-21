import LogRocket from 'logrocket';

import Sentry from './sentry';
import release from '../utils/release';

if (process.env.VUE_APP_LOG_ROCKET_PROJECT) {
  LogRocket.init(process.env.VUE_APP_LOG_ROCKET_PROJECT, {
    release,
  });

  LogRocket.getSessionURL((sessionURL) => {
    Sentry.configureScope((scope) => {
      scope.setExtra('sessionURL', sessionURL);
    });
  });
}

export default LogRocket;
