<script setup>
  import AppTooltip from "@/components/App/AppTooltip.vue";
  import AppPopup from "@/components/App/AppPopup.vue";
  import {formatDate} from "@/utils/functions.js";
  import MessageVersionsIcon from "@/components/App/Icons/MessageVersionsIcon.vue";
  import {ref} from "vue";

  const props = defineProps({
      versions: {type: Array}
  })

  const showVersions = ref(false)

</script>

<template>
  <app-tooltip class="float-right" text="Versions" placement="bottom">
    <message-versions-icon @click="showVersions = true" />
  </app-tooltip>

  <app-popup
      title="Versions"
      :show="showVersions"
      @closeModal="showVersions = false"
      @keyup.esc="showVersions = false"
      :show-save-button="false"
  >
    <div v-for="(version) in versions" :key="version.date" class="border-top border-bottom mb-1 mt-1 pt-1 pb-1">
      <p class="font-weight-bold">{{ formatDate(version.date) }}</p>
      <p>{{ version.message }}</p>
    </div>
  </app-popup>

</template>

<style scoped>
  .message-versions:hover {
    color: var(--active-link-color)
  }

  p {
    margin: 0
  }

  span {
    font-weight: bold;
  }
</style>
