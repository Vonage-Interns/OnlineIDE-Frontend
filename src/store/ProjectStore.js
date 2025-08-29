import API_BASE_URL from "@/config";

import StorageWrapper from "./storageWrapper";
export default ({
    namespaced: true,
    state() {
        return {
            projectName: null,
            modalDisplay: false,
            UserProjects: [],
            projectsDisplay: false,
            projectNamewithId: [],
            projectId: null,
            projectChange: false,
            projectsExist: false,
        }
    },
    mutations: {
        makeProject(state, payload) {
            state.projectsExist = true;
            state.projectName = payload.projectName;
            state.projectId = payload.projectId;
            state.modalDisplay = false;
            state.projectChange = true
            if (!state.UserProjects.find(project => project === payload)) {
                state.UserProjects = [...state.UserProjects, payload.projectName];
            }

        },
        assignSelectedproject(state, payload) {
            // state.projectNamewithId.splice(0)
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
        displayModal(state) {
            state.modalDisplay = !state.modalDisplay
        },
        fetchUserProjects(state, payload) {
            state.UserProjects.splice(0)
            state.projectsExist = false
            for (let i = 0; i < payload.length; i++) {
                state.UserProjects.push(payload[i].projectName);
            }
            if (state.UserProjects.length > 0) {
                state.projectsExist = true;
            }
        },
        displayProjects(state) {
            state.projectsDisplay = !state.projectsDisplay;
        },
        setProjectNamewithIds(state, payload) {
            for (let i of payload) {
                state.projectNamewithId.push(i)
            }
        },
        setNewProjectNamewithId(state, payload) {
            state.projectNamewithId.push(payload)
        },
        projectChange(state, payload) {
            state.projectChange = payload;
        },
        removeProject(state, project) {
            state.UserProjects = state.UserProjects.filter(pro => pro !== project);
            state.projectName = null
        },
        deleteSetProjectNamewithId(state, payload) {
            state.projectNamewithId = state.projectNamewithId.filter(pro => pro.projectName !== payload);
        },
        renameUserProject(state, payload) {
            for (let a in state.UserProjects) {
                if (state.UserProjects[a] == payload.projectName) {
                    state.UserProjects[a] = payload.newName;
                    state.projectName = payload.newName;
                    return;
                }
            }
        }
    },
    getters: {
        projectId(state) {
            return state.projectId;
        },
        checkProjectsAvailability: (state) => {
            return state.projectsExist;
        },
        fetchProjects(state) {
            return state.UserProjects
        }
    },
    actions: {
        async folderInsideFolder(context, payload) {
            const token = StorageWrapper.get("token"); 
            const res = await fetch(`${API_BASE_URL}/api/folders`, {
                method: 'POST',
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
            context.commit('FileSelected/folderInsideFolder', { folderId: response.id, folderName: payload.name, parentFolderId: payload.id }, { root: true });
        },
        async sendProjectName({ commit, rootState }, payload) {
            const name = { "name": payload };
            try {
                const res = await fetch(`${API_BASE_URL}/api/projects`, {
                    method: 'POST',
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
                commit('FileSelected/clearAll', null, { root: true });
                commit('FileSelected/makeFolderEmpty', null, { root: true })
                commit('ShowFiles/makeFileEmpty', null, { root: true })
                commit('FileSelected/makeFileResponseEmpty', null, { root: true })
                commit('setNewProjectNamewithId', projectdetails)
                commit('makeProject', projectdetails);
            }
            catch (e) {
                console.log("The error that im facing is this", e);
            }
        },
        async deleteProject({ commit, state }, project) {
            try {
                const token = StorageWrapper.get("token"); 
                await fetch(`${API_BASE_URL}/api/projects/${state.projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('removeProject', project)
                commit('FileSelected/makeFileResponseEmpty', null, { root: true })
                commit('ShowFiles/makeFileEmpty', null, { root: true })
                commit('FileSelected/makeFolderEmpty', null, { root: true });
                commit('deleteSetProjectNamewithId', project);
            }
            catch (err) {
                console.log(err.message)
            }
        },
        async updateProjectName({ state, commit }, payload) {
            const token = StorageWrapper.get("token"); 
            const res = await fetch(`${API_BASE_URL}/api/projects/updateProjectName`, {
                method: 'PATCH',
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
            commit('renameUserProject', payload);
        },
        setProjectNameAndId({ commit }, payload) {
            if (payload) {
                commit('fetchUserProjects', payload);
                commit('setProjectNamewithIds', payload);
            }

        }
    },
})