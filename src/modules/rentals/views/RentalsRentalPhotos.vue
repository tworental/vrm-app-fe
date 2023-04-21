<template>
  <core-layout-content>
    <template #header>
      <core-layout-content-header
        :title="$t('rentals.views.photos.title')"
        icon="photos"
        class="uk-flex-wrap"
      >
        <rentals-breadcrumb :title="$t('rentals.views.photos.title')" />
      </core-layout-content-header>
    </template>
    <template #default>
      <div class="content">
        <div class="card">
          <p class="card__description">
            {{ $t('rentals.views.photos.description') }}
          </p>

          <core-images-uploader
            v-if="images.length === 0"
            :loading="uploading"
            :max-single-size="MAX_SINGLE_SIZE"
            :disabled="!canUserEditProperties"
            @files-change="onFilesChange"
          />
          <template v-else>
            <div v-if="selected" class="preview uk-position-relative">
              <core-image
                class="preview__img"
                :src="selected.publicUrl"
                :fallback="require('@/assets/images/img-error.png')"
              />
              <div
                class="uk-position-top-right preview__actions"
              >
                <button
                  class="uk-button uk-button--has-icon preview__btn"
                  :uk-tooltip="'title: ' + $t('rentals.views.photos.actions.edit')"
                  @click="onEditModal()"
                  v-can:properties.write="user"
                >
                  <core-svg width="16" :src="require('@/assets/images/icons/edit.svg')" />
                </button>
                <button
                  v-if="!Boolean(selected.main)"
                  class="uk-button uk-button--has-icon preview__btn"
                  :uk-tooltip="'title: ' + $t('rentals.views.photos.actions.makePrimary')"
                  @click="onMakePrimary($route.params.id, selected.id)"
                  v-can:properties.write="user"
                >
                  <core-svg width="16" :src="require('@/assets/images/icons/star-plus.svg')" />
                </button>
                <button
                  class="uk-button uk-button--with-icon uk-button-danger preview__btn preview__delete"
                  :uk-tooltip="'title: ' + $t('rentals.views.photos.actions.delete')"
                  @click="onDelete($route.params.id, selected.id)"
                  v-can:properties.delete="user"
                >
                  <core-svg
                    width="16"
                    class="uk-margin-remove-right"
                    :src="require('@/assets/images/icons/delete.svg')"
                  />
                </button>
              </div>

              <div class="preview__meta uk-position-bottom-left" v-if="selected.title || selected.description">
                <h4 v-if="selected.title">{{ selected.title }}</h4>
                <p v-if="selected.description">{{ selected.description }}</p>
              </div>
            </div>

            <div>
              <draggable
                itemKey="id"
                :list="images"
                class="card-list gallery"
                :disabled="!canUserEditProperties"
                @change="onDragChange"
              >
                <template #item="{ element: image }">
                  <div
                    :key="image.id"
                    class="card-list__item gallery__item uk-position-relative"
                    :class="{ '--current': selected?.id === image.id, '--primary': Boolean(image.main) }"
                    @click="$store.commit('rentals/images/SET_IMAGE', image)"
                  >
                    <div
                      v-if="Boolean(image.main)"
                      class="gallery__item-primary-icon uk-position-top-right"
                    >
                      <core-svg
                        class="icon --no-stroke "
                        height="20"
                        width="20"
                        :src="require('@/assets/images/icons/star.svg')"
                      />
                    </div>
                    <core-image
                      class="gallery__item-img"
                      :src="image.publicUrl"
                      :fallback="require('@/assets/images/img-error.png')"
                    />
                  </div>
                </template>

                <template #footer>
                  <core-images-uploader
                    class="gallery__uploader"
                    :loading="uploading"
                    :hide-text="true"
                    :max-single-size="MAX_SINGLE_SIZE"
                    :disabled="!canUserEditProperties"
                    @files-change="onFilesChange"
                  />
                </template>
              </draggable>
            </div>
          </template>
        </div>
      </div>
    </template>
  </core-layout-content>
  <rentals-rental-photo-modal ref="modalRef" />
</template>

<script>
import { ref, computed, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import draggable from 'vuedraggable';

import useKit from '@/modules/core/composables/uikit';
import CoreImage from '@/modules/core/components/CoreImage.vue';
import CoreImagesUploader from '@/modules/core/components/CoreImagesUploader.vue';
import RentalsBreadcrumb from '@/modules/rentals/components/RentalsBreadcrumb.vue';
import RentalsRentalPhotoModal from '@/modules/rentals/components/RentalsRentalPhotoModal.vue';
import { MAX_SINGLE_SIZE } from '@/modules/rentals/services/images';
import { ABILITIES, can, MODULES } from '@/utils/acl';

export default {
  components: {
    RentalsRentalPhotoModal,
    CoreImagesUploader,
    RentalsBreadcrumb,
    CoreImage,
    draggable,
  },
  setup() {
    const i18n = useI18n();
    const store = useStore();
    const uikit = useKit();
    const route = useRoute();

    const modalRef = ref(null);

    const selected = computed(() => store.state.rentals.images.entity);
    const images = computed(() => store.state.rentals.images.list);
    const uploading = computed(() => store.state.rentals.images.uploading);
    const user = computed(() => store.state.account.user);
    const canUserEditProperties = computed(() => can(user.value, MODULES.PROPERTIES, [ABILITIES.WRITE]));

    const onEditModal = () => uikit.modals.show(modalRef.value?.$el);

    const onMakePrimary = (propertyId, id) => (
      store.dispatch('rentals/images/markAsPrimaryImage', { propertyId, id, data: { main: 1 } })
        .then(() => uikit.notify('success', i18n.t('rentals.views.photos.updateSuccess')))
        .then(() => !route.params.rentalTypeId && store.dispatch('rentals/rentals/setRental', propertyId))
        .then(() => route.params.rentalTypeId && store.dispatch('rentals/rentalTypes/setRentalType', {
          id: route.params.rentalTypeId,
          propertyId,
        }))
        .catch((error) => error && uikit.notify('danger', error.message))
    );

    const onDelete = (propertyId, id) => uikit.modals.deleteConfirm(i18n.t('rentals.views.photos.deleteConfirm'))
      .then((dialog) => store.dispatch('rentals/images/deleteImage', { propertyId, id })
        .then(() => uikit.notify('success', i18n.t('rentals.views.photos.deleteSuccess')))
        .then(() => store.dispatch('rentals/rentals/setRental', propertyId))
        .then(() => route.params.rentalTypeId && store.dispatch('rentals/rentalTypes/setRentalType', {
          id: route.params.rentalTypeId,
          propertyId,
        }))
        .finally(() => dialog.hide()))
      .catch((error) => error && uikit.notify('danger', error.message));

    const onFilesChange = (fileList) => {
      const propertyId = route.params.id;
      const propertyUnitTypeId = route.params.rentalTypeId;
      const propertyUnitTypeUnitId = route.params.rentalTypeUnitId;

      const queryArray = Object.entries({ propertyUnitTypeId, propertyUnitTypeUnitId })
        .filter(([, value]) => Boolean(value));

      const query = Object.fromEntries(queryArray);

      store.dispatch('rentals/images/uploadImages', { propertyId, query, fileList })
        .then(() => store.dispatch('rentals/images/setImages', { propertyId, query }))
        .then(() => store.dispatch('rentals/rentals/setRental', propertyId))
        .then(() => propertyUnitTypeId && store.dispatch('rentals/rentalTypes/setRentalType', {
          id: propertyUnitTypeId,
          propertyId,
        }));
    };

    onUnmounted(() => {
      store.commit('rentals/images/SET_IMAGE', null);
    });

    const onDragChange = ({ moved }) => {
      if (moved) {
        const propertyId = route.params.id;
        const propertyUnitTypeId = route.params.rentalTypeId;
        const propertyUnitTypeUnitId = route.params.rentalTypeUnitId;

        const queryArray = Object.entries({ propertyUnitTypeId, propertyUnitTypeUnitId })
          .filter(([, value]) => Boolean(value));

        const query = Object.fromEntries(queryArray);
        const { element, oldIndex, newIndex } = moved;

        store.dispatch('rentals/images/moveImage', {
          propertyId,
          id: element.id,
          query,
          body: { oldIndex, newIndex },
        })
          .then(() => uikit.notify('success', i18n.t('rentals.views.photos.moveSuccess')))
          .catch((error) => error && uikit.notify('danger', error.message));
      }
    };

    return {
      MAX_SINGLE_SIZE,
      selected,
      images,
      uploading,
      modalRef,
      canUserEditProperties,
      user,

      onMakePrimary,
      onDelete,
      onFilesChange,
      onDragChange,
      onEditModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid rgba($alt-color, 0.2);
  background-color: $color-white;
  padding: 20px;
  margin-bottom: 20px;

  &__header {
    margin-bottom: 24px;
  }

  &__heading {
    margin-bottom: 4px;
  }

  &__title {
    font-weight: 700;
    color: $base-color-darken;
    margin: 0;
  }

  &__description {
    color: rgba($base-color-darken, 0.7);
    font-size: 0.875rem;
    margin: 0 0 20px;
  }
}
.preview {
  background-color: rgba($alt-color, 0.1);
  margin-bottom: 20px;
  height: 250px;

  @include fromWideMobile {
    height: 450px;
  }

  &__img {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    object-fit: contain;

    ::v-deep() img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }
  }

  &__actions {
    display: none;

    & > * {
      margin: 5px;
    }
  }

  &__delete {
    padding: 0;
    height: 38px;
  }

  &:hover {
    .preview__actions {
      display: block;
    }
  }

  &__btn {
    height: 32px;
    width: 32px;
    line-height: 28px;
    min-width: inherit;
  }
}
.gallery {
  --card-list-min-width: 100px;
  padding: 0;
  grid-gap: 11px;

  &__item {
    transition: box-shadow 0.15s linear;
    aspect-ratio: 1 / 1;
    transform: none;
    box-shadow: 0 0 0 1px rgba($base-color-darken, 0.1);

    &:hover {
      img {
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
      }
    }

    &-img {
      transition: box-shadow 0.15s linear;
      object-fit: cover;
      height: 100%;

      ::v-deep() img {
        object-fit: cover;
        height: 100%;
        width: 100%;
      }
    }
    &.--current {
      box-shadow: 0 0 0 2px $primary-color;
    }
    &-primary-icon {
      margin: 5px;
      width: 24px;
    }
  }

  &__uploader {
    aspect-ratio: 1 / 1;

    ::v-deep() .wrapper {
      min-height: 100%;
    }
  }
}
.preview__meta {
  padding: 10px;
  user-select: none;

  h4 {
    margin: 0 0 5px;
    font-size: 1rem;
    font-weight: 500;
  }
  p {
    margin: 0;
    font-size: 0.75rem;
    color: rgba($base-color-darken, 0.7);
  }
  h4, p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
