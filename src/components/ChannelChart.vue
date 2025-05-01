<script setup>
  import { Line } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Tooltip,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title
  } from 'chart.js'

  import AppAlert from "@/components/AppAlert.vue";
  import useApiClient from "@/composables/apiClient";
  import {ref, reactive, onMounted} from "vue";
  import {TimeRanges} from "@/constants.js";
  import {formatDate} from "@/functions.js";

  ChartJS.register(Tooltip, CategoryScale, LinearScale, PointElement, LineElement, Title)

  const {apiCallError, loader, response, callApi} = useApiClient()

  const props = defineProps({
    channel_id: {type: String, required: true},
  })

  const timeRanges = {
    [TimeRanges.HOUR]: 'Last hour',
    [TimeRanges.DAY]: 'Last day',
    [TimeRanges.WEEK]: 'Last week',
    [TimeRanges.MONTH]: 'Last month'
  }

  const selectedTimeRange = ref(TimeRanges.MONTH)

  const chartData = reactive({
    labels: [],
    datasets: [{
      data: [],
      borderColor: '#212529',
      backgroundColor: '#212529'
    }],
  })

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Participants'
      }
    }
  }

  onMounted(() => {
    update()
  })

  const update = async () => {
    await callApi('GET', `/channel/statistics/${props.channel_id}/${selectedTimeRange.value}`)

    chartData.labels = response.value.labels.map(label => formatDate(label))
    chartData.datasets[0].data = response.value.dataset
  }
</script>
<template>

  <label>
    Time range:
    <select v-model="selectedTimeRange" class="custom-select" @change="update">
      <option
        v-for="(title, value) in timeRanges"
        :value="value"
        :key="value"
      >{{ title }}</option>
    </select>
  </label>


  <div v-if="loader" class="d-flex justify-content-center">
    <div class="spinner-border text-secondary" role="status"/>
  </div>

  <div v-if="apiCallError">
    <app-alert
      :message="apiCallError"
      alert-class="alert-danger"
      @hide-error="apiCallError = false"
    />
  </div>

  <div v-if="!chartData.labels.length">
    <div class="alert alert-dark" role="alert">
      <h5>Statistics for the channel is out of the time range.</h5>
      <hr/>
      <p class="mb-0">Try to increase time range</p>
    </div>
  </div>

  <Line v-else id="statistics-chart" :options="chartOptions" :data="chartData"/>

</template>
