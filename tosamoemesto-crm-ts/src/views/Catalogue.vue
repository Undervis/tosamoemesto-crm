<script setup lang="ts">

import axios from "axios";
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import {useRouter} from "vue-router";
import gProps from '@/gProps';
import CatalogueItem from '@/components/CatalogueItem.vue'
import { useToast } from 'vue-toastification'

const loadedData = ref()
const loaded = ref(false)
const router = useRouter()
const toast = useToast()

function getData() {
  loaded.value = false;
  let currentRoute = router.currentRoute.value.meta
  axios.get(`${gProps.getApiUrl()}/${currentRoute.apiEndPoint}`).then((response) => {
    loadedData.value = response.data;
    loaded.value = true
  }).catch((error) => {
    toast.error(error.message)
  })
}

watch(router.currentRoute, (oldVal, newVal) => {
  if (newVal.path !== oldVal.path) {
    getData()
  }
}, {deep: true})

onBeforeMount(() => {
  getData()
})

onMounted(() => {

})
</script>

<template>
  <section v-if="loaded" class="container-fluid overflow-y-scroll" >
    <div class="gap-2 vstack py-2">
      <CatalogueItem v-for="item in loadedData" :type="$route.name === 'CatalogueFood' ? 'food' : 'any'" :key="item.id" :item="item" @deleteItem="getData"/>
    </div>
  </section>
</template>

<style scoped>

</style>
