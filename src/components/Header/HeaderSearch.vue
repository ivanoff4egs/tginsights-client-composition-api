<script setup>
import {useRouter} from "vue-router";
import {computed, reactive} from "vue";
import {TimeRanges} from "@/utils/constants.js";

  const router = useRouter()

  const defaultSearchParams = {
    strict: true,
    searchValue: "",
    timeRange: TimeRanges.DAY
  }

  const searchParams = reactive({...defaultSearchParams})

  const timeRanges = {
    [TimeRanges.HOUR]: 'Last hour',
    [TimeRanges.DAY]: 'Last day',
    [TimeRanges.WEEK]: 'Last week',
    [TimeRanges.MONTH]: 'Last month'
  }

  const isSearchSubmitAllowed = computed(() => {
    return searchParams.searchValue && searchParams.searchValue.trim().length > 2
  })

  const searchSubmit = () => {
    if (isSearchSubmitAllowed.value) {
      router.push({
        name: 'messages.search',
        query: {
          searchValue: searchParams.searchValue,
          strict: searchParams.strict,
          timeRange: searchParams.timeRange}
      })
    }
  }
</script>

<template>
  <form @submit.prevent="searchSubmit" class="search-input-form">
    <input
      v-model="searchParams.searchValue"
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
        <select v-model="searchParams.timeRange" class="header-select bg-dark text-white" id="form-select-input">
          <option
            v-for="(title, value) in timeRanges"
            :value="value"
            :key="value"
          >{{ title }}</option>
        </select>
      </li>
      <li class="nav-item header-checkbox-li">
        <input
          v-model="searchParams.strict"
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
</template>

<style scoped>
  .navbar-nav {
    flex-direction: row;
  }

  .form-control {
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
</style>
