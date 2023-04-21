import { configure, defineRule } from 'vee-validate';
import rules from '@vee-validate/rules';
import { localize } from '@vee-validate/i18n';

import dayjs from '@/utils/dayjs';
import REG_EXPS from '@/utils/regex';
import { getDeepValue } from '@/utils/object';
import locales from '../i18n/vee-validate';

Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule]);
});

defineRule('date', (value) => {
  if (value === undefined) return true;

  return dayjs(value).isValid();
});

defineRule('min_date', (value, [minDate]) => {
  if (value === undefined || value === null) return true;

  const current = dayjs(value, 'YYYY-MM-DD');
  const min = dayjs(minDate, 'YYYY-MM-DD').subtract(1, 'day');

  return current.isAfter(min);
});

defineRule('max_date', (value, [maxDate]) => {
  if (value === undefined || value === null) return true;

  const current = dayjs(value, 'YYYY-MM-DD');
  const max = dayjs(maxDate, 'YYYY-MM-DD');

  return !max.isBefore(current);
});

defineRule('required_if', (value, [ifField, ifFieldValue], ctx) => {
  const ifVales = ifFieldValue.split(';');
  if (!ifVales.includes(getDeepValue(ctx.form, ifField)?.toString())) {
    return true;
  }

  if (!value || (Array.isArray(value) && !value.length)) {
    return false;
  }

  return !!String(value).trim().length;
});

defineRule('between_if', (value, [ifField, ifFieldValue, min, max], ctx) => {
  const ifVales = ifFieldValue.split(';');
  if (!ifVales.includes(ctx.form[ifField]?.toString())) {
    return true;
  }

  return Number(value) >= Number(min) && Number(value) <= Number(max);
});

defineRule('check_regex', (value, [key]) => {
  if (!value || !value.trim().length) { return true; }

  const regex = REG_EXPS[key];

  return regex ? regex.test(value) : false;
});

defineRule('number', (value) => value === undefined || value === null || value.length === 0 || REG_EXPS.number.test(value));

defineRule('number_if', (value, [ifField, ifFieldValue], ctx) => {
  const ifVales = ifFieldValue.split(';');
  if (!ifVales.includes(ctx.form[ifField]?.toString())) {
    return true;
  }

  return REG_EXPS.number.test(value);
});

defineRule('time', (value) => REG_EXPS.time.test(value));

defineRule('full_name', (value) => REG_EXPS.fullName.test(value));

configure({
  bails: false,
  validateOnInput: true,
  generateMessage: localize(locales),
});
