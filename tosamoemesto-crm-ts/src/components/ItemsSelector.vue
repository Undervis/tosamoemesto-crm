<script setup>
import {ref, watch} from "vue";

const {data = [], type = "checkbox"} = defineProps(["data", "type"])
const emiter = defineEmits(["checked"])

let new_data = ref(data)
new_data.value.forEach((item) => {
  item.checked = false
})

const search_query = ref("")

function sortData() {
  new_data.value.sort((a, b) => b.checked - a.checked || a.id - b.id);
}

watch(search_query, (value, oldValue, onCleanup) => {
  new_data.value = data.filter((item) => item.title.toUpperCase().indexOf(value.toUpperCase()) > -1)
  sortData()
})

watch(new_data.value, (newVal, oldVal) => {
  setTimeout(() => {
    sortData()
    emiter("checked", new_data.value)
  }, 100)
})

</script>

<template>
  <section class="custom-selector">
    <div>
      <input type="search" class="form-control border-0 border-bottom rounded-0 bg-transparent" v-model="search_query"
             placeholder="Поищем...">
    </div>
    <div v-for="item in new_data" class="custom-selector-item">
      <div class="row gap-2">
        <div class="col-auto pe-0">
          <img v-if="item.image" :src="item.image" class="img-fluid rounded-1 m-1" alt=""
               style="aspect-ratio: 1; object-fit: cover; width: 3.5rem">
          <img v-else src="@/assets/placeholder.png" class="img-fluid rounded-1 m-1" alt=""
               style="aspect-ratio: 1; object-fit: cover; width: 3.5rem">
        </div>
        <div class="col d-flex ps-0">
          <div class="vstack my-auto">
            <span>{{ item.title }}</span>
            <span class="text-muted small" style="line-height: 1">{{ item.description }}</span>
          </div>
        </div>
        <div class="col-auto d-flex">
          <input :type="type" name="selector" v-model="item.checked" class="me-3">
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.custom-selector {
  border: 1px solid var(--bs-border-color);
  border-radius: var(--bs-border-radius);
}

.custom-selector-item:not(:last-child) {
  border-bottom: 1px solid var(--bs-border-color);
}
</style>
