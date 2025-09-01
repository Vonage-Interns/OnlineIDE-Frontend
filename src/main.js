
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import StorageWrapper from './store/storageWrapper'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFile, faFolder ,faChevronRight, faChevronDown} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faFile, faFolder,faChevronRight,faChevronDown)

const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true
}

const app = createApp(App)
app.use(store)
app.use(router) 

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(Toast, toastOptions)

if(localStorage.getItem('token') && !store.state.auth.isloggedIn){
  store.dispatch('auth/checkLogin',{
    email:StorageWrapper.get("email"),
    password:StorageWrapper.get("password")
  })
}

app.mount('#app')

