export default {
    projectId(state) {
        return state.projectId;
    },
    checkProjectsAvailability: (state) => {
        return state.projectsExist;
    },
    fetchProjects(state) {
        return state.UserProjects
    }

}