<template>
  <nav class="bg-gradient-to-br from-purple-700 to-cyan-500 p-4 shadow-md sticky top-0 z-10 h-15">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link class="hover:text-accent-500 text-white text-xl font-bold" to="/"
          >Ny masina
        </router-link>
        <span class="text-xl text-white px-2">{{ selectedModel }}</span>
      </div>
      <div class="space-x-4">
        <button
          id="sidebarToggler"
          class="flex flex-col justify-between"
          @click="toggleSidebar"
          aria-label="Toggle settings sidebar"
          role="button"
        >
        <Menu v-if="!sidebarVisible" class="text-white size-28" />
          <X v-else class="text-white size-28" />
        </button>
      </div>
    </div>
  </nav>

  <transition name="slide">
    <div
      v-if="sidebarVisible"
      id="sideBarOverlay"
      class="overflow-y-auto flex flex-1 justify-between items-center"
    >
      <div class="w-full h-full hover:cursor-pointer" @click="toggleSidebar"></div>
      <div class="sidebar-content p-10 bg-white h-full overflow-y-auto">
        <!-- API Endpoint Configuration -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700" for="apiEndpoint"
            >API Endpoint:</label
          >
          <input
            id="apiEndpoint"
            v-model="apiEndpoint"
            class="border rounded-md px-4 py-2 w-full"
            placeholder="Enter API endpoint"
            type="text"
          />
        </div>

        <!-- Prompt Template Configuration -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700" for="promptTemplate">
            Prompt Template:
          </label>
          <textarea
            id="promptTemplate"
            v-model="promptTemplate"
            class="border rounded-md px-4 py-2 w-full"
            placeholder="Enter your prompt template here"
            rows="4"
          ></textarea>
        </div>
        <!-- Temperature -->
        <div class="mb-6">
          <div class="flex justify-between mb-1">
            <label class="block text-sm font-medium">Temperature: {{ modelTemperature }}</label>
          </div>
          <input
            v-model="modelTemperature"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
            max="1"
            min="0"
            step="0.1"
            type="range"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>More precise</span>
            <span>More creative</span>
          </div>
        </div>

        <!-- Stream Response -->
        <div class="mb-6 flex items-center">
          <input
            id="streamResponse"
            v-model="streamResponse"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            type="checkbox"
          />
          <label class="ml-2 block text-sm" for="streamResponse">Stream Response</label>
        </div>

        <!-- Model Selection -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700" for="modelSelect"
            >Select Model:</label
          >
          <select
            id="modelSelect"
            v-model="selectedModel"
            class="border rounded-md px-4 py-2 w-full"
          >
            <option v-for="model in models" :key="model.model" :value="model.model">
              {{ model.name }} ({{ model.details.parameter_size }})
            </option>
          </select>
        </div>

        <!-- Document Upload -->
        <div class="mb-6">
          <label class="block mb-2 text-sm font-medium text-gray-700" for="documentUpload"
            >Upload Document for RAG:</label
          >
          <input
            id="documentUpload"
            class="border rounded-md px-4 py-2 w-full"
            type="file"
            @change="handleFileUpload"
          />
        </div>

        <button
          class="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 transition-colors"
          @click="saveSettings"
        >
          Save Settings
        </button>

        <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { type ModelDetails } from '@/types/model.ts'
import { Menu, X } from 'lucide-vue-next'

const sidebarVisible = ref(false)

const toggleSidebar = () => {
  const toggler = document.getElementById('sidebarToggler')
  sidebarVisible.value = !sidebarVisible.value
  toggler?.classList.toggle('toggled')
}
const modelTemperature = ref<number>(parseFloat(localStorage.getItem('modelTemperature') || '0.5'))
const streamResponse = ref<boolean>(localStorage.getItem('streamResponse') === 'true')
const apiEndpoint = ref<string>(localStorage.getItem('apiEndpoint') || '') // Load from local storage
const promptTemplate = ref<string>(localStorage.getItem('promptTemplate') || '') // Load from local storage
const message = ref<string>('')
const models = ref<{ name: string; model: string; details: ModelDetails }[]>([])
const selectedModel = ref<string>(localStorage.getItem('selectedModel') || '') // Load from local storage

// Fetch available models from the API
const fetchModels = async () => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags') // Adjust the endpoint as necessary
    models.value = response.data.models // Extract the models array from the response
    if (!selectedModel.value && models.value.length) {
      selectedModel.value = models.value[0]?.model || ''
    }
  } catch (error) {
    console.error('Error fetching models:', error)
  }
}

// Handle file uploads
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    console.log('File selected:', file)
  }
}

// Save settings
const saveSettings = () => {
  localStorage.setItem('apiEndpoint', apiEndpoint.value)
  localStorage.setItem('streamResponse', streamResponse.value.toString())
  localStorage.setItem('promptTemplate', promptTemplate.value)
  localStorage.setItem('selectedModel', selectedModel.value)
  localStorage.setItem('modelTemperature', modelTemperature.value.toString())
  message.value = 'Settings saved successfully!'
}

onMounted(() => {
  fetchModels() // Fetch models when the component is mounted
})
</script>

<style lang="css" scoped>
#sideBarOverlay {
  position: absolute;
  right: 0;
  width: 100%;
  height: calc(100% - 3.75rem);
  background-color: rgba(0, 0, 0, 0.05);
}

#sideBarOverlay .sidebar-content {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

#sidebarToggler {
  cursor: pointer;
  height: 36px;
  width: 36px;
  transition: all ease-in-out 3s;
}
</style>
