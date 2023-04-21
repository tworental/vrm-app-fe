export const getVatIdRegex = () => /^[A-Za-z]{2,4}(?=.{2,12}$)[-_s0-9]*(?:[a-zA-Z.][-_s0-9]*){0,2}$/;
export const getNumberRegex = () => /^(?=.)([+-]?([0-9]*)(\.([0-9]+))?)$/;
export const getTimeRegex = () => /^([0-9][0-9]):[0-5][0-9]$/;
export const getFullNameRegex = () => /(?=^.{0,200}$)^[a-zA-Z-]+\s[a-zA-Z-]+$/;

export default {
  vatId: getVatIdRegex(),
  number: getNumberRegex(),
  time: getTimeRegex(),
  fullName: getFullNameRegex(),
};
