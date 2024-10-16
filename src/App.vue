<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
</script>

<template>
  <TheHeader />
  <RouterView />
</template>

<style lang="scss">
@import '@/styles/_reset.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: $c-white;
  color: $c-grey-70;
  font-family: $roboto-400;
}
</style>
