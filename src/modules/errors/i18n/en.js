export default {
  errors: {
    views: {
      common: {
        btnBack: 'Go to Dashboard',
      },
      unauthorized: {
        type: '401',
        title: 'Error: 401 Unauthorized',
        description: 'Sorry, the page you\'re you looking for cannot be accessed.',
      },
      notFound: {
        type: '404',
        title: 'Error: 404 Page Not Found',
        description: 'Sorry, the page you\'re you looking for cannot be accessed.',
      },
      forbidden: {
        type: '403',
        title: 'Error: 403 Forbidden',
        description: 'Sorry, the page you\'re you looking for cannot be accessed.',
      },
      internal: {
        type: '500',
        title: 'Error: 500 Internal Server Error',
        description: 'Sorry, something went wrong. We are checking what is going on.',
      },
      badGateway: {
        type: '502',
        title: 'Error: 502 Bad Gateway Error',
        description: 'Sorry, we can not connect to the server. Plese check your internet connection.',
      },
    },
  },
};
