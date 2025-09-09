export default {
    MAKE_PROJECT(state, payload) {
        state.projectsExist = true;
        state.projectName = payload.projectName;
        state.projectId = payload.projectId;
        state.modalDisplay = false;
        state.projectChange = true
        if (!state.UserProjects.find(project => project === payload)) {
            state.UserProjects = [...state.UserProjects, payload.projectName];
        }

    },
    ASSIGN_SELECTED_PROJECT(state, payload) {
        for (let i = 0; i < state.projectNamewithId.length; i++) {
            if (state.projectNamewithId[i].projectName === payload) {
                state.projectId = state.projectNamewithId[i].projectId;
                break;
            }
        }
        state.projectChange = true
        state.projectName = payload
        state.modalDisplay = false;
        state.projectsDisplay = false;
    },
    DISPLAY_MODAL(state) {
        state.modalDisplay = !state.modalDisplay
    },
    FETCH_USER_PROJECTS(state, payload) {
        state.UserProjects.splice(0)
        state.projectsExist = false
        for (let i = 0; i < payload.length; i++) {
            state.UserProjects.push(payload[i].projectName);
        }
        if (state.UserProjects.length > 0) {
            state.projectsExist = true;
        }
    },
    DISPLAY_PROJECTS(state) {
        state.projectsDisplay = !state.projectsDisplay;
    },
    SET_PROJECT_NAME_WITH_IDS(state, payload) {
        for (let i of payload) {
            state.projectNamewithId.push(i)
        }
    },
    SET_NEW_PROJECT_NAME_WITH_ID(state, payload) {
        state.projectNamewithId.push(payload)
    },
    PROJECT_CHANGE(state, payload) {
        state.projectChange = payload;
    },
    REMOVE_PROJECT(state, project) {
        state.UserProjects = state.UserProjects.filter(pro => pro !== project);
        state.projectName = null
    },
    DELETE_SET_PROJECT_NAME_WITH_ID(state, payload) {
        state.projectNamewithId = state.projectNamewithId.filter(pro => pro.projectName !== payload);
    },
    RENAME_USER_PROJECT(state, payload) {
        for (let a in state.UserProjects) {
            if (state.UserProjects[a] == payload.projectName) {
                state.UserProjects[a] = payload.newName;
                state.projectName = payload.newName;
                return;
            }
        }
    }
}