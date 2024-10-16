<template>
  <div class="date-wrapper">
    <span class="date">{{ now }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// HOOKS
onMounted(() => {
  setDate()
})

// DATA
const now = ref('')

// METHODS
const setDate = (): string => {
  const today = new Date()

  const formatedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(today)

  now.value = `${formatedDate.split(',')[0]} | ${formatedDate.split(',')[1]} h`

  setTimeout(() => {
    setDate()
  }, 60000)

  return formatedDate
}
</script>

<style lang="scss" scoped>
.date-wrapper {
  .date {
    color: $c-turquoise-80;
    font-size: 1rem;
    font-family: $roboto-400;
  }
}
</style>
