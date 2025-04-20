<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
    <a href="/" class="navbar-brand col-sm-3 col-md-2 mr-0">tgInsights <span class="version">v{{ appVersion }}</span></a>
    <form @submit.prevent="searchSubmit" class="search-input-form">
      <input
          v-model="searchValue"
          class="form-control form-control-dark w-100"
          type="text"
          id="form-text-input"
          placeholder="Search"
          aria-label="Search"
          maxlength="256"
          autocomplete="off"
      >
    </form>

    <div class="search-controls-form">
      <ul class="navbar-nav px-3">
        <li class="nav-item">
          <select v-model="selectedTimeRange" class="header-select bg-dark text-white" id="form-select-input">
            <option
                v-for="(title, value) in timeRanges"
                :value="value"
                :key="value"
            >{{ title }}</option>
          </select>
        </li>
        <li class="nav-item header-checkbox-li">
          <input
              v-model="strict"
              type="checkbox"
              id="form-check-input"
              class="header-checkbox"
          >
          <label for="form-check-input" class="header-checkbox-label">
            strict
          </label>
        </li>
        <li class="nav-item header-button-li">
          <button
              @click="searchSubmit"
              type="button"
              class="btn btn-dark header-button"
              :disabled="!isSearchSubmitAllowed"
              :class="{'disabled' : !isSearchSubmitAllowed}"
          >Search</button>
        </li>
      </ul>
    </div>
<!--
    <last-messages />
    <telegram-connection />
    <log-out />
-->
  </nav>
</template>
<script setup>
import {computed, ref, watch} from "vue";
import {TimeRanges} from "@/constants.js";
import {useRoute} from "vue-router";
// import LogOut from "@/components/LogOut.vue";
// import TelegramConnection from "@/components/TelegramConnection.vue";
// import LastMessages from "@/components/LastMessages.vue";


//  components: {LogOut, TelegramConnection, LastMessages},

const strict = ref(true)
const searchValue = ref('')
const selectedTimeRange = ref(TimeRanges.DAY)
const timeRanges = {
  [TimeRanges.HOUR]: 'Last hour',
  [TimeRanges.DAY]: 'Last day',
  [TimeRanges.WEEK]: 'Last week',
  [TimeRanges.MONTH]: 'Last month'
}
const appVersion = import.meta.env.VITE_APP_VERSION

watch(useRoute(), (newRoute) => {
  if (newRoute.name === 'messages.search') {
    searchValue.value = newRoute.params.searchValue
    strict.value = newRoute.params.strict
    selectedTimeRange.value = newRoute.params.timerange
  }
})

const emit = defineEmits(['searchSubmit'])

const isSearchSubmitAllowed = computed(() => {
  return searchValue.value && searchValue.value.length > 2
})

const searchSubmit = () => {
  if (isSearchSubmitAllowed) {
    emit('searchSubmit', searchValue.value, strict.value, selectedTimeRange.value)
  }
}


</script>
<style scoped>
  .navbar-brand {
    padding-top: .75rem;
    padding-bottom: .75rem;
    font-size: 1.25rem;
    font-weight: bold;
    background-color: rgba(0, 0, 0, .25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
  }

  .navbar-nav {
    flex-direction: row;
  }

  .navbar .form-control {
    padding: .75rem 1rem;
    border-width: 0;
    border-radius: 0;
  }

  .form-control-dark {
    color: white;
    background-color: rgba(255, 255, 255, .1);
    border-color: rgba(255, 255, 255, .1);
  }

  .form-control-dark:focus {
    color: var(--main-font-color);
    border-color: transparent;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
  }

  select.header-select {
    height: 100%;
    border-radius: 5px;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .header-checkbox-label {
    color: white;
    position: relative;
    top: 0.5rem;
    left: 1.5rem;
  }

  .header-checkbox {
    transform: scale(3);
    position: relative;
    top: 0.6rem;
    accent-color: white;
  }

  .header-checkbox-li {
    margin-left: 2rem;
  }

  .header-button-li {
    margin-left: 2.5rem
  }

  .header-button {
    border: 1px solid white;
    border-radius: 5px;
    width: 6rem;
    background-color: var(--main-font-color);
  }

  .header-button:not(.disabled):hover {
    background-color: white;
    color: var(--main-font-color);
    font-weight: bolder;
  }

  .search-input-form {
    width: 70%
  }

  .search-controls-form {
    width: 30%
  }

  .version {
    font-weight: normal;
    font-size: small
  }

</style>
