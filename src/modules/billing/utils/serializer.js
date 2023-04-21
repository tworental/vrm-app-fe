import i18n from '@/plugins/i18n';

// eslint-disable-next-line import/prefer-default-export
export const getFeatureSections = (plans) => {
  const featureKeys = plans
    .flatMap((plan) => plan.features.map((feature) => ({ name: feature.name, group: feature.group })))
    .filter((item, i, array) => i === array.findIndex((el) => el.name === item.name && el.group === item.group));

  const featureObj = featureKeys.reduce((acc, curr) => {
    if (!acc[curr.group]) {
      acc[curr.group] = {};
    }
    if (!acc[curr.group][curr.name]) {
      acc[curr.group][curr.name] = [];
    }
    plans.forEach((plan) => {
      const feature = plan.features.find((item) => item.name === curr.name && item.group === curr.group);

      if (feature) {
        acc[curr.group][curr.name].push(feature.value);
      }
    });

    return acc;
  }, {});

  return Object.entries(featureObj).map(([section, children]) => ({
    id: section,
    name: i18n.global.t(`billing.dicts.sections.${section}`),
    children: Object.entries(children).map(([label, values]) => [
      i18n.global.t(`billing.dicts.features.${label}`),
      ...values,
    ]),
    open: 1,
  }));
};
