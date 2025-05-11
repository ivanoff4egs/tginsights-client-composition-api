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
  <div class="alert alert-danger w-100">
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

</style>
