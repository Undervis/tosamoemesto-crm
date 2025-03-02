<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
import Wrapper from '@/components/Wrapper.vue'
import MainHeader from '@/components/MainHeader.vue'
</script>

<template>
  <main>
    <MainHeader />
    <section class="row g-0 vh-100 w-100 position-fixed">
      <div class="col-auto">
        <Sidebar />
      </div>
      <div class="col">
        <Wrapper />
      </div>
    </section>
  </main>
</template>

<style scoped></style>
