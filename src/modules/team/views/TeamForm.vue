<template>
  <v-form
    name="team"
    @submit="onSubmit"
    class="uk-height-1-1"
    v-slot="{ errors, validate }"
    v-e2e
  >
    <core-layout-content :displayContent="true">
      <template #header>
        <core-drawer-header>{{ $t('team.views.form.title') }}</core-drawer-header>
      </template>
      <template #default>
        <core-drawer-content>
          <div class="form-row">
            <div class="email-input">
              <label class="input-label --required" :class="{ '--invalid': errors.email }" for="email">
                {{ $t('team.shared.email') }}
              </label>
              <div class="input-container">
                <v-field
                  id="email"
                  mode="value"
                  name="email"
                  as="input"
                  v-e2e="'email'"
                  class="uk-input --outline"
                  :class="{ '--invalid': errors.email }"
                  :placeholder="$t('team.views.form.placeholders.email')"
                  :disabled="user?.confirmedAt || user?.lockedAt"
                  :value="user?.email"
                  rules="required|email"
                />
                <v-error-message class="input-error-message" name="email" />
              </div>
            </div>
            <div class="role-input">
              <label class="input-label" for="role">{{ $t('team.views.form.placeholders.role') }}</label>
              <div class="input-container">
                <select
                  id="role"
                  v-e2e="'role'"
                  name="role"
                  class="uk-select --outline"
                  @change="onRolesChange"
                  v-model="userRole"
                >
                  <option class="role-value" value="">
                    {{ $t('team.views.form.roles.choose') }}
                  </option>

                  <option v-for="(name, index) in permissionTypes" :key="index" class="role-value" :value="name">
                    {{ $t('team.views.form.roles.' + name) }}
                  </option>

                  <option class="role-value" :value="CUSTOM_ROLE" v-if="userRole === CUSTOM_ROLE">
                    {{ $t('team.views.form.roles.custom') }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <table class="uk-table uk-table-striped team-table">
            <thead>
              <tr>
                <th class="team-table__heading">{{ $t('team.views.form.headers.name') }}</th>
                <th class="team-table__heading --check" v-for="(name, index) in permissionTypes" :key="index">
                  {{ $t('team.views.form.headers.' + name) }}
                </th>
                <th class="team-table__heading --from-tablet">{{ $t('team.views.form.headers.description') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="team-table__row"
                v-for="(permission, index) in permissions"
                v-access="{ limits, name: 'account.module.' + permission.name + '.enabled' }"
                :key="permission.id"
              >
                <td class="team-table__name team-table__cell">
                  <div>{{ $t('team.views.form.abilities.' + permission.name + '.title') }}</div>
                  <div class="team-table__description --mobile --to-tablet">
                    {{ $t('team.views.form.abilities.' + permission.name + '.description') }}
                  </div>
                  <v-field :name="'permissions[' + index + '].name'" type="hidden" :value="permission.name" />
                </td>
                <td class="team-table__cell --check" v-for="name in permissionTypes" :key="name">
                  <label class="checkbox-label" v-if="permission['allow' + name[0].toUpperCase() + name.slice(1)]">
                    <input
                      type="checkbox"
                      class="uk-checkbox"
                      v-e2e="name"
                      :name="'permissions[' + index + '].abilities[]'"
                      :value="name"
                      :checked="abilities[permission.name][name]"
                      @change="userRole = CUSTOM_ROLE; abilities[permission.name][name] = $event.target.checked"
                    />
                  </label>
                </td>
                <td class="team-table__description team-table__cell --from-tablet">
                  {{ $t('team.views.form.abilities.' + permission.name + '.description') }}
                </td>
              </tr>
            </tbody>
          </table>

          <div class="form-row" v-if="loggedUser.isAccountOwner">
            <div class="uk-flex uk-flex-middle">
              <core-form-switcher
                id="owner"
                name="isAccountOwner"
                @change="makeAccountOwner = $event"
                :label="$t('team.views.form.placeholders.makeAdmin')"
              />
               <span
                 class="question-tooltip"
                 uk-icon="icon: question; ratio: 0.5"
                 :uk-tooltip="'title:' + $t('team.views.form.placeholders.makeAdminTooltip')"
               ></span>
            </div>

            <div v-if="makeAccountOwner" class="uk-margin-top uk-alert-warning --light" uk-alert>
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  class="uk-checkbox"
                  v-e2e="'agree'"
                  name="agree"
                  value="agree"
                  v-model="confirmation"
                />
                <span class="agreement-label">{{ $t('team.views.form.ownerAgreement') }}</span>
              </label>
            </div>
          </div>
        </core-drawer-content>
      </template>
      <template #footer>
        <core-drawer-footer>
          <router-link v-e2e="'cancel'" :to="{ name: 'team' }" class="uk-margin-right">
            {{ $t('team.views.form.actions.cancel') }}
          </router-link>

          <button
            v-e2e
            type="submit"
            :disabled="makeAccountOwner && !confirmation"
            class="uk-button uk-button-success"
            @click="handleSubmitClick({ validate })"
          >{{ $t('team.views.form.actions.save') }}</button>
        </core-drawer-footer>
      </template>
    </core-layout-content>
  </v-form>
</template>

<script>
import { computed, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useRouter } from 'vue-router';

import { ABILITIES } from '@/utils/acl';
import { scrollToFirstInvalidControl, handleSubmitClick } from '@/utils/form';
import useKit from '@/modules/core/composables/uikit';
import useApiFormatters from '@/modules/core/composables/api-formatters';
import CoreDrawerHeader from '@/modules/core/components/core-drawer/CoreDrawerHeader.vue';
import CoreDrawerContent from '@/modules/core/components/core-drawer/CoreDrawerContent.vue';
import CoreDrawerFooter from '@/modules/core/components/core-drawer/CoreDrawerFooter.vue';
import CoreFormSwitcher from '@/modules/core/components/core-form/CoreFormSwitcher.vue';

const CUSTOM_ROLE = 'custom';

export default {
  components: {
    VForm: Form,
    VField: Field,
    VErrorMessage: ErrorMessage,
    CoreDrawerHeader,
    CoreDrawerContent,
    CoreDrawerFooter,
    CoreFormSwitcher,
  },
  setup() {
    const uikit = useKit();
    const store = useStore();
    const router = useRouter();
    const { formErrorFormatter } = useApiFormatters();

    const userRole = ref('');
    const confirmation = ref(false);
    const makeAccountOwner = ref(false);

    const limits = computed(() => store.state.core.limits);
    const loggedUser = computed(() => store.state.account.user);
    const user = computed(() => store.state.team.user);
    const permissions = computed(() => store.state.team.permissions);
    const permissionTypes = computed(() => store.state.team.permissionTypes);
    const userPermissions = computed(() => store.getters['team/userPermissions']);

    const abilities = reactive(userPermissions.value);

    const onSubmit = (data, { setErrors }) => {
      const payload = {
        email: data.email,
        isAccountOwner: makeAccountOwner.value,
        permissions: Object.entries(abilities).map(([key, o]) => ({
          name: key,
          abilities: Object.entries(o)
            .filter(([, enabled]) => !!enabled)
            .map(([name]) => name),
        })),
      };

      store.commit('team/SET_LOADING', true);

      store.dispatch('team/upsertUser', payload)
        .then(() => router.push('/team'))
        .catch((error) => {
          const errors = formErrorFormatter(error);

          if (Object.keys(errors).length) {
            setErrors(errors);
            scrollToFirstInvalidControl();
          } else {
            uikit.notify('danger', error.message);
          }
        })
        .finally(() => store.commit('team/SET_LOADING', false));
    };

    const onRolesChange = (event) => {
      Object.entries(abilities).forEach(([key]) => {
        const permission = permissions.value.find(({ name }) => name === key);

        if (permission) {
          abilities[key] = {};

          switch (event.target.value) {
            case ABILITIES.READ:
              if (permission.allowRead) abilities[key][ABILITIES.READ] = true;
              if (permission.allowWrite) abilities[key][ABILITIES.WRITE] = false;
              if (permission.allowDelete) abilities[key][ABILITIES.DELETE] = false;
              break;

            case ABILITIES.WRITE:
              if (permission.allowRead) abilities[key][ABILITIES.READ] = true;
              if (permission.allowWrite) abilities[key][ABILITIES.WRITE] = true;
              if (permission.allowDelete) abilities[key][ABILITIES.DELETE] = false;
              break;

            case ABILITIES.DELETE:
              if (permission.allowRead) abilities[key][ABILITIES.READ] = true;
              if (permission.allowWrite) abilities[key][ABILITIES.WRITE] = true;
              if (permission.allowDelete) abilities[key][ABILITIES.DELETE] = true;
              break;

            default:
              if (permission.allowRead) abilities[key][ABILITIES.READ] = false;
              if (permission.allowWrite) abilities[key][ABILITIES.WRITE] = false;
              if (permission.allowDelete) abilities[key][ABILITIES.DELETE] = false;
          }
        }
      });
    };

    return {
      CUSTOM_ROLE,
      user,
      loggedUser,
      confirmation,
      makeAccountOwner,
      permissions,
      permissionTypes,
      userPermissions,
      userRole,
      abilities,
      limits,
      onSubmit,
      onRolesChange,
      handleSubmitClick,
    };
  },
};
</script>

<style lang="scss" scoped>
  .form-row {
    display: flex;
    flex-wrap: wrap;
    padding: 1rem;
  }
  .email-input,
  .role-input {
    width: 250px;
    margin-right: 1rem;
  }
  .role-input .role-value {
    text-transform: capitalize;
  }
  .uk-alert-warning {
    padding: 10px;
    font-size: 0.75rem;
    width: 100%;
    justify-content: flex-start;
  }
  .agreement-label {
    padding-left: 10px;
  }
  .question-tooltip {
    margin-left: 5px;
  }
</style>
