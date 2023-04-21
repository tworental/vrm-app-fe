import gAuth from 'vue3-google-auth';

export const loadGoogleMapScript = async (apiKey, lang) => {
  const GOOGLE_MAPS_API = 'google-maps-api';

  const el = document.getElementById(GOOGLE_MAPS_API);

  return new Promise((resolve, reject) => {
    if (el) {
      resolve();
      return;
    }

    const link = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${lang}`;
    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_API;
    script.src = link;
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.body.append(script);
  });
};

export const getAddress = (place) => {
  const keys = [
    { key: 'country', gMapKey: 'country', label: 'long_name' },
    { key: 'countryIsoCode', gMapKey: 'country', label: 'short_name' },
    { key: 'city', gMapKey: 'locality', label: 'long_name' },
    { key: 'stateProvince', gMapKey: 'administrative_area_level_1', label: 'long_name' },
    { key: 'street1', gMapKey: 'route', label: 'long_name' },
    { key: 'street2', gMapKey: 'street_number', label: 'long_name' },
    { key: 'zipCode', gMapKey: 'postal_code', label: 'short_name' },
  ];

  const addressComponents = place.address_components;

  const payload = keys.reduce((acc, curr) => {
    const address = addressComponents.find((item) => item.types.includes(curr.gMapKey));
    return {
      ...acc,
      [curr.key]: address ? (address[curr.label] || '') : '',
    };
  });

  return {
    ...payload,
    cityPlaceId: place.place_id,
    formattedAddress: place.formatted_address,
  };
};

export const getCurrentPosition = (timeout = 5000) => new Promise(((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(resolve, reject, { timeout });
}));

export const createGAuth = (googleOauth) => gAuth.createGAuth({
  clientId: googleOauth.clientId,
});

export default {
  loadGoogleMapScript,
  getAddress,
  getCurrentPosition,
  createGAuth,
};
