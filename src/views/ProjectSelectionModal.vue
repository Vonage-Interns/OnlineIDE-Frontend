<template>
    <div class="modal-wrapper" @click.self="closeModal" v-if="this.$store.getters['ProjectStore/checkProjectsAvailability']">
    <div class="select-modal">
        <img src="@/assets/crossicon.png" class="close-btn" @click="closeModal"/>
        <h1 class="modal-title">{{en.select_the_project}}</h1>
        <div v-for="(project,index) in fetchProjects()" :key="index" class="project" @click="handleProjectShow(index,project) ">
            <h5 v-on:mouseover="onMouseOver(index)" v-on:mouseleave="onMouseLeave()" v-bind:style="{backgroundColor:projectIndex==index?'grey':'black'}">{{project}}</h5>
        </div>
    </div>
    </div>
    <div class="modal-wrapper" @click.self="closeModal" v-else>
    <div class="select-modal">
        <img src="@/assets/crossicon.png" class="close-btn" @click="closeModal"/>
        <h1 class="modal-title">{{en.no_projects}}</h1>
    </div>
    </div>
</template>
<script>
import en from '@/locales/en';
export default({
    data(){
        return{
            en,
            indexOfClickedProject:null,
            projectIndex:null,
        }
    },
    methods:{
        handleProjectShow(index,project){
            this.$store.commit('FileSelected/clearAll');
            this.indexOfClickedProject=index;
            this.$store.commit('ProjectStore/assignSelectedproject',project);
        },
        closeModal(){
            this.$store.commit('ProjectStore/displayProjects')
        },
        onMouseOver(index){
            this.projectIndex=index;
        },
        onMouseLeave(){
            this.projectIndex=null;
        },
        fetchProjects(){
            return this.$store.getters['ProjectStore/fetchProjects']
        }
    }
})
</script>
<style scoped>
.select-modal {
  max-height: 400px; 
  overflow-y: auto;  
  width: 400px;       
  position: fixed;
  margin-top: 300px;
  margin-left: 550px;
  background-color: black;
  z-index: 20;
  border-radius: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
}
/* .select-modal h1{
    padding: 15px;
} */
.project{
    padding:5px
}
.project h5{
    width:auto;
    padding:5px;
    font-size:20px;
    font-family: sans-serif;
}
.modal-wrapper{
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 999;
}
.modal-title{
    font-size:35px
}
.project h5:hover {
  cursor: pointer;
}
.close-btn{
    position:absolute;
    top:0;
    right:0;
    width:30px;
    height:30px;
    padding:10px
}
</style> 