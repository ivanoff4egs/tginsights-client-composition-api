<script setup>
  import {ref} from "vue";
  import {BACKEND_QUERY_LIMIT} from "@/utils/constants.js";

  const props = defineProps({
    total: {type: Number, required: true},
  })

  const emits = defineEmits(['paginate'])

  const currentPage = ref(1)

  const onClickHandler = (page) => {
    const offset = (page - 1) * BACKEND_QUERY_LIMIT;
    emits('paginate', offset)
  }

</script>

<template>
  <div class="app-pagination">
    <vue-awesome-paginate
      :total-items="total"
      :items-per-page="BACKEND_QUERY_LIMIT"
      v-model="currentPage"
      @click="onClickHandler"
    />
  </div>
</template>

<style>
  .app-pagination {
    display: flex;
    justify-content: right;
  }
  .app-pagination ul {
    list-style-type: none;
  }
  .app-pagination .pagination-container {
    display: flex;
    column-gap: 10px;
  }
  .app-pagination .paginate-buttons {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid var(--main-font-color);
    color: var(--main-font-color);
  }
  .app-pagination .active-page,
  .app-pagination .paginate-buttons:hover {
    color: white;
    background-color: var(--main-font-color);
  }
</style>
