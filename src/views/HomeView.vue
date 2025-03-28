<template>
  <div class="flex flex-col h-full bg-gray-100">
    <main class="flex-1 overflow-y-auto p-4 pt-16" ref="chatContainer"> <!-- Added padding-top for navbar height -->
      <MessageBubble v-for="message in messages" :key="message.id" :message="message" />
    </main>
    <footer class="p-4 bg-white shadow-inner">
      <UserInput @send="sendMessage" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import axios from 'axios';
import MessageBubble from "../components/MessageBubble.vue";
import UserInput from "../components/UserInput.vue";
import type { Message } from "../types/message";
import { format } from "date-fns";

const messages = ref<Message[]>([]);
const chatContainer = ref<HTMLElement | null>(null);
let nextMessageId = 1;

// Function to send a message to the Ollama server
const sendMessageToOllama = async (messageText: string) => {
  const model = localStorage.getItem('selectedModel') || 'llama3.2:latest'; // Default model if none is selected
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      prompt: messageText,
      model: model,
      stream: false
    });
    console.log("Response from Ollama:", response.data);
    return response.data.response;
  } catch (error) {
    console.error("Error sending message to Ollama:", error);
    return null;
  }
};

// Function to handle sending a message from the user
const sendMessage = async (text: string) => {
  if (text.trim() !== "") {
    // Add the user's message to the messages array
    messages.value.push({
      id: nextMessageId++,
      text: text,
      sender: "user",
      timestamp: new Date(),
    });

    // Send the message to Ollama and get the response
    const response = await sendMessageToOllama(text);

    // Check and process the response from Ollama
    if (response) {
      messages.value.push({
        id: nextMessageId++,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      });
    }
  }
};

// Initialize greeting message
const initialGreeting = () => {
  messages.value.push({
    id: nextMessageId++,
    text: "Hello! How can I assist you today?",
    sender: "bot",
    timestamp: new Date(),
  });
};

// Lifecycle hooks
onMounted(() => {
  initialGreeting(); // Display initial greeting
  scrollToBottom(); // Ensure view is scrolled to the bottom
});

// Watcher to keep scrolled to the bottom when new messages arrive
watch(
  () => messages.value.length,
  () => {
    setTimeout(scrollToBottom, 50); // Delay to ensure new message is rendered
  }
);

// Function to scroll to the bottom of the chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight; // Keep scrolled to the bottom
  }
};

</script>

<style scoped>
/* Make exceptions for padding in the main container for sticky navbar */
main {
  padding-top: 4rem;
  /* Adjust depending on your navbar height */
}
</style>
