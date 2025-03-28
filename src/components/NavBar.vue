<template>
  <nav class="bg-blue-500 p-4 shadow-md sticky top-0 z-10">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/" class="text-white text-xl font-bold">Ny masina</router-link>
      </div>
      <div class="space-x-4">
        <router-link to="/" class="text-white hover:underline">Home</router-link>
        <router-link to="/settings" class="text-white hover:underline">Settings</router-link>
      </div>
    </div>
  </nav>
</template>
