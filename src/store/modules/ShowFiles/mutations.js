export default {
    USER_CLICK(state) {
        state.clicked = !state.clicked
    },
    ASSIGN_FILES(state, filesofroot) {
        state.projectFilesOutside = filesofroot;
        for (let x in filesofroot) {
            state.projectFiles.push(filesofroot[x].name)
        }
    },
    ADD_TO_FILES(state, fileName) {
        state.projectFiles.push(fileName);
    },
    ADD_TO_OUTSIDE_FILES(state, payload) {
        state.projectFilesOutside.push(payload);
    },
    MAKE_FILE_EMPTY(state) {
        state.projectFilesOutside = []
        state.projectFiles = []
    },
    UPDATE_PROJECT_FILES_OUTSIDE(state, payload) {
        for (let i = 0; i < state.projectFilesOutside.length; i++) {
            if (state.projectFilesOutside[i].id === payload.id) {
                for (let z = 0; z < state.projectFiles.length; z++) {
                    if (state.projectFiles[z] == payload.name) {
                        state.projectFiles.splice(z, 1);
                    }
                }
                state.projectFilesOutside.splice(i, 1);
                break;
            }
        }
    },
    UPDATE_PROJECT_FILES(state, payload) {
        for (let i in state.projectFiles) {
            if (state.projectFiles[i] == payload.oldFile) {
                state.projectFiles[i] = payload.newFile;
                break;
            }
        }
    }
}