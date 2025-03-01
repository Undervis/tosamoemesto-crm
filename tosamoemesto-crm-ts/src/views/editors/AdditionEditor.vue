<script setup>
import {onBeforeMount, ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import ImageInput from "@/components/ImageInput.vue";
import gProps from "/src/gProps.ts"

const form = ref()

const router = useRouter()
const current_id = router.currentRoute.value.params.id
const foodAddition = ref()

onBeforeMount(() => {
  foodAddition.value = new FoodAddition()

  if (current_id > 0) {
    axios.get(`${gProps.getApiUrl}/categories/${current_id}`).then((response) => {
      foodAddition.value.id = response.data.id;
      foodAddition.value.title = response.data.title;
      foodAddition.value.description = response.data.description;
      foodAddition.value.image = response.data.image;
    })
  }
})

class FoodAddition {
  id = 0;
  title;
  description;
  image;

  save() {
    if (form.value.checkValidity()) {
      if (current_id > 0) {

      } else {
        let dataToSend = JSON.parse(JSON.stringify(foodAddition.value))
        axios.post(`${gProps.getApiUrl()}/categories/`, dataToSend).then((response) => {
          console.log(response)
        }).catch((error) => {
          console.log(error)
        })
      }
    } else {
      form.value.reportValidity();
    }
  }
}
</script>

<template>
  <section class="container-fluid overflow-y-scroll">
    <div class="hstack p-2">
      <h5 class="m-0">{{ current_id > 0 ? "Редактировать категорию" : "Новая категория" }}</h5>
      <button type="submit" @click="foodAddition.save()" class="btn btn-outline-success ms-auto"><i
        class="bi bi-save me-2"></i>Сохранить
      </button>
      <button class="btn btn-outline-dark ms-auto align-items-center d-flex" @click="$router.back()">
        <i class="bi bi-arrow-left me-2"></i>
        Вернуться назад
      </button>
    </div>
    <form ref="form" class="d-flex gap-2 flex-column" @submit.prevent>
      <div class="form-floating">
        <input class="form-control" type="text" v-model="foodAddition.title" placeholder="Название категории" id="category_name" required>
        <label for="category_name">Название категории</label>
      </div>
      <div class="card">
        <textarea class="form-control"></textarea>
      </div>
      <div>
        <ImageInput :imgUrl="foodAddition.image" @uploaded="image => foodAddition.image = image"></ImageInput>
      </div>
    </form>
  </section>

</template>

<style scoped>

</style>
