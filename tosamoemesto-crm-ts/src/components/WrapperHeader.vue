<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { onBeforeRouteUpdate, useRouter } from 'vue-router'


const router = useRouter()
const emit = defineEmits(['search', 'filter', 'sort'])
const search = ref('')

const titleMap = {
  Orders: 'Заказы',
  Dashboard: 'Дашборд',
  CatalogueFood: 'Каталог / Блюда',
  CatalogueAddition: 'Каталог / Дополнения',
  CatalogueCategory: 'Каталог / Категории'
}
const titleMapped = ref('Название раздела')
watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    titleMapped.value = titleMap[router.currentRoute.value.name]
  }
)

watch(search, (newSearch, oldSearch) => {
  emit('search', search)
})

function openEditor() {
  const editorRoute = router
    .getRoutes()
    .find((route) => route.meta.parent === router.currentRoute.value.name)
  router.push({ name: editorRoute?.name, params: { id: 0 } })
}

const excludePages = ['FoodEditor', 'CategoryEditor', 'AdditionEditor']
</script>

<template>
  <section class="border-bottom" v-show="!excludePages.includes($route.name)">
    <div class="hstack gap-2 p-2 align-items-center flex-wrap">
      <h5 class="text-uppercase mx-1 m-0 text-nowrap">{{ titleMapped }}</h5>
      <div class="flex-grow-1">
        <input class="form-control" v-model="search" type="search" placeholder="Поиск..." />
      </div>
      <button class="btn btn-outline-primary" @click="openEditor">
        <i class="bi bi-plus-lg me-2"></i>Добавить
      </button>
      <div class="btn-group" hidden>
        <button class="btn btn-outline-dark"><i class="bi bi-filter me-2"></i>Фильтры</button>
        <button class="btn btn-outline-dark"><i class="bi bi-sort-down me-2"></i>Сортировка</button>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
