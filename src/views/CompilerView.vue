<template>
    <div id="wholecompiler"   v-bind:style="{ opacity: ($store.state.ProjectStore.modalDisplay || $store.state.ProjectStore.projectsDisplay) ? 0.7 : 1 }">
      <compiler-header></compiler-header>
      <side-bar></side-bar>
    </div>
    <div class="modal">
      <create-project-modal  v-if="$store.state.ProjectStore.modalDisplay"></create-project-modal>
    </div>
    <div v-bind:class="selectModal">
      <project-selection-modal v-if="$store.state.ProjectStore.projectsDisplay"></project-selection-modal>
    </div>
</template>
<script>
import ProjectSelectionModal from '../views/ProjectSelectionModal.vue'
import CompilerHeader from '../views/CompilerHeader.vue'
import CreateProjectModal from './CreateProjectModal.vue';
import SideBar from './SideBar.vue'
export default{
  components:{
    CompilerHeader,
    SideBar,
    CreateProjectModal,
    ProjectSelectionModal
  },
}
</script>
<style scoped>
#wholecompiler{
    position:fixed;
    display: flex;
    flex-direction: column;
    z-index:10;
}
.modal{
 display: flex;
 align-items: center;
 margin-left:500px;
}
</style>












