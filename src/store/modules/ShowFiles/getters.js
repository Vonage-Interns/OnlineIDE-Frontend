export default {
    checkduplicate: (state) => (file) => {
        for (let i in state.projectFiles) {
            if (state.projectFiles[i] == file)
                return true;
        }
        return false;
    },
    fileAvailable: (state) => {
        return state.projectFiles;
    }
}