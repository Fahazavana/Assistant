<template>
  <div class="flex space-x-2">
    <input v-model="inputMessage" @keyup.enter="handleSend" type="text" placeholder="Type your message..."
      class="flex-1 border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
    <button @click="handleSend"
      class="bg-cyan-500 text-white rounded-md px-6 py-2 hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 transition-colors">
      Send
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

// Define emits for the component
const emit = defineEmits<{
  (e: 'send', message: string): void;
}>();

const inputMessage = ref<string>("");

const handleSend = () => {
  const trimmedMessage = inputMessage.value.trim();
  if (trimmedMessage !== "") {
    emit("send", trimmedMessage);
    inputMessage.value = "";
  }
};
</script>
