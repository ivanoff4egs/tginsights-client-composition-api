<script setup>
  import {useSlots} from "vue";

  const slots = useSlots()
  const iconKeys = Object.keys(slots).filter(key => key.startsWith("icon-"));
</script>

<template>
  <div class="row border-bottom pb-2 mb-2">

    <div class="col-6 ">
      <h2>
        <slot name="title"></slot>
      </h2>
    </div>

    <div class="col-6">
      <div v-for="key in iconKeys" :key="key">
        <slot :name="key" />
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>
