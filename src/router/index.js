import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import SignUp from '../views/SignUp.vue'
import LoginView from '../views/LoginView.vue'
import CompilerView from '../views/CompilerView.vue'
import { useToast } from 'vue-toastification'
import StorageWrapper from '@/store/storageWrapper'
const toast=useToast();
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/login/:anything',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView
  },
  {
    path: '/compiler',
    name: 'Compiler',
    component: CompilerView,
    beforeEnter: (to, from, next) => {
      const token = StorageWrapper.get("token"); 
      if (token) {
        next()
      } else {
        toast.error("User is Logged out ! Please Login");

        next('/login')
      }
    }
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
