<template>
  <div class="modal-wrapper" @click.self="closeModal">
    <div class="wholemodal">
      <div class="projectmodal">
        <h2>Are you sure want to delete file</h2>
        <div>
            <button>Cancel</button>
            <button>Ok</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectName: null,
    };
  },
  methods: {
    assignProjectName() {
      const project = this.$store.state.ProjectStore.UserProjects;
      for (let i in project) {
        if (project[i] == this.projectName) {
          alert("project already exist");
          this.projectName = "";
          return;
        }
      }
      if (!this.projectName || this.projectName.trim() === "") {
        alert("Please enter valid project name");
        return;
      }
      this.$store.dispatch("ProjectStore/sendProjectName", this.projectName);
    },
    closeModal() {
      this.$store.commit("ProjectStore/displayModal");
    },
  },
};
</script>
<style scoped>
.projectmodal h2 {
  color: white;
}
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  width: 30px;
  height: 30px;
}
.wholemodal {
  height: 200px;
  width: 400px;
  position: fixed;
  margin-top: 300px;
  margin-left: 70px;
  background-color: black;
  z-index: 20;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
input {
  margin: 5px;
  padding: 3px;
}
.modal-wrapper {
  height: 100vh;
  width: 100vw;
  z-index: 19;
}
</style>






