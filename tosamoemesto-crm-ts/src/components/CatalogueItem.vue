<script setup lang="ts">
import gProps from "@/gProps";
import axios from "axios";

const props = defineProps(['item', 'type'])
const emit = defineEmits(["deleteItem"])
import {useRouter} from "vue-router";
import { i } from 'vite/dist/node/types.d-aGj9QkWt'
import { useToast } from 'vue-toastification'

const router = useRouter();

const styleMap = [
  "max-width: 12rem; max-height: 12rem",
  "max-width: 6rem; max-height: 6rem"
]

function goToEdit(itemId: number): void {
  let editorRoute = router.getRoutes().find(route => route.meta.parent === router.currentRoute.value.name);
  router.push({name: editorRoute?.name, params: {id: itemId}});
}

function deleteItem() {
  if (confirm("Вы действительно хотите удалить запись?")) {
    axios.delete(`${gProps.getApiUrl()}${router.currentRoute.value.meta.apiEndPoint}/${props.item.id}/`).then(() => {
      emit("deleteItem", {action: "delete", id: props.item.id});
      useToast().info("Запись удалена")
    }).catch((error) => {
      useToast().error(error.message)
    })
  }
}
</script>

<template>
  <div class="card">
    <div class="row">
      <div class="col-auto pe-0">
        <img class="rounded-start img-fluid border-end"
             style="object-fit: cover; height: 100%; object-position: center; aspect-ratio: 1" :style="type === 'food' ? styleMap[0] : styleMap[1]"
             :src="item.image ? item.image : '/src/assets/placeholder.png'">
      </div>
      <div class="col d-flex flex-column ps-0">
        <div class="card-header p-2">
          <div class="hstack gap-2 align-items-center">
            <h5 class="m-0">{{ item.title }}</h5>
            <span v-if="item.sizes_and_prices" class="text-muted" title="Минмальная цена">от {{ Math.ceil(item.sizes_and_prices[0].price) }} ₽</span>
            <div class="ms-auto gap-1 d-flex">
              <button class="btn p-0 px-1" @click="goToEdit(item.id)">
                <i class="bi bi-pencil small"></i>
              </button>
              <button class="btn p-0 px-1 text-danger" @click="deleteItem">
                <i class="bi bi-trash3-fill small"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-0 overflow-y-scroll">
          <div v-if="item.description" v-html="item.description" class="px-2" style="max-height: 1rem"></div>
          <span v-else class="text-muted fst-italic px-2">Описание отсутсвует</span>
        </div>
        <div v-if="item.sizes_and_prices" class="card-footer p-2 hstack gap-1">
          <span v-if="item.active" class="alert alert-success p-0 px-2 text-success m-0 small rounded-pill" title="Статус доступности">Активно</span>
          <span v-else class="alert alert-danger p-0 px-2 text-danger m-0 small rounded-pill" title="Статус доступности">Не активно</span>
          <span class="alert alert-primary p-0 px-2 text-primary m-0 small rounded-pill" title="Категория блюда">{{ item.category.title }}</span>
          <span v-for="size in item.sizes_and_prices" class="alert alert-info p-0 px-2 text-info m-0 small rounded-pill" title="Досутпные размеры">
            {{ size.title }} | {{ Math.ceil(size.price) }} ₽ | {{ size.weight }} г.
          </span>
        </div>
        <div v-if="item.sizes_and_prices" class="card-footer d-flex gap-2 p-2 text-muted">
          <span>Время приготовления: <b>{{ item.cooking_time }} мин</b></span>
          <span>Вес: <b>{{ item.weight }} г.</b></span>
          <span class="ms-auto">Добавил: <b>@{{ item.created_by.username }}</b></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
