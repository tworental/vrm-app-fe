<template>
  <div class="error uk-flex uk-flex-center">
    <section>
      <router-view />
      <a href="/" v-e2e="'main'" class="uk-button uk-button-default">{{
        $t('errors.views.common.btnBack')
      }}</a>
    </section>
  </div>
</template>

<style lang="scss">
.error {
  --bar-width: 0.07em;
  --bar-height: 0.7em;
  font-size: calc(12px + 0.35vw);
  font-weight: 300;
  text-align: center;
  max-width: 40em;
  padding: 2em;
  margin: 0 auto;
  min-height: -webkit-fill-available;
  min-height: calc(100vh - 4em);
  flex-direction: column;

  &__type {
    color: $color-heading;
    font-size: 5em;
    font-weight: bold;
    display: inline-block;
    position: relative;
    pointer-events: none;

    @media all and (min-width: 480px) {
      font-size: 11em;
    }

    &::before,
    &::after {
      content: '';
      display: block;
      position: absolute;
      border-radius: $base-radius-strong;
      transform: rotate(35deg);
    }
    &::before {
      z-index: -1;
      width: var(--bar-width);
      height: var(--bar-height);
      left: 58%;
      top: 5%;
      background: $error-color;
    }
    &::after {
      width: calc(var(--bar-width) * 1.4);
      height: calc(var(--bar-height) * 1.4);
      left: 78%;
      top: 40%;
      background-color: $global-primary-background;
    }
  }
  &__title {
    font-size: 1.19em;

    @media all and (min-width: 480px) {
      font-size: 2.19em;
    }
  }
  &__lead {
    font-size: 0.875em;
    margin: 2em 0;
  }
  .uk-button {
    font-size: .875em;
    font-weight: 500;
    text-transform: uppercase;
    padding: .6em 1.6em;
    border: none;
    background-color: $color-white;
    border-radius: $base-radius-strong;
  }
}
</style>
