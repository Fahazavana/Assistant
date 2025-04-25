<template>
  <div class="flex flex-col justify-between chat-container">
    <main ref="chatContainer" class="flex-1 overflow-y-auto p-4 bg-gray-100">
      <MessageBubble v-for="message in messages" :key="message.id" :message="message" />
      <!-- Loading indicator for bot response -->
      <div v-if="loading" class="text-sm text-gray-500">Bot is typing...</div>
    </main>
    <div class="p-4 bg-white shadow-inner">
      <UserInput @send="sendMessage" :loading="loading" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import axios from 'axios'
import MessageBubble from '../components/MessageBubble.vue'
import UserInput from '../components/UserInput.vue'
import type { Message } from '../types/message'

const messages = ref<Message[]>([])
const chatContainer = ref<HTMLElement | null>(null)
const loading = ref<boolean>(false) // State to manage loading indicator
let nextMessageId = 1

// Function to send a message to the Ollama server
const sendMessageToOllama = async (messageText: string, stream: boolean) => {
  const model = localStorage.getItem('selectedModel') || 'llama3.2:latest'
  const temperature = localStorage.getItem('temperature') || 0.5
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      prompt: messageText,
      model: model,
      stream: stream,
      temperature: temperature,
    })

    // Return the stream or complete response
    if (stream) {
      return response.data
    }
    return response.data.response
  } catch (error) {
    console.error('Error sending message to Ollama:', error)
    return null
  }
}

// Function to handle sending a message from the user
const sendMessage = async (text: string) => {
  if (text.trim() !== '') {
    // Add the user's message to the messages array
    messages.value.push({
      id: nextMessageId++,
      text: text,
      sender: 'user',
      timestamp: new Date(),
    })

    // Toggle loading state
    loading.value = true

    // Send the message to Ollama and get the response
    const streamResponse = localStorage.getItem('streamResponse') === 'true'
    const response = await sendMessageToOllama(text, streamResponse)

    // Check and process the response from Ollama
    if (streamResponse && response) {
      // Handle streaming response (progressive updates)
      handleStreamResponse(response)
    } else {
      // Handle regular response
      messages.value.push({
        id: nextMessageId++,
        text: response || 'No response received',
        sender: 'bot',
        timestamp: new Date(),
      })
      loading.value = false
    }
  }
}

// Function to handle streaming response
const handleStreamResponse = (stream: ReadableStream) => {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let messageText = ''

  // Read stream and append text progressively
  const readStream = async () => {
    const { done, value } = await reader.read()
    if (done) {
      messages.value.push({
        id: nextMessageId++,
        text: messageText,
        sender: 'bot',
        timestamp: new Date(),
      })
      loading.value = false
      return
    }

    // Append the newly decoded text
    messageText += decoder.decode(value, { stream: true })
    messages.value.push({
      id: nextMessageId++,
      text: messageText,
      sender: 'bot',
      timestamp: new Date(),
    })

    // Continue reading if the stream is not done
    readStream()
  }

  readStream()
}

// Initialize greeting message
const initialGreeting = () => {
  messages.value.push({
    id: nextMessageId++,
    text: 'Hello! How can I assist you today?',
    sender: 'bot',
    timestamp: new Date(),
  })
}

// Lifecycle hooks
onMounted(() => {
  initialGreeting() // Display initial greeting
  scrollToBottom() // Ensure view is scrolled to the bottom
})

// Watcher to keep scrolled to the bottom when new messages arrive
watch(
  () => messages.value.length,
  () => {
    setTimeout(scrollToBottom, 50) // Delay to ensure new message is rendered
  },
)

// Function to scroll to the bottom of the chat
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight // Keep scrolled to the bottom
  }
}
</script>

<style>
.chat-container {
  height: calc(100vh - 3.75rem);
}
</style>
