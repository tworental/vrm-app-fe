import { sendRequest } from '@/utils/request';

export const BILLING_PERIODS = Object.freeze({
  MONTHLY: 'month',
  ANNUAL: 'year',
});

export const SUBSCRIPTION_STATUSES = Object.freeze({
  ACTIVE: 'active',
  UNPAID: 'unpaid',
});

export const createBillingSession = () => sendRequest('billings/session', 'POST');

export const createCheckoutSession = (data) => sendRequest('billings/checkout', 'POST', { prices: data });

export const getCheckoutSession = (id) => sendRequest(`billings/checkout/${id}`);

export const getProductsPlans = () => sendRequest('billings/plans');

export const getCurrentSubscriptions = () => sendRequest('billings/subscriptions');

export const updateCurrentSubscription = (id, data) => sendRequest(`billings/subscriptions/${id}`, 'PATCH', data);
