<script setup lang="ts">
import {onBeforeMount, onMounted, ref} from "vue";
import axios from "axios";
import {QuillEditor} from "@vueup/vue-quill";
import ImageInput from "@/components/ImageInput.vue";
import ItemsSelector from "@/components/ItemsSelector.vue";
import {useRouter} from "vue-router";
import gProps from "@/gProps";
import { useToast } from 'vue-toastification'

const categories = ref()
const additions = ref()
const food_item = ref()

const form = ref()

const router = useRouter()
const current_id = router.currentRoute.value.params.id

onBeforeMount(() => {
  food_item.value = new FoodItem()
  axios.get(`${gProps.getApiUrl()}/category`).then((response) => {
    categories.value = response.data;
  }).catch((error) => {
    useToast().error(error.message)
  })

  axios.get(`${gProps.getApiUrl()}/addition`).then((response) => {
    additions.value = response.data;
  }).catch((error) => {
    useToast().error(error.message)
  })
  if (Number(current_id) > 0) {
    axios.get(`${gProps.getApiUrl()}${router.currentRoute.value.meta.apiEndPoint}${current_id}`).then((response) => {
      food_item.value.id = response.data.id;
      food_item.value.title = response.data.title;
      food_item.value.active = response.data.active;
      food_item.value.description = response.data.description;
      food_item.value.sizes_and_prices = response.data.sizes_and_prices;
      food_item.value.cooking_time = response.data.cooking_time;
      food_item.value.category = response.data.category.id
      food_item.value.image = response.data.image;
      food_item.value.accepted_additions = response.data.accepted_additions.map((item: Addition) => item.id)
      response.data.accepted_additions.forEach((addition: Addition) => {
        additions.value.find((item: Addition) => item.id === addition.id).checked = true;
      })
    }).catch((error) => {
      useToast().error(error.message)
    })
  }

})

function checkAdditions(items: any) {
  let accepted_additions: any[] = []
  let parse_items = JSON.parse(items)
  parse_items.forEach((item: Addition) => {
    if (item.checked) {
      accepted_additions.push(item.id)
    }
  })
  food_item.value.accepted_additions = accepted_additions;
}

class Addition {
  id: number = 0
  title: string = ""
  description: string = ""
  image: string = ""
  checked: boolean = false
}

class SizeAndPrice{
  title = "";
  size = 0;
  weight = "";
  price = "";
}

class FoodItem {
  title = "";
  description = "";
  cooking_time = 0;
  category = 0;
  accepted_additions = [];
  sizes_and_prices = [];
  image = "";
  active = false;

  constructor() {
    this.addSize()
  }

  addSize() {
    this.sizes_and_prices.push(new SizeAndPrice());
    this.updateSizes()
  }

  updateSizes() {
    this.sizes_and_prices.forEach((item: SizeAndPrice, index) => {
          item.size = index;
        }
    )
  }

  removeSize(size_obj: SizeAndPrice) {
    this.sizes_and_prices.splice(this.sizes_and_prices.indexOf(size_obj), 1);
    this.updateSizes()
  }

  setCategory(category_id: number) {
    this.category = category_id;
  }

  save() {
    if (form.value.checkValidity()) {
      const data_to_send = JSON.parse(JSON.stringify(this))
      if (Number(current_id) > 0) {
        if (data_to_send.image.toString().substring(0, 4) === "http") {
          delete data_to_send.image
        }
        axios.patch(`${gProps.getApiUrl()}${router.currentRoute.value.meta.apiEndPoint}${current_id}/`, data_to_send).then((response) => {
          useToast().success("Сохранено")
        }).catch((error) => {
          useToast().error(error.message)
        })
      } else {
        axios.post(`${gProps.getApiUrl()}${router.currentRoute.value.meta.apiEndPoint}`, data_to_send).then((response) => {
          useToast().success("Сохранено")
        }).catch((error) => {
          useToast().error(error.message)
          console.log(error)
        })
      }
    } else {
      form.value.reportValidity()
    }
  }
}
</script>

<template>
  <section class="container-fluid overflow-y-scroll">
    <div class="hstack p-2">
      <h5 class="m-0">{{ Number(current_id) > 0 ? "Редактировать блюдо" : "Новое блюдо" }}</h5>
      <button type="submit" @click="food_item.save()" class="btn btn-outline-success ms-auto"><i
          class="bi bi-save me-2"></i>Сохранить
      </button>
      <button class="btn btn-outline-dark ms-auto align-items-center d-flex" @click="$router.back()">
        <i class="bi bi-arrow-left me-2"></i>
        Вернуться назад
      </button>
    </div>
    <form ref="form" class="p-2 gap-2 d-flex flex-column" @submit.prevent>
      <div class="hstack gap-2 flex-wrap">
        <div class="form-control flex-grow-1 h-100 w-25">
          <input class="form-check-input me-2" v-model="food_item.active" type="checkbox" id="foodCheck">
          <label class="form-check-label" for="foodCheck">Активно</label>
        </div>
        <div class="form-floating w-100">
          <input class="form-control" v-model="food_item.title" type="text" id="foodTitle" placeholder="Паста балоньезе"
                 required>
          <label for="foodTitle">Название блюда</label>
        </div>
      </div>
      <div class="form-control p-0">
        <QuillEditor theme="snow" v-model:content="food_item.description" content-type="html"
                      placeholder="Описание блюда"
                     toolbar="minimal"/>
      </div>

      <div class="row">
        <div class="col pe-0">
          <div class="form-floating">
            <select id="categorySelect" class="form-select" required
                    @change="(e) => food_item.setCategory(e.target.value)">
              <option selected disabled/>
              <option v-for="item in categories" :selected="food_item.category === item.id" :key="item.id"
                      :value="item.id">
                {{ item.title }} - {{ item.description }}
              </option>
            </select>
            <label for="categorySelect">Категория блюда</label>
          </div>
        </div>
        <div class="col-4">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-clock"></i></span>
            <div class="form-floating">
              <input id="foodCookingTime" min="0" type="number" v-model="food_item.cooking_time" class="form-control"
                     placeholder="0">
              <label for="foodCookingTime">Время приготовления</label>
            </div>
            <span class="input-group-text">минут</span>
          </div>
        </div>

      </div>
      <hr>
      <div class="row">
        <div class="col-auto">
          <ImageInput :imgUrl="food_item.image" @uploaded="(image: string) => food_item.image = image"/>
        </div>
        <div class="col">
          <div class="vstack gap-1">
            <span>Размеры и цены</span>
            <ul class="list-custom">
              <li v-for="size in food_item.sizes_and_prices">
                <div class="d-flex flex-wrap input-group">
                  <input type="text" class="form-control w-25" v-model="size.title" placeholder="Название" required>
                  <input type="number" class="form-control" v-model="size.weight" placeholder="Вес" required>
                  <span class="input-group-text">г.</span>
                  <input type="number" class="form-control" v-model="size.price" placeholder="Цена" required>
                  <span class="input-group-text">₽</span>
                  <div class="input-group-text">
                    <button type="button" @click="food_item.removeSize(size)"
                            :disabled="food_item.sizes_and_prices.length === 1" class="btn border-0 p-0 text-danger">
                      <i class="bi bi-trash3-fill"></i>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
            <button type="button" @click="food_item.addSize()" :disabled="food_item.sizes_and_prices.length >= 7"
                    class="btn btn-primary w-100"><i class="bi bi-plus-lg me-2"></i>Добавить
            </button>

          </div>
        </div>
        <div class="col">
          <div class="vstack gap-1">
            <span>Дополнения к блюду</span>
            <items-selector @checked="(items: Addition) => checkAdditions(JSON.stringify(items))"
                            v-if="typeof additions === typeof ref([])" :data="additions"/>
          </div>

        </div>
      </div>

    </form>
  </section>

</template>

<style>
.ql-toolbar {
  border: 0 !important;
  border-bottom: 1px solid var(--bs-border-color) !important;
}

.ql-container {
  border: 0 !important;
}

.list-custom {
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--bs-border-color) !important;
  border-radius: var(--bs-border-radius) !important;
  overflow: hidden !important;
}

.list-custom li * {
  border-radius: 0 !important;
}

.list-custom li:not(:last-child) {
  border-bottom: 1px solid var(--bs-border-color) !important;
}

.list-custom .input-group {
  > input:first-child {
    border-left: 0 !important;
  }

  > .input-group-text:last-child {
    border-right: 0 !important;
  }

  > .input-group-text, input {
    border-top: 0 !important;
    border-bottom: 0 !important;
  }
}
</style>
