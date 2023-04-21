import { sendRequest, mapFormData } from '@/utils/request';
import { getBrowserDateFormatMask } from '@/utils/datetime';

export const MEASURING_UNITS = Object.freeze({
  IMPERIAL: 'imperial',
  METRIC: 'metric',
});

export const DATE_FORMATS = Object.freeze({
  auto: '',
  YMD: 'yyyy-mm-dd',
  DATE: 'dd-mm-yyyy',
  SDATE: 'yyyy/mm/dd',
  ADATE: 'mm/dd/yyyy',
  EDATE: 'dd.mm.yyyy',
});

export const DATE_FORMAT_MASKS = Object.freeze({
  [DATE_FORMATS.auto]: getBrowserDateFormatMask(),
  [DATE_FORMATS.YMD]: '####-##-##',
  [DATE_FORMATS.DATE]: '##-##-####',
  [DATE_FORMATS.SDATE]: '####/##/##',
  [DATE_FORMATS.ADATE]: '##/##/####',
  [DATE_FORMATS.EDATE]: '##.##.####',
});

export const DATE_FORMAT_RANGE_MASKS = Object.freeze({
  [DATE_FORMATS.auto]: `${getBrowserDateFormatMask()} - ${getBrowserDateFormatMask()}`,
  [DATE_FORMATS.YMD]: '####-##-## - ####-##-##',
  [DATE_FORMATS.DATE]: '##-##-#### - ##-##-####',
  [DATE_FORMATS.SDATE]: '####/##/## - ####/##/##',
  [DATE_FORMATS.ADATE]: '##/##/#### - ##/##/####',
  [DATE_FORMATS.EDATE]: '##.##.#### - ##.##.####',
});

export const getUser = () => sendRequest('me');

export const updateUser = (data) => sendRequest('me', 'PATCH', mapFormData(data));

export const getAccount = () => sendRequest('account');

export const updateAccount = (data) => sendRequest('account', 'PATCH', mapFormData(data));

export const getSetupProgress = () => sendRequest('account/setup-progress');

export const connectGoogleSSO = () => sendRequest('auth/oauth/google/connect', 'POST');

export const disconnectGoogleSSO = () => sendRequest('auth/oauth/google/disconnect', 'DELETE');
