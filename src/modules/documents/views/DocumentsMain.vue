<template>
  <core-layout :has-nav="true">
    <template #nav>
      <div class="navbar navbar--page uk-padding-remove uk-navbar-container vertical uk-navbar uk-navbar-transparent">
        <core-layout-content-header
          :title="$t('documents.views.main.title')"
          :icon="'documents'"
          class="sidebar-header"
        />

        <div v-for="(item, key) in items" :key="key" class="uk-margin-top">
          <div class="uk-nav-header uk-margin-small-bottom sidebar-content">{{ item.title }}</div>
          <ul class="uk-nav uk-nav-default">
            <li v-for="(link, idx) in item.children" :key="idx" class="uk-nav__item">
              <router-link :to="{ name: link.value }">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <template #default>
      <router-view />
    </template>
  </core-layout>
</template>

<script>
import { useI18n } from 'vue-i18n';

export default {
  components: {
  },
  setup() {
    const i18n = useI18n();

    const items = [
      {
        title: i18n.t('documents.views.main.locations.accountancy'),
        children: [
          {
            label: i18n.t('documents.views.main.links.invoices'),
            value: 'documents-invoices',
            icon: 'mini/invoice',
          },
        ],
      },
    ];

    return { items };
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  &-header {
    padding: 15px;
    border-bottom: 1px solid rgba($alt-color, 0.4);
  }
  &-content {
    font-size: 0.75rem;
    padding: 0 15px;
    color: rgba($base-color-darken, 0.5);
    opacity: 1;
    text-transform: uppercase;
  }
}
.uk-nav__item {
  a {
    position: relative;
    border-left: 4px solid transparent;
    font-size: 0.75rem;
    padding: 12px 10px 12px 15px;
  }
  .router-link-active {
    background-color: rgba($primary-color, 0.1);
    border-left-color: $primary-color;
    font-weight: 500;
  }
}
</style>
