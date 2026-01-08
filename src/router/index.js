import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Works from '../views/Works.vue'
import Sketchbooks from '../views/Sketchbooks.vue'
import Videos from '../views/Videos.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/works', name: 'Works', component: Works },
  { path: '/sketchbooks', name: 'Sketchbooks', component: Sketchbooks },
  { path: '/videos', name: 'Videos', component: Videos },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
