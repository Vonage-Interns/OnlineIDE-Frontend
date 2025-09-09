import API_BASE_URL from "../../../config";
import StorageWrapper from "../../../storageWrapper";
import METHODS  from "../../../httpMethods"

export default {
    async deleteFile({ state, commit }, payload) {
        const token = StorageWrapper.get("token");
        if (payload.location == 0) {
            for (let x of state.projectFilesOutside) {
                if (x.name == payload.fileName) {
                    await fetch(`${API_BASE_URL}/api/files/${x.id}`, {
                        method: METHODS.DELETE,
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    commit('UPDATE_PROJECT_FILES_OUTSIDE', { name: x.name, id: x.id });

                }
            }
        }
    },
    async userClicked({ rootGetters, rootState, commit }) {
        commit('USER_CLICK')
        if (rootState.auth.rootRendering || rootState.ProjectStore.projectChange) {
            if (rootState.auth.rootRendering)
                commit('auth/ROOT_RENDERING', false, { root: true })
            if (rootState.ProjectStore.projectChange)
                commit('ProjectStore/PROJECT_CHANGE', false, { root: true })
            const token = StorageWrapper.get("token");
            const proId = rootGetters['ProjectStore/projectId']
            try {
                const response = await fetch(`${API_BASE_URL}/api/projects/${proId}/root`, {
                    method: METHODS.GET,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const res = await response.json();
                commit('FileSelected/MAKE_FOLDER_EMPTY', null, { root: true })
                commit('FileSelected/SET_FOLDERS_FROM_DB', res.data.folders, { root: true })
                const filesofroot = res.data.files
                commit('FileSelected/SET_AGAIN_NEW', filesofroot, { root: true });
                commit('MAKE_FILE_EMPTY')
                commit('ASSIGN_FILES', filesofroot)
                commit('FileSelected/MAKE_FILE_RESPONSE_EMPTY', null, { root: true })
                await commit('FileSelected/SET_FILE_RESPONSE_OF_EXISTING', filesofroot, { root: true })
                await commit('FileSelected/SET_FOLDER_RESPONSE_OF_EXISTING', res.data.folders, { root: true })
            }
            catch (err) {
                console.log(err.message)
            }
        }
    }
}