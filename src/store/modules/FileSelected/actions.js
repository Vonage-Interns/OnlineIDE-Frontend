import API_BASE_URL from "../../../config";
import StorageWrapper from "../../../storageWrapper";
import METHODS  from "../../../httpMethods"

export default {
    async addToFolder(context, payload) {
        try {
            const token = StorageWrapper.get("token");
            const proId = context.rootGetters['ProjectStore/projectId']
            const response = await fetch(`${API_BASE_URL}/api/folders`, {
                method: METHODS.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "name": payload,
                    "projectId": proId,
                    "parentFolderId": null
                })
            });
            const res = await response.json();
            context.commit('SET_FOLDER_RESPONSE', res)
            context.commit('ADD_TO_FOLDER', { "id": res.id, "name": res.name })
        }
        catch (err) {
            console.log(err);
        }
    },
    async addFile(context, payload) {
        try {
            const token = StorageWrapper.get("token");
            const proId = context.rootGetters['ProjectStore/projectId']
            const initialContent = {
                1: ""
            };
            const response = await fetch(`${API_BASE_URL}/api/files`, {
                method: METHODS.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "fileName": payload,
                    "content": initialContent,
                    "type": "string",
                    "projectID": proId,
                    "folderID": null
                })
            });
            context.commit('ShowFiles/ADD_TO_FILES', payload, { root: true })
            const res = await response.json();
            context.commit('ShowFiles/ADD_TO_OUTSIDE_FILES', { id: res.data.id, name: payload }, { root: true });
            context.commit('NEW_CHANGE_FILE_INSIDE_FOLDER', { id: res.data.id, fileName: payload, folderId: null });
            context.commit('SET_FILE_RESPONSE', res)
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async addFileToFolder(context, payload) {
        try {
            const token = StorageWrapper.get("token");
            const proId = context.rootGetters['ProjectStore/projectId']
            context.commit('GET_FOLDER_ID', payload[1])
            const folderId = context.state.particularFolderId
            const initialContent = {
                1: ""   // start with empty first line
            };
            const response = await fetch(`${API_BASE_URL}/api/files`, {
                method: METHODS.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "fileName": payload[0],
                    "content": initialContent,
                    "type": "string",
                    "projectID": proId,
                    "folderID": folderId
                }
                )
            });
            const res = await response.json();
            context.commit('CHANGE_NEW_AGAIN', { res: res, folderId: folderId });
            context.commit('FILES_INSIDE_FOLDER', { id: res.data.id, payload: payload })
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async addFileToFolderInFolder(context, payload) {
        try {
            const token = StorageWrapper.get("token");
            const proId = context.rootGetters['ProjectStore/projectId']
            const folderId = context.getters['getFolderIdInFolder'](payload[1], payload[0])
            const initialContent = {
                1: ""   // start with empty first line
            };
            const response = await fetch(`${API_BASE_URL}/api/files`, {
                method: METHODS.POST,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "fileName": payload[2],
                    "content": initialContent,
                    "type": "string",
                    "projectID": proId,
                    "folderID": folderId
                }
                )
            });
            const res = await response.json();
            context.commit('CHANGE_NEW_AGAIN', { res: res, folderId: folderId });
        }
        catch (err) {
            console.log("Error in addFileToFolderInFolder:", err.message)
        }
    },
    async FetchExistedFilesInFolder({ state, commit, rootGetters }, folderName) {
        const token = StorageWrapper.get("token");
        const proId = rootGetters['ProjectStore/projectId'];
        state.initialCall[folderName] = true;

        commit('GET_FOLDER_ID', folderName);
        const folderId = state.particularFolderId;
        try {
            let page;
            let existing = state.pageCounter.find(item => item.folderId === folderId);

            if (!existing) {
                state.pageCounter.push({ folderId: folderId, page: 0 });
                page = 0;
            }
            else {
                existing.page += 1;
                page = existing.page;
            }

            const response = await fetch(`${API_BASE_URL}/api/projects/${proId}/folders/${folderId}/children?page=${page}&size=2`, {
                method: METHODS.GET,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const res = await response.json();
                commit('SET_FILE_IN_FOLDER_RESPONSE', res.files);
                if (state.c == 0) {
                    commit('FOLDER_INSIDE_FOLDER_SETTER', { folders: res.folders, parentIdFolder: folderId });
                    state.c = 1;
                }
                commit('FILES_INSIDE_FOLDER_SETTER', { files: res.files, folderId });
                commit('FILES_INSIDE_FOLDER_EXISTED', { folder: folderName, payload: res.files });
                commit('OPENED_FOLDERS_PUSH', folderName);
                if (res.hasMore == false)
                    state.hideLoadMore[folderName] = true
            }
        } catch (err) {
            console.log("the error is ", err.message);
        }
    },
    async fetchExistedNestedFiles(context, payload) {
        if (context.state.nested.includes(payload.folderId)) return;
        const token = StorageWrapper.get("token");
        const proId = context.rootGetters['ProjectStore/projectId'];
        const response = await fetch(`${API_BASE_URL}/api/projects/${proId}/folders/${payload.folderId}/children`, {
            method: METHODS.GET,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const res = await response.json();
            context.state.nested.push(payload.folderId)
            context.commit('SET_EXISTED_NESTED_FILES', { res: res.files, folderId: payload.folderId })
        }
    },
    async deleteFolder({ commit, state }, folder) {
        try {
            const token = StorageWrapper.get("token");
            commit('GET_FOLDER_ID', folder)
            const folderId = state.particularFolderId
            await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
                method: METHODS.DELETE,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            commit('REMOVE_FOLDER', folder)
            commit('REMOVE_FILES_INSIDE_FOLDER', { parentFolderId: folderId, folder: folder })
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async deleteFileInsideFolder({ state, commit }, payload) {
        const token = StorageWrapper.get("token");
        for (let a of state.fileThatsInsideFolder) {
            if (a.folderId == payload.folderId && a.fileName == payload.fileName) {
                await fetch(`${API_BASE_URL}/api/files/${a.id}`, {
                    method:METHODS.DELETE,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                commit('DELETE_FILE_INSIDE_FOLDER', { folderId: a.folderId, fileName: a.fileName, fileId: a.id });
            }
        }
    },
    async deleteFolderInFolder({ state, commit }, payload) {
        const token = StorageWrapper.get("token");
        for (let a of state.folderThatsInsideFolder) {
            if (a.parentFolderId == payload.parentFolderId && a.folderName == payload.folder) {
                await fetch(`${API_BASE_URL}/api/folders/${a.folderId}`, {
                    method: METHODS.DELETE,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                commit('DELETE_FOLDER_INSIDE_FOLDER', { parentFolderId: a.parentFolderId, folder: payload.folder });
            }
        }
    },
    async editFile({ commit, getters }, payload) {
        try {
            const token = StorageWrapper.get("token");
            const id = getters.getFileId(payload.oldFile)
            await fetch(`${API_BASE_URL}/api/files/fileNameUpdate`, {
                method: METHODS.PATCH,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "fileId": id,
                    "fileName": payload.newFile
                })
            })
            commit('UPDATE_FILE_NAME', payload)
            commit('ShowFiles/UPDATE_PROJECT_FILES', payload, { root: true })
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async editFileInFolder({ commit, getters }, payload) {
        try {
            const token = StorageWrapper.get("token");
            const id = getters.getFileIdInFolder(payload.oldFile, payload.folder)
            await fetch(`${API_BASE_URL}/api/files/fileNameUpdate`, {
                method: METHODS.PATCH,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "fileId": id,
                    "fileName": payload.newFile
                })
            })
            commit('UPDATE_FILE_IN_FOLDER', payload)
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async updateFolderinFolder({ commit, getters }, payload) {
        try {
            const token = StorageWrapper.get("token");
            const id = getters.getFolderIdInFolder(payload.oldFolder, payload.parentFolderId)
            await fetch(`${API_BASE_URL}/api/folders/rename`, {
                method: METHODS.PATCH,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "folderId": id,
                    "updateName": payload.newFolder
                })
            })
            commit('UPDATE_FOLDER_IN_FOLDER', payload)
        }
        catch (err) {
            console.log(err.message)
        }
    },
    async FolderRename({ commit }, payload) {
        const token = StorageWrapper.get("token");
        await fetch(`${API_BASE_URL}/api/folders/rename`, {
            method:METHODS.PATCH,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                "folderId": payload.folder.id,
                "updateName": payload.FolderNew
            })
        });

        commit('UPDATE_FOLDER_NAME', { newName: payload.FolderNew, folderId: payload.folder.id, oldName: payload.folder.name });
    }
}