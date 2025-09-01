<template>
   <div class="home">
   <the-header></the-header>
   <content-section></content-section>
   </div>
</template>


<script>
import TheHeader from "./TheHeader.vue";
import ContentSection from './ContentSection.vue';

export default{
  components:{
  TheHeader,
  ContentSection,
}
}

</script>


<style scoped>
.home{
    display: flex;
    flex-direction: column;
    gap:0px;
    position: fixed;
    width:100%
}
</style>