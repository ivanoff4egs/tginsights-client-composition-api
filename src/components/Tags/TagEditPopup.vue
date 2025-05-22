<script setup>
  import AppPopup from "@/components/App/AppPopup.vue";
  import AppAlert from "@/components/App/AppAlert.vue";
  import useApiClient from "@/composables/apiClient.js";
  import {ref, onMounted} from "vue";
  import {useRoute} from "vue-router";


  const props = defineProps({
    id: {type: String},
  })

  const tagSearchValuesLimit = 10
  const timeRanges = {hour: 'Last hour', day: 'Last day', week: 'Last week', month: 'Last month'}

  const {loader, apiCallError, response, callApi} = useApiClient()

  const localTag = ref(null)

  const emits = defineEmits(['close', 'saved'])

  const route = useRoute()

  onMounted (() => {
    if (props.id) {
      getTag()
    } else {
      localTag.value = {
        name: "",
        timerange: route.query.timeRange,
        values: [route.query.searchValue]
      }
    }

  })

  const addSearchValueInput = () => {
    localTag.value.values.push('')
  }
  const removeSearchValueInput = (index) => {
    localTag.value.values.splice(index, 1)
  }

  const getTag = async () => {
    await callApi('GET', `/tag/${props.id}`)
    localTag.value = response.value
  }

  const saveTag = async () => {

    const payload = {
      '_id': localTag.value._id || null,
      'name': localTag.value.name,
      'values': localTag.value.values.filter((value) => value && value.length > 2 && value.length < 256),
      'timerange': localTag.value.timerange
    }

    const method = payload.hasOwnProperty('_id') ? 'PATCH' : 'PUT'

    await callApi(method, `/tag/save`, null, payload)

    if (response && response.value.status === 204) {
      emits('saved')
    }
  }
</script>

<template>

  <app-popup title="Save tag" :show="true" @close-modal="emits('close')" @submit-form="saveTag()">

    <div v-if="apiCallError">
      <app-alert :message='apiCallError' @hide="apiCallError = null" />
    </div>

    <form v-if="localTag">

      <div class="form-group">
        <label for="input-tag-name" class="font-weight-bold">Tag name</label>
        <input
          v-model="localTag.name"
          ref="name"
          type="text"
          class="form-control"
          id="input-tag-name"
          placeholder="Enter tag name"
          maxlength="256"
        >
      </div>
      <div class="form-group">
        <label for="input-tag-timerange" class="font-weight-bold">Search time range</label>
        <select v-model="localTag.timerange" class="custom-select">
          <option
            v-for="(title, value) in timeRanges"
            :value="value"
            :key="value"
          >{{ title }}</option>
        </select>

      </div>

      <p class="font-weight-bold">Search Values:</p>
      <div class="versions">
        <div v-for="(searchValue, index) in localTag.values" :key="index">

          <div class="form-group tag-search-value">
            <input
              v-model="localTag.values[index]"
              type="text"
              class="form-control"
            >
            <div class="page-content-icon remove-tag-value" v-if="index !== 0" @click="removeSearchValueInput(index)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
              </svg>
            </div>
          </div>

          <div
            v-if="index === localTag.values.length - 1 && localTag.values.length < tagSearchValuesLimit"
            class="page-content-icon add-tag-value mb-3"
            @click="addSearchValueInput"
          >

            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
            </svg>
          </div>

        </div>
      </div>
    </form>

  </app-popup>

</template>

<style scoped>

  .add-tag-value:hover {
    color: var(--active-link-color);
  }

  .remove-tag-value:hover {
    color: var(--ban-color)
  }

  .tag-search-value .form-control {
    width:90%;
    display: inline;
  }

  .tag-search-value .remove-tag-value {
    margin-top: 0.6em;
    float: right;
  }

  .versions {
    max-height: 20rem;
    overflow-y: scroll;
    overflow-x: auto;
  }

</style>
