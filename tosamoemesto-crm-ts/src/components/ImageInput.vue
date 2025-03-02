<script setup lang="ts">
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'

const fileInput = ref()
const imageEl = ref()
const status = ref({ inLoad: true, isLoaded: false })

const props = defineProps(['imgUrl'])
const emit = defineEmits(['uploaded'])

onMounted(() => {
  status.value.inLoad = true
  checkImage()
})

watch(
  props,
  () => {
    checkImage()
  },
  { immediate: true },
)

let tryLoad: any

function checkImage() {
  if (props.imgUrl !== '' && typeof props.imgUrl !== 'undefined') {
    status.value.inLoad = false
    status.value.isLoaded = true
    tryLoad = setInterval(() => {
      imageEl.value.src = props.imgUrl
    }, 500)

    setTimeout(() => {
      clearInterval(tryLoad)
      imageEl.value.alt = 'Не удалось загрузить изображение'
    }, 5000)
  } else {
    status.value.inLoad = false
  }
}

onUnmounted(() => {
  clearInterval(tryLoad)
})

function fileLoaded(evt: Event) {
  status.value.isLoaded = true
  const tgt = evt.target,
    files = tgt?.files
  // FileReader support
  if (FileReader && files && files.length) {
    const fr = new FileReader()
    fr.onload = function () {
      imageEl.value.src = fr.result
      emit('uploaded', fr.result)
    }
    fr.readAsDataURL(files[0])
  }
}
</script>

<template>
  <section>
    <div class="form-control p-0" style="width: fit-content" @click="fileInput.click()">
      <div v-if="!status.isLoaded" class="image-frame-placeholder rounded-1 m-1">
        <i class="bi bi-image fs-1 m-auto"></i>
      </div>
      <div v-else class="image-frame">
        <img class="img-fluid rounded image-frame-content" ref="imageEl" alt="" />
      </div>
    </div>
    <input
      ref="fileInput"
      accept="image/jpeg, image/png"
      type="file"
      @change="(e) => fileLoaded(e)"
      hidden
    />
    <progress v-show="status.inLoad" class="w-100" />
  </section>
</template>

<style scoped>
.image-frame-placeholder {
  cursor: pointer;
  display: flex;
  width: 20rem;
  height: 20rem;
  border: 1px dashed var(--bs-border-color);
  transition: background-color 0.2s;
}

.image-frame-content {
  cursor: pointer;
  display: flex;
  width: 20rem;
  height: 20rem;
  object-fit: cover;
  object-position: center;
  aspect-ratio: 1;
  border-radius: 0.2rem;
  transition: 0.2s;
}

.image-frame-content:hover {
  filter: brightness(90%) contrast(90%);
}

.image-frame-placeholder:hover {
  background-color: var(--bs-secondary-bg-subtle);
}
</style>
