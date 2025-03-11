<script setup></script>

<template>
  <div class="d-flex flex-column flex-shrink-0 px-2 h-100" style="width: auto; min-width: 12rem">
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/" class="nav-link text-white">
          <i class="bi bi-speedometer2 me-2"></i>
          Дашборд
        </router-link>
      </li>
      <li>
        <router-link to="/orders" class="nav-link text-white">
          <i class="bi bi-cart me-2"></i>
          Заказы
        </router-link>
      </li>
      <li class="card overflow-hidden my-1" data-bs-theme="dark">
        <div class="card-header text-white">
          <i class="bi bi-list-ul me-2"></i>
          Каталог
        </div>
        <div>
          <ul class="list-group-flush p-0">
            <li class="list-group-item position-relative">
              <router-link
                :to="{ name: 'CatalogueCategory' }"
                class="nav-link rounded-0 stretched-link"
                >Категории</router-link
              >
            </li>
            <li class="list-group-item position-relative">
              <router-link :to="{ name: 'CatalogueFood' }" class="nav-link rounded-0 stretched-link"
                >Блюда</router-link
              >
            </li>
            <li class="list-group-item position-relative">
              <router-link
                :to="{ name: 'CatalogueAddition' }"
                class="nav-link rounded-0 stretched-link"
                >Дополнения</router-link
              >
            </li>
          </ul>
        </div>
      </li>
      <li>
        <a href="#" class="nav-link text-white">
          <i class="bi bi-people me-2"></i>
          Пользователи
        </a>
      </li>
      <li>
        <a href="#" class="nav-link text-muted disabled">
          <i class="bi bi-percent me-2"></i>
          Акции
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
