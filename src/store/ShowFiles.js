import API_BASE_URL from "@/config";
import StorageWrapper from "./storageWrapper";
export default {
    namespaced: true,
    state() {
        return {
            clicked: false,
            projectFiles: [],
            projectFilesOutside: []
        }
    },
    mutations: {
        userClick(state) {
            state.clicked = !state.clicked
        },
        assignFiles(state, filesofroot) {
            state.projectFilesOutside = filesofroot;
            for (let x in filesofroot) {
                state.projectFiles.push(filesofroot[x].name)
            }
        },
        addToFiles(state, fileName) {
            state.projectFiles.push(fileName);
        },
        addToOutsideFiles(state, payload) {
            state.projectFilesOutside.push(payload);
        },
        makeFileEmpty(state) {
            state.projectFilesOutside = []
            state.projectFiles = []
        },
        updateprojectFilesOutside(state, payload) {
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
        updateProjectFiles(state, payload) {
            for (let i in state.projectFiles) {
                if (state.projectFiles[i] == payload.oldFile) {
                    state.projectFiles[i] = payload.newFile;
                    break;
                }
            }
        }
    },
    actions: {
        async deleteFile({ state, commit }, payload) {
            const token = StorageWrapper.get("token"); 
            if (payload.location == 0) {
                for (let x of state.projectFilesOutside) {
                    if (x.name == payload.fileName) {
                        await fetch(`${API_BASE_URL}/api/files/${x.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        commit('updateprojectFilesOutside', { name: x.name, id: x.id });

                    }
                }
            }
        },
        async userClicked({ rootGetters, rootState, commit }) {
            commit('userClick')
            if (rootState.auth.rootRendering || rootState.ProjectStore.projectChange) {
                if (rootState.auth.rootRendering)
                    commit('auth/rootRendering', false, { root: true })
                if (rootState.ProjectStore.projectChange)
                    commit('ProjectStore/projectChange', false, { root: true })
                const token = StorageWrapper.get("token"); 
                const proId = rootGetters['ProjectStore/projectId']
                try {
                    const response = await fetch(`${API_BASE_URL}/api/projects/${proId}/root`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                    });
                    const res = await response.json();
                    commit('FileSelected/makeFolderEmpty', null, { root: true })
                    commit('FileSelected/setFoldersFromDB', res.data.folders, { root: true })
                    const filesofroot = res.data.files
                    commit('FileSelected/setAgainNew', filesofroot, { root: true });
                    commit('makeFileEmpty')
                    commit('assignFiles', filesofroot)
                    commit('FileSelected/makeFileResponseEmpty', null, { root: true })
                    await commit('FileSelected/setFileResponseofExisting', filesofroot, { root: true })
                    await commit('FileSelected/setFolderResponseofExisting', res.data.folders, { root: true })
                }
                catch (err) {
                    console.log(err.message)
                }
            }
        }
    },
    getters: {
        checkduplicate: (state) => (file) => {
            for (let i in state.projectFiles) {
                if (state.projectFiles[i] == file)
                    return true;
            }
            return false;
        },
        fileAvailable: (state) => {
            return state.projectFiles;
        },
    }
}