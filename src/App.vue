<template>
  <NavBar /> <!-- Include the NavBar component -->
  <div class="container mx-auto p-4">
    <router-view /> <!-- This will render the current route based on the active route -->
  </div>
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue'; // Adjust path as necessary
</script>

<style scoped>
/* Add your styles if necessary */
</style>
