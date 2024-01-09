<template>

  <div class="loading">
    <div class="fulfilling-bouncing-circle-spinner">
      <div class="circle"></div>
      <div class="orbit"></div>
    </div>
    <div class="init" v-show="init">Initializing ... Please wait.</div>
    <div class="init default" v-show="!init">Loading ...</div>
  </div>

</template>

<script>

  export default {
    name: 'PageLoading',
    props: {
      init: {
        type: Boolean,
        default: false
      }
    }
  }

</script>

<style scoped>

  .init {
    margin-top: 30px;
    margin-left: 116px;
    color: #ffffff;
    font-weight: 700;
  }
  .default {
    margin-top: 40px;
    margin-left: 170px;
  }
  .loading {
    position: absolute;
    background: #181e2b;
    opacity: 1;
    height: 89%;
    top: 28px;
    left: -15px;
    right: 0;
    z-index: 998;
  }
  .fulfilling-bouncing-circle-spinner,
  .fulfilling-bouncing-circle-spinner * {
    box-sizing: border-box;
  }

  .fulfilling-bouncing-circle-spinner {
    height: 60px;
    width: 60px;
    position: relative;
    margin-top: 250px;
    margin-left: 170px;
    animation: fulfilling-bouncing-circle-spinner-animation infinite 4000ms ease;
  }

  .fulfilling-bouncing-circle-spinner .orbit {
    height: 60px;
    width: 60px;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 50%;
    border: calc(60px * 0.03) solid #ff1d5e;
    animation: fulfilling-bouncing-circle-spinner-orbit-animation infinite 4000ms ease;
  }

  .fulfilling-bouncing-circle-spinner .circle {
    height: 60px;
    width: 60px;
    color: #ff1d5e;
    display: block;
    border-radius: 50%;
    position: relative;
    border: calc(60px * 0.1) solid #ff1d5e;
    animation: fulfilling-bouncing-circle-spinner-circle-animation infinite 4000ms ease;
    transform: rotate(0deg) scale(1);
  }

  @keyframes fulfilling-bouncing-circle-spinner-animation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fulfilling-bouncing-circle-spinner-orbit-animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1);
    }
    62.5% {
      transform: scale(0.8);
    }
    75% {
      transform: scale(1);
    }
    87.5% {
      transform: scale(0.8);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes fulfilling-bouncing-circle-spinner-circle-animation {
    0% {
      transform: scale(1);
      border-color: transparent;
      border-top-color: inherit;
    }
    16.7% {
      border-color: transparent;
      border-top-color: initial;
      border-right-color: initial;
    }
    33.4% {
      border-color: transparent;
      border-top-color: inherit;
      border-right-color: inherit;
      border-bottom-color: inherit;
    }
    50% {
      border-color: inherit;
      transform: scale(1);
    }
    62.5% {
      border-color: inherit;
      transform: scale(1.4);
    }
    75% {
      border-color: inherit;
      transform: scale(1);
      opacity: 1;
    }
    87.5% {
      border-color: inherit;
      transform: scale(1.4);
    }
    100% {
      border-color: transparent;
      border-top-color: inherit;
      transform: scale(1);
    }
  }

</style>
