<template>
  <div class="app-version">
    <span>{{ $t('core.components.appVersion.copyright', { year, domain }) }}</span>
    <span>{{ $t('core.components.appVersion.version', { version: appVersion }) }}</span>
  </div>
</template>

<script>
export default {
  name: 'CoreAppVersion',
  setup() {
    const appVersion = process.env.APP_VERSION;
    const domain = process.env.VUE_APP_DOMAIN;

    return {
      appVersion,
      domain,
      year: new Date().getFullYear(),
    };
  },
};
</script>

<style lang="scss" scoped>
.app-version {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-size: 0.75rem;
  color: $alt-color;
}
</style>
