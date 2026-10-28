import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import TabsPage from '../views/TabsPage.vue'
import FavoritePage from '../views/FavoritePage.vue'
import ProfilePage from '../views/ProfilePage.vue'  
import WeatherPage from '../views/WeatherPage.vue'
import WeatherApiPage from '../views/WeatherApiPage.vue'  

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  // {
  //   path: '/home',
  //   name: 'Home',
  //   component: HomePage
  // },
  
  {
    path: "/tabs",
    component: TabsPage,
    children: [
      {
        path: "",
        redirect: "/tabs/home"
      },
      {
        path: "home",
        component: HomePage
      },
      {
        path: "favorite",
        component: FavoritePage
      },
      {
        path: "profile",
        component: ProfilePage
      },
      {
        path: "weather",
        component: WeatherPage
      },
      {
        path: "weather-api",
        component: WeatherApiPage
      }
    ]
  },
   {
    path: "/home",
    redirect: "/tabs/home"
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
