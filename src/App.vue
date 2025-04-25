<template>
  <div class="h-screen">
  <NavBar />
  <div class="container mx-auto">
    <router-view />
  </div>
  </div>
</template>

<script lang="ts" setup>
import NavBar from './components/NavBar.vue';
</script>

