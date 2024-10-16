<template>
  <div class="wrapper-menu">
    <div class="links-wrapper" data-cy="sidemenu-links-wrapper">
      <div v-for="(link, index) in links" :key="index" class="side-link">
        <IconsSidebar :icon="link" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// IMPORTS
import IconsSidebar from './IconsSidebar.vue'

// DATA
const links = ['validation', 'access', 'occupancy', 'incidence', 'denied']
</script>

<style lang="scss" scoped>
.wrapper-menu {
  width: 4rem;
  background-color: $c-turquoise-80;

  .links-wrapper {
    align-items: center;
    display: flex;
    flex-direction: column;
    height: calc(100vh - $header-height);
    padding-top: 2.5rem;
    gap: 2rem;
    width: $sidemenu-size;

    .side-link {
      height: 2rem;
      display: flex;
      align-items: center;
      position: relative;
    }
  }
}
</style>
