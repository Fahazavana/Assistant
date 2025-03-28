<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-semibold mb-4">Settings</h1>

    <!-- API Endpoint Configuration -->
    <div class="mb-6">
      <label for="apiEndpoint" class="block mb-2 text-sm font-medium text-gray-700">API Endpoint:</label>
      <input v-model="apiEndpoint" type="text" id="apiEndpoint" placeholder="Enter API endpoint"
        class="border rounded-md px-4 py-2 w-full" />
    </div>

    <!-- Prompt Template Configuration -->
    <div class="mb-6">
      <label for="promptTemplate" class="block mb-2 text-sm font-medium text-gray-700">
        Prompt Template:
      </label>
      <textarea v-model="promptTemplate" id="promptTemplate" rows="4" placeholder="Enter your prompt template here"
        class="border rounded-md px-4 py-2 w-full"></textarea>
    </div>

    <!-- Model Selection -->
    <div class="mb-6">
      <label for="modelSelect" class="block mb-2 text-sm font-medium text-gray-700">Select Model:</label>
      <select id="modelSelect" v-model="selectedModel" class="border rounded-md px-4 py-2 w-full">
        <option v-for="model in models" :key="model.model" :value="model.model">
          {{ model.name }} ({{ model.details.parameter_size }})
        </option>
      </select>
    </div>

    <!-- Document Upload -->
    <div class="mb-6">
      <label for="documentUpload" class="block mb-2 text-sm font-medium text-gray-700">Upload Document for RAG:</label>
      <input type="file" @change="handleFileUpload" id="documentUpload" class="border rounded-md px-4 py-2 w-full" />
    </div>

    <button @click="saveSettings"
      class="bg-blue-500 text-white rounded-md px-6 py-2 hover:bg-blue-600 transition-colors">
      Save Settings
    </button>

    <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const apiEndpoint = ref<string>(localStorage.getItem('apiEndpoint') || ''); // Load from local storage
const promptTemplate = ref<string>(localStorage.getItem('promptTemplate') || ''); // Load from local storage
const message = ref<string>('');
const models = ref<{ name: string; model: string; details: any }[]>([]);
const selectedModel = ref<string>(localStorage.getItem('selectedModel') || ''); // Load from local storage

// Fetch available models from the API
const fetchModels = async () => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags'); // Adjust the endpoint as necessary
    models.value = response.data.models; // Extract the models array from the response
    if (!selectedModel.value && models.value.length) {
      selectedModel.value = models.value[0].model; // Set default selected model if none is stored
    }
  } catch (error) {
    console.error("Error fetching models:", error);
  }
};

// Handle file uploads
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    console.log('File selected:', file);
    // Include logic to upload the file using an API call if needed
  }
};

// Save settings
const saveSettings = () => {
  console.log('API Endpoint:', apiEndpoint.value);
  console.log('Prompt Template:', promptTemplate.value);
  console.log('Selected Model:', selectedModel.value);

  // Logic to save the settings (e.g., using local storage or an API call)
  localStorage.setItem('apiEndpoint', apiEndpoint.value);
  localStorage.setItem('promptTemplate', promptTemplate.value);
  localStorage.setItem('selectedModel', selectedModel.value);
  message.value = 'Settings saved successfully!'; // Feedback message
};

onMounted(() => {
  fetchModels(); // Fetch models when the component is mounted
});
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
