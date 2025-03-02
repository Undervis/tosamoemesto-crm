<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ImageInput from '@/components/ImageInput.vue'
import gProps from '@/gProps.ts'
import { useToast } from 'vue-toastification'

const form = ref()

const router = useRouter()
const current_id = router.currentRoute.value.params.id
const foodCategory = ref()
const loading = ref(false)

onBeforeMount(() => {
  foodCategory.value = new FoodCategory()

  if (Number(current_id) > 0) {
    loading.value = true
    axios
      .get(`${gProps.getApiUrl()}/category/${current_id}`)
      .then((response) => {
        foodCategory.value.id = response.data.id
        foodCategory.value.title = response.data.title
        foodCategory.value.description = response.data.description
        foodCategory.value.image = response.data.image
        loading.value = false
      })
      .catch((error) => {
        useToast().error(error.message)
      })
  }
})

class FoodCategory {
  id = 0
  title: string = ''
  description: string = ''
  image: string = ''

  save() {
    if (form.value.checkValidity()) {
      if (Number(current_id) > 0) {
        const dataToSend = JSON.parse(JSON.stringify(foodCategory.value))
        if (dataToSend.image.toString().substring(0, 4) === 'http') {
          delete dataToSend.image
        }
        axios
          .patch(`${gProps.getApiUrl()}/category/${current_id}/`, dataToSend)
          .then((response) => {
            useToast().success('Сохранено')
          })
          .catch((error) => {
            useToast().error(error.message)
          })
      } else {
        const dataToSend = JSON.parse(JSON.stringify(foodCategory.value))
        axios
          .post(`${gProps.getApiUrl()}/category/`, dataToSend)
          .then((response) => {
            useToast().success('Сохранено')
            const nextId = response.data.id
            router.replace({ name: router.currentRoute.value.name, params: { id: nextId } })
          })
          .catch((error) => {
            useToast().error(error.message)
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
    <progress v-if="loading" class="w-100" />
    <div class="hstack p-2">
      <h5 class="m-0">
        {{ Number(current_id) > 0 ? 'Редактировать категорию' : 'Новая категория' }}
      </h5>
      <button type="submit" @click="foodCategory.save()" class="btn btn-outline-success ms-auto">
        <i class="bi bi-save me-2"></i>Сохранить
      </button>
      <button
        class="btn btn-outline-dark ms-auto align-items-center d-flex"
        @click="$router.back()"
      >
        <i class="bi bi-arrow-left me-2"></i>
        Вернуться назад
      </button>
    </div>
    <form ref="form" class="d-flex gap-2 flex-column" @submit.prevent>
      <div class="form-floating">
        <input
          class="form-control"
          type="text"
          v-model="foodCategory.title"
          placeholder="Название категории"
          id="category_name"
          required
        />
        <label for="category_name">Название категории</label>
      </div>
      <textarea
        class="form-control"
        placeholder="Описание категории"
        v-model="foodCategory.description"
      ></textarea>
      <div>
        <ImageInput
          :imgUrl="foodCategory.image"
          @uploaded="(image) => (foodCategory.image = image)"
        ></ImageInput>
      </div>
    </form>
  </section>
</template>

<style scoped></style>
