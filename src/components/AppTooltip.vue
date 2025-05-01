<script setup>
  import Popper from "vue3-popper";

  const props = defineProps({
    text: {type: String, required: true},
    placement: {type: String, required: false, default: 'bottom'},
    offsetDistance: {type: Number, required: false, default: 5}
  })

</script>

<template>

  <Popper :hover="true" :offsetDistance="String(offsetDistance)" :arrow="true" :placement="placement">
    <slot></slot>
    <template #content>
      <div>{{ text }}</div>
    </template>
  </Popper>

</template>
