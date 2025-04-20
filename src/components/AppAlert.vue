<script setup>

  const props = defineProps({
    alertClass: {type: String, required: true},
    message: {type: String, required: true},
  })
  const emits = defineEmits(['hideError', 'hideSuccess'])
  const hideAlert = (alertClass) => {
      if (alertClass === 'alert-danger') {
        emits('hideError')
      } else if (alertClass === 'alert-success') {
        emits('hideSuccess')
      }
    }
</script>

<template>
  <div class="alert" :class="alertClass">
    <button type="button" class="close" aria-label="Close" @click="hideAlert(props.alertClass)">
      <span aria-hidden="true">&times;</span>
    </button>
    <p>{{ props.message }}</p>
  </div>
</template>

<style scoped>
  .alert p {
    font-size: medium
  }

  div.alert-danger, div.alert-danger .close {
    color: var(--ban-color);
  }

  div.alert-success, div.alert-success .close {
    color: var(--ok-color)
  }
</style>
