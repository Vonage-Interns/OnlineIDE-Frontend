<template>
  <div>
    <header>
      <img src="@/assets/image1.png" alt="" class="header-img" />
      <div class="header-center">
        <img src="https://avatars.githubusercontent.com/u/3462323" alt="" class="gitimage" />
        <p class="editor">{{ en.editor }}</p>
      </div>
      <div>
        <button id="select-project" @click="fetchProjects">{{ en.select_project }}</button>
        <button id="project" @click="checkNewProject">{{ en.new_project }}</button>
      </div>
    </header>
  </div>
</template>
<script>
import en from "@/locales/en.js";
export default ({
    data(){
        return{
            en,
            newProject:false,
        }
    },
    methods:{
        checkNewProject(){
            this.$store.commit('ProjectStore/displayModal');
        },
        fetchProjects(){
            this.$store.commit('ProjectStore/displayProjects')
        }
    },
})
</script>
<style scoped>
header{
    background-color:#3d3b3b;
    width:100%;
    height:50px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding:2px;
    position: fixed;
    z-index:999
}

button {
    border-radius: 0 !important;
    font-size: 14px;
    padding: 10px 20px;
}

.gitimage{
    height:30px;
    width:30px;
    border-radius: 30px;
}
.header-img{
    width:200px;
    height:50px;
    margin-left: 20px;
    object-fit: cover;
}

.header-center{
    display: flex;
    align-items: center;
    justify-content: center;
    gap:2px
}
.editor{
    color:white;
    font-size: 16px;
    font-family: sans-serif;
}
#project,#select-project{
    width: auto;
    height:40px;
    margin:7px;
    border-radius: 10px;
    border: none;
    font-size:16px;
    font-family: sans-serif;
    cursor: pointer;
    background-color: #1674f0;
    color: white;
}
#project:hover{
    background-color:rgb(234, 176, 218); 
    
}
</style>