import { sendRequest } from '@/utils/request';

export const list = (propertyId, propertyUnitTypeId) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/units`);

export const show = (propertyId, propertyUnitTypeId, id) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/units/${id}`);

export const create = (propertyId, propertyUnitTypeId, data) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/units`, 'POST', data);

export const update = (propertyId, propertyUnitTypeId, id, data) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/units/${id}`, 'PATCH', data);

export const remove = (propertyId, propertyUnitTypeId, id) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/units/${id}`, 'DELETE');
