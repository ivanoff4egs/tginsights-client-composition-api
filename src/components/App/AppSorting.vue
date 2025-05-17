<script setup>
  import {reactive} from "vue";

  const props = defineProps({
    sortBy: {type: String, required: true},
    sortDir: {type: Number, required: true},
    active: {type: Boolean, required: true}
  })

  const emits = defineEmits(['sort'])

  const applySort = (sortDir) => {
      const sortParams = {}
      sortParams[props.sortBy] = props.active ? sortDir : sortDir * -1
      emits('sort', sortParams)
    }


</script>

<template>
  <div v-if="sortDir === -1" class="sort-icon d-inline" :class="{'active': active}" @click="applySort(1)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down" viewBox="0 0 16 16">
      <path d="M3.5 2.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 11.293zm3.5 1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5M7.5 6a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1z"/>
    </svg>
  </div>

  <div v-else class="sort-icon d-inline" :class="{'active': active}" @click="applySort(-1)">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-down-alt" viewBox="0 0 16 16">
      <path d="M3.5 3.5a.5.5 0 0 0-1 0v8.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L3.5 12.293zm4 .5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 0 1zm0 3a.5.5 0 0 1 0-1h5a.5.5 0 0 1 0 1zM7 12.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5"/>
    </svg>
  </div>
</template>

<style scoped>
  .sort-icon {
    cursor: pointer
  }
  .sort-icon:not(.active) {
    opacity: 50%
  }
</style>
