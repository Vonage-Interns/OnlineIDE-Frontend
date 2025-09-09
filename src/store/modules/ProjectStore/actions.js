import API_BASE_URL from "../../../config";
import StorageWrapper from "../../../storageWrapper";
import METHODS  from "../../../httpMethods"

export default {
    async folderInsideFolder(context, payload) {
        const token = StorageWrapper.get("token");
        const res = await fetch(`${API_BASE_URL}/api/folders`, {
            method: METHODS.POST,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "name": payload.name,
                "projectId": context.state.projectId,
                "parentFolderId": payload.id
            })
        });
        const response = await res.json();
        context.commit('FileSelected/FOLDER_INSIDE_FOLDER', { folderId: response.id, folderName: payload.name, parentFolderId: payload.id }, { root: true });
    },
    async sendProjectName({ commit, rootState }, payload) {
        const name = { "name": payload };
        try {
            const res = await fetch(`${API_BASE_URL}/api/projects`, {
                method: METHODS.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${rootState.auth.token}`
                },
                body: JSON.stringify(name)
            });
            const data = await res.json();
            const projectdetails = {
                projectId: data.data.id,
                projectName: data.data.name,
            }
            commit('FileSelected/CLEAR_ALL', null, { root: true });
            commit('FileSelected/MAKE_FOLDER_EMPTY', null, { root: true })
            commit('ShowFiles/MAKE_FILE_EMPTY', null, { root: true })
            commit('FileSelected/MAKE_FILE_RESPONSE_EMPTY', null, { root: true })
            commit('SET_NEW_PROJECT_NAME_WITH_ID', projectdetails)
            commit('MAKE_PROJECT', projectdetails);
        }
        catch (e) {
            console.log("The error that im facing is this", e);
        }
    },
    async deleteProject({ commit, state }, project) {
        try {
            const token = StorageWrapper.get("token");
            await fetch(`${API_BASE_URL}/api/projects/${state.projectId}`, {
                method: METHODS.DELETE,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            commit('REMOVE_PROJECT', project)
            commit('FileSelected/MAKE_FILE_RESPONSE_EMPTY', null, { root: true })
            commit('ShowFiles/MAKE_FILE_EMPTY', null, { root: true })
            commit('FileSelected/MAKE_FOLDER_EMPTY', null, { root: true });
            commit('DELETE_SET_PROJECT_NAME_WITH_ID', project);
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async updateProjectName({ state, commit }, payload) {
        const token = StorageWrapper.get("token");
        const res = await fetch(`${API_BASE_URL}/api/projects/updateProjectName`, {
            method: METHODS.PATCH,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "id": state.projectId,
                "updateName": payload.newName,
            })
        });
        const response = await res.json();
        console.log(response);
        commit('RENAME_USER_PROJECT', payload);
    },
    setProjectNameAndId({ commit }, payload) {
        if (payload) {
            commit('FETCH_USER_PROJECTS', payload);
            commit('SET_PROJECT_NAME_WITH_IDS', payload);
        }

    }
}