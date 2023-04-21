<template>
  <div class="uk-position-relative uk-height-1-1">
    <iframe v-show="isLoaded" ref="iframeRef" width="100%" height="100%" />
    <div v-if="!isLoaded" class="uk-overlay-default uk-position-cover">
      <div class="uk-position-center" uk-spinner></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getApiUrl, getAccessToken } from '@/utils/request';

export default {
  setup() {
    const route = useRoute();

    const isLoaded = ref(false);
    const iframeRef = ref(null);

    onMounted(() => {
      iframeRef.value.src = getApiUrl(`properties/${route.params.id}/channels/${route.params.channelId}/embed?accessToken=${getAccessToken()}`);

      const timer = setInterval(() => {
        if (iframeRef.value && iframeRef.value.contentWindow) {
          clearInterval(timer);

          setTimeout(() => {
            isLoaded.value = true;
          }, 3000);
        }
      }, 1000);
    });

    return { iframeRef, isLoaded };
  },
};
</script>
