<template>
  <div class="mb-4 flex" :class="isUser ? 'justify-end' : 'justify-start'">
    <div class="rounded-lg px-4 py-2 max-w-[70%]" :class="messageClasses">
      <div class="prose prose-sm max-w-none text-sm" v-html="renderMarkdown(message.text)" />
      <time
        class="text-xs mt-1"
        :class="timestampClasses"
        :datetime="message.timestamp.toISOString()"
        aria-label="Message timestamp"
      >
        {{ formattedTimestamp }}
      </time>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { marked } from 'marked';
import DOMPurify from "dompurify";
import { defineProps, computed } from "vue";
import { format } from "date-fns";
import type { Message } from "../types/message";

// Props
const props = defineProps<{
  message: Message;
}>();

// Helpers
const isUser = computed(() => props.message.sender === "user");

const messageClasses = computed(() =>
  isUser.value
    ? "bg-blue-500 text-white ml-auto"
    : "bg-gray-200 text-gray-800 mr-auto"
);

const timestampClasses = computed(() =>
  isUser.value ? "text-blue-100" : "text-gray-600"
);

const formattedTimestamp = computed(() =>
  format(props.message.timestamp, "HH:mm")
);


const renderMarkdown = (text: string) => {
  try {
    const rawHtml = marked.parse(text)
    return DOMPurify.sanitize(rawHtml)
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return text
  }
}
</script>
