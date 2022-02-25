<template>
  <div class="shadow p-4 w-full mx-auto">
    <div class="animate-pulse flex space-x-4">
      <div v-for="i in repeat" :key="i" class="flex-1 space-y-6 py-1">
        <div class="h-4 bg-gray-300 rounded w-3/4" />
        <div class="space-y-6">
          <div class="h-4 bg-gray-400 rounded" />
          <div class="h-4 bg-gray-400 rounded w-5/6" />
          <div class="h-4 bg-gray-400 rounded w-3/4" />
          <div class="h-4 bg-gray-400 rounded w-5/6" />
          <div class="h-4 bg-gray-400 rounded w-3/4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    repeat: {
      type: Number,
      default: 1,
    }
  }
})
</script>
