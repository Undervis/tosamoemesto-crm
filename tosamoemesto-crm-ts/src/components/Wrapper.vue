<script setup>
import WrapperHeader from '@/components/WrapperHeader.vue'
import { onMounted, onUpdated, ref, watch } from 'vue'

const wrapperHeader = ref()
const containerHeight = ref(0)

function setContainerHeight() {
  const rects = wrapperHeader.value.getBoundingClientRect()
  containerHeight.value = window.innerHeight - rects.top
}

onMounted(() => {
  setContainerHeight()
  window.addEventListener('resize', setContainerHeight)
})
</script>

<template>
  <section class="bg-white h-100" style="border-top-left-radius: var(--bs-border-radius-lg)">
    <WrapperHeader />
    <div ref="wrapperHeader">
      <router-view :style="{ height: containerHeight + 'px' }" />
    </div>
  </section>
</template>

<style scoped></style>
