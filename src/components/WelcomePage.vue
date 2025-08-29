<template>
    <div class="welcome">
    <div :style="content">
    <h1>{{en.hi}}{{username}}🎉</h1>
    <h1>{{en.welcome_to_vonage}}</h1>
    </div>
    </div>
</template>
<script>
import en from '@/locales/en';

export default{
  data(){
    return{
      en,
    }
  },
 computed:{
  username(){
    const email=localStorage.getItem('email')
    return email.split('@')[0];
  },
  content(){
    const isopen=this.$store.state.FileStore.slideropen
    return {
     marginLeft:isopen?'-150px':'90px',
     paddingTop:'300px'
    }
  }
 }
}
</script>

<style scoped>
.welcome{
  height:100vh; 
  width: 1440px;
  font-size:20px;
  background:linear-gradient(skyblue,pink);
  
}

.welcome h1{
    color:black;
    text-align:center
}
</style>