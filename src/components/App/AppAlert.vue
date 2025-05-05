<script setup>

  const props = defineProps({
    message: {type: String, required: true},
  })
  const emits = defineEmits(['hideAlert'])
  const hideAlert = () => {
    emits('hideAlert')
  }
</script>

<template>
  <div class="alert" :class="alertClass">
    <button type="button" class="close" aria-label="Close" @click="hideAlert()">
      <span aria-hidden="true">&times;</span>
    </button>
    <p>{{ props.message }}</p>
  </div>
</template>

<style scoped>
  .alert p {
    font-size: medium;
    margin: 0;
  }

  div.alert-danger, div.alert-danger .close {
    color: var(--ban-color);
  }

  div.alert-success, div.alert-success .close {
    color: var(--ok-color)
  }
</style>
