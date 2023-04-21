import { sendRequest } from '@/utils/request';

export const list = (propertyId, propertyUnitTypeId, filter = 'active') => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/season-rates?filter=${filter}`);

export const show = (propertyId, propertyUnitTypeId, id) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/season-rates/${id}`);

export const create = (propertyId, propertyUnitTypeId, data) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/season-rates`, 'POST', data);

export const update = (propertyId, propertyUnitTypeId, id, data) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/season-rates/${id}`, 'PATCH', data);

export const remove = (propertyId, propertyUnitTypeId, id) => sendRequest(`properties/${propertyId}/unit-types/${propertyUnitTypeId}/season-rates/${id}`, 'DELETE');
