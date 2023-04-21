import { sendRequest } from '@/utils/request';

export const CANCELLATION_POLICIES = Object.freeze({
  NON_REFUNDABLE: 'nonRefundable',
  FREE_CANCELLATION_POLICY: 'freeCancellationPolicy',
});

export const show = (propertyId, propertyUnitTypeId) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/rates`);

export const update = (propertyId, propertyUnitTypeId, data) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/rates`, 'PATCH', data);
