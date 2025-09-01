<template>
   <router-view></router-view>
   <ToastContainer />
</template>


<script>
import { ToastContainer } from 'vue-toastification'
export default{
  components:{
    ToastContainer
  }
}
</script>



<style>
*{
  margin: 0;
}
#app {
  font-family: sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>

