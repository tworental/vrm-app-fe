import customerContacts from './customerContacts';
import services from './services';
import salesChannels from './salesChannels';
import serviceProviders from './serviceProviders';
import fees from './fees';
import taxes from './taxes';
import seasonRates from './seasonRates';

export default {
  namespaced: true,
  modules: {
    customerContacts,
    services,
    salesChannels,
    serviceProviders,
    fees,
    taxes,
    seasonRates,
  },
  state: {},
  actions: {},
  mutations: {},
};
