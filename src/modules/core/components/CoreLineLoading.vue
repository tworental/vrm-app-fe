<template>
  <div class="ins-progress"></div>
</template>

<style lang="scss" scoped>
.ins-progress {
  height: 3px;
  background: $primary-color;
  animation: 2s linear infinite ins, 0.5s ease-out insEnter;
  transition: opacity 0.2s ease-in-out;
  transform-origin: left;
  background-size: 500%;
  z-index: 999999;
  position: fixed;
  display: block;
  width: 100%;
  opacity: 1;
  left: 0;
  top: 0;
}

@keyframes ins {
  0% {
    background-position: 0% 0;
  }
  to {
    background-position: 125% 0;
  }
}

@keyframes insEnter {
  0% {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
</style>
