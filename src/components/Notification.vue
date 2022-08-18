<template>
  <div class="px-2 sm:px-0 sm:max-h-screen sm:overflow-y-auto w-full sm:w-1/5 bg-transparant fixed top-0 left-0 sm:right-4 sm:left-auto z-50 flex flex-grow">
    <ul class="flex flex-col w-full">
      <li v-for="notification of notifications" :key="notification.id" class="h-fit bg-background-light pt-4 w-full my-2 break-all flex flex-col rounded-sm shadow-md">
        <h4 class="px-4 font-bold">{{ notification.subject }}</h4>
        <p class="px-4 pt-2 pb-4 text-sm">{{ notification.message }}</p>
        <div class="h-1 w-full bg-accent-purple"></div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { notification } from '@/composables/useNotifications'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const notifications = notification.notifications
    return {
      notifications,
    }
  },
})
</script>
