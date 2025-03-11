<script setup>
import WrapperHeader from '@/components/WrapperHeader.vue'
import { onMounted, onUpdated, ref, watch } from 'vue'

const wrapperHeader = ref()
const containerHeight = ref(0)

function setContainerHeight() {
  const rects = wrapperHeader.value.getBoundingClientRect()
  containerHeight.value = window.innerHeight - rects.top
}

const searchQuery = ref('')
const sortBy = ref({field: 'id', direction: 'asc'})
const filters = ref({})

onMounted(() => {
  setContainerHeight()
  window.addEventListener('resize', setContainerHeight)
})
</script>

<template>
  <section class="bg-white h-100" style="border-top-left-radius: var(--bs-border-radius-lg)">
    <WrapperHeader @search="args => searchQuery = args.value" @filter="args => filters = args.value" @sort="args => sortBy.value = args.value" />
    <div ref="wrapperHeader">
      <router-view :searchData="{searchQuery: searchQuery, sortBy: sortBy, filters: filters}" :style="{ height: containerHeight + 'px' }" />
    </div>
  </section>
</template>

<style scoped></style>
