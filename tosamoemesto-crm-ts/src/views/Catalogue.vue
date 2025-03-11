<script setup lang="ts">
import axios from 'axios'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import gProps from '@/gProps'
import CatalogueItem from '@/components/CatalogueItem.vue'
import { useToast } from 'vue-toastification'
import Loader from '@/components/loader.vue'

const loadedData = ref()
const fLoadedData = ref()
const loaded = ref(false)
const router = useRouter()
const toast = useToast()

const { searchData } = defineProps(['searchData'])

function getData() {
  loaded.value = false
  const currentRoute = router.currentRoute.value.meta
  axios
    .get(`${gProps.getApiUrl()}/${currentRoute.apiEndPoint}`)
    .then((response) => {
      loadedData.value = response.data
      fLoadedData.value = response.data
      loaded.value = true
    })
    .catch((error) => {
      toast.error(error.message)
      console.error(error)
    })
}

watch(
  router.currentRoute,
  (oldVal, newVal) => {
    if (newVal.path !== oldVal.path) {
      getData()
    }
  },
  { deep: true }
)

watch(() => searchData, (newVal, oldVal) => {
  loadedData.value = fLoadedData.value.filter(
    (item: any) => item.title.toUpperCase().indexOf(newVal.searchQuery.toUpperCase()) > -1 || item.description.toUpperCase().indexOf(newVal.searchQuery.toUpperCase()) > -1
  )
})

onBeforeMount(() => {
  getData()
})

</script>

<template>
  <section class="container-fluid overflow-y-scroll d-flex">
    <loader v-if="!loaded" class="m-auto" />
    <div v-if="loaded" class="gap-2 vstack py-2">
      <CatalogueItem
        v-for="item in loadedData"
        :type="$route.name === 'CatalogueFood' ? 'food' : 'any'"
        :key="item.id"
        :item="item"
        @deleteItem="getData"
      />
    </div>
    <div v-if="(!loadedData || loadedData.length === 0) && loaded" class="w-100 mt-2">
      <div class="alert alert-info">
        <i class="bi bi-info-circle me-2"></i>
        <span>Записей нет</span>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
