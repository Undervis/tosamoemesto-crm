import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import CategoryEditor from '@/views/editors/CategoryEditor.vue'
import FoodEditor from '@/views/editors/FoodEditor.vue'
import Catalogue from '@/views/Catalogue.vue'
import Orders from '@/views/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Dashboard, name: 'Dashboard', meta: { verboseName: 'Дашборд' } },
    {
      path: '/orders',
      component: Orders,
      name: 'Orders',
      meta: { type: 'list', verboseName: 'Заказы', pluralVerboseName: 'Заказ', apiEndPoint: '/orders' }
    },
    {
      path: '/catalogue', component: Catalogue, name: 'Catalogue', children: [
        {
          path: '/catalogue/food',
          component: Catalogue,
          name: 'CatalogueFood',
          meta: { type: 'list', verboseName: 'Блюда', pluralVerboseName: 'Блюдо', apiEndPoint: '/food' }
        },
        {
          path: '/catalogue/additions',
          component: Catalogue,
          name: 'CatalogueAdditions',
          meta: { type: 'list', verboseName: 'Дополнения', pluralVerboseName: 'Дополнение', apiEndPoint: '/addition' }
        },
        {
          path: '/catalogue/category',
          component: Catalogue,
          name: 'CatalogueCategory',
          meta: { type: 'list', verboseName: 'Категории', pluralVerboseName: 'Категория', apiEndPoint: '/category' }
        }
      ]
    },
    {
      path: '/catalogue/foods/edit/:id',
      component: FoodEditor,
      name: 'FoodEditor',
      meta: { type: 'editor', apiEndPoint: `/food/`, parent: "CatalogueFood" }
    },
    {
      path: '/catalogue/category/edit/:id',
      component: CategoryEditor,
      name: 'CategoryEditor',
      meta: { type: 'editor', apiEndPoint: `/category/`, parent: "CatalogueCategory" }
    }
  ]
})

export default router
