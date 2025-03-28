<template>
  <div class="mb-4 flex" :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
    <div class="rounded-lg px-4 py-2 max-w-[70%]" :class="[
      message.sender === 'user'
        ? 'bg-blue-500 text-white ml-auto'
        : 'bg-gray-200 text-gray-800 mr-auto',
    ]">
      <p class="text-sm">{{ message.text }}</p>
      <p class="text-xs opacity-70 mt-1" :class="message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'">
        {{ formatTimestamp(message.timestamp) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { format } from "date-fns";
import type { Message } from "../types/message";

// Define props for the component
const props = defineProps<{
  message: Message;
}>();

// Format timestamp function
const formatTimestamp = (date: Date): string => {
  return format(date, "HH:mm");
};
</script>
