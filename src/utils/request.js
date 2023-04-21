import { serialize } from 'object-to-formdata';

const API_URI = process.env.VUE_APP_API_URI;

const getAccessToken = () => {
  const authenticateCookie = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));

  if (authenticateCookie) {
    return authenticateCookie[2];
  }
  return null;
};

const getHeaders = (headerName) => {
  const subdomain = window.location.host.split('.')[1]
    ? window.location.host.split('.')[0]
    : '';

  const accessToken = getAccessToken();

  const headers = {
    'X-Org-Id': process.env.VUE_APP_ORGANIZATION_ID ? process.env.VUE_APP_ORGANIZATION_ID : subdomain,
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: accessToken ? `Bearer ${getAccessToken()}` : undefined,
  };

  return headerName ? headers[headerName] : headers;
};

const getApiUrl = (path) => [API_URI, path].join('/');

const mapData = (data) => {
  if (typeof data === 'boolean') {
    return Number(data);
  }

  if (data === null) {
    return '';
  }

  if (Array.isArray(data) && !data.length) {
    return '';
  }

  return data;
};

const arrayToQuery = (params, key) => (Array.isArray(params) ? params : [])
  .reduce((acc, id, index) => ({ ...acc, [`${key}[${index}]`]: id }), {});

const safeEncodeData = (data) => Object.entries(data)
  .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(mapData(value))].join('='))
  .join('&');

const sanitizeParams = (params) => Object.entries(params).reduce((acc, [key, value]) => (
  (value === undefined || value === null) ? acc : ({ ...acc, [key]: value })
), {});

const safeEncodeJsonBody = (data, attr) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    return Object.entries(data).reduce((acc, [key, value]) => ({
      ...acc, ...safeEncodeJsonBody(mapData(value), attr ? `${attr}[${key}]` : key),
    }), {});
  }
  return { [attr]: mapData(data) };
};

const mapFormData = (data) => serialize(data, { nullsAsUndefineds: true });

const sendResponse = async (response) => {
  let results = { data: undefined, error: undefined };
  try {
    switch (response.headers.get('content-type')) {
      case 'application/zip':
        return await response.blob();

      default:
        results = await response.json();
    }
  // eslint-disable-next-line no-empty
  } catch (err) {}

  if (!response.ok) {
    // eslint-disable-next-line no-throw-literal
    throw ({ status: response.status, ...results.error });
  }
  return results;
};

const sendRequest = (path, method = 'GET', data = null, additionalHeaders = {}) => {
  const headers = {
    ...getHeaders(),
    ...additionalHeaders,
  };

  let body;

  if (data) {
    if (data instanceof FormData) {
      body = data;
      delete headers['Content-Type'];
    } else {
      body = safeEncodeData(
        safeEncodeJsonBody(data),
      );
    }
  }

  return fetch(getApiUrl(path), { body, headers, method })
    .then(sendResponse);
};

const sendRequestWithProgressTracking = (path, method, body, { onProgress }) => new Promise((res, rej) => {
  const xhr = new XMLHttpRequest();
  xhr.open(method || 'get', getApiUrl(path));

  const headers = {
    ...getHeaders(),
  };

  if (body instanceof FormData) {
    delete headers['Content-Type'];
  }

  Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));

  xhr.onload = (e) => res(e.target.responseText);
  xhr.onerror = rej;
  if (xhr.upload && onProgress) xhr.upload.onprogress = onProgress;
  // event.loaded / event.total * 100 ; //event.lengthComputable
  xhr.send(body);
});

const DEFAULT_SORT_KEY = 'id';
const DEFAULT_SORT_ORDER = 'asc';

export {
  DEFAULT_SORT_KEY,
  DEFAULT_SORT_ORDER,
  sendRequest,
  sendRequestWithProgressTracking,
  arrayToQuery,
  sanitizeParams,
  safeEncodeData,
  safeEncodeJsonBody,
  getHeaders,
  getApiUrl,
  getAccessToken,
  mapFormData,
};
