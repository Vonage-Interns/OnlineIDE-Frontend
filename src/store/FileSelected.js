import API_BASE_URL from "@/config";
import StorageWrapper from "./storageWrapper";
export default ({
    namespaced: true,
    state() {
        return {
            files: [],
            folder: [],
            filesInsideFolder: [],
            fileResponse: [],
            folderResponse: [],
            particularFolderId: null,
            openedFolders: [],
            fileThatsInsideFolder: [],
            pageCounter: [],
            hideLoadMore: [],
            initialCall: [],
            folderThatsInsideFolder: [],
            c: 0,
            nested: []
        }
    },
    mutations: {
        folderInsideFolder(state, payload) {
            if (state.folderThatsInsideFolder.length == 0) {
                state.folderThatsInsideFolder.push(payload);
                return;
            }
            state.folderThatsInsideFolder.push(payload);
            return;
        },
        folderInsideFolderSetter(state, payload) {
            let parentId = payload.parentIdFolder;
            for (let a of payload.folders) {
                let folderId = a.id;
                let folderName = a.name;
                state.folderThatsInsideFolder.push({ folderId: folderId, folderName: folderName, parentFolderId: parentId });
            }
            return;
        },
        openedFoldersPush(state, folderName) {
            state.openedFolders.push(folderName);
        },
        addToFolder(state, payload) {
            state.folder.push(payload);
        },
        setFoldersFromDB(state, payload) {
            for (let i in payload) {
                state.folder.push(payload[i])
            }
        },
        setFileResponse(state, payload) {
            state.fileResponse.push({ id: payload.data.id, fileName: payload.data.name, folderId: payload.data.folderID })
        },
        setFolderResponse(state, payload) {
            state.folderResponse.push({ id: payload.id, folderName: payload.name })
        },
        setFileResponseofExisting(state, payload) {
            for (let i in payload) {
                state.fileResponse.push({ id: payload[i].id, fileName: payload[i].name, folderId: null })
            }
        },
        setFolderResponseofExisting(state, payload) {
            for (let i in payload) {
                state.folderResponse.push({ id: payload[i].id, folderName: payload[i].name })
            }
        },
        setFileinFolderResponse(state, payload) {
            for (let i in payload) {
                state.fileResponse.push({ id: payload[i].id, fileName: payload[i].name, folderId: payload[i].folderID })
            }
        },
        getFolderId(state, payload) {
            for (let i in state.folderResponse) {
                if (state.folderResponse[i].folderName == payload) {
                    state.particularFolderId = state.folderResponse[i].id;
                    break;
                }
            }
        },
        FilesInsideFolder(state, { id, payload }) {
            state.filesInsideFolder.push({ id: id, fileName: payload[0], folderName: payload[1] })
        },
        FilesInsideFolderExisted(state, { folder, payload }) {
            for (let i in payload)
                state.filesInsideFolder.push({ id: payload[i].id, fileName: payload[i].name, folderName: folder })
        },
        filesInsideFolderSetter(state, payload) {
            for (let i in payload.files) {
                state.fileThatsInsideFolder.push({ id: payload.files[i].id, fileName: payload.files[i].name, folderId: payload.folderId })
            }
        },
        setAgainNew(state, payload) {
            for (let file of payload) {
                state.fileThatsInsideFolder.push({ id: file.id, fileName: file.name, folderId: null })
            }
        },
        changeNewAgain(state, payload) {
            state.fileThatsInsideFolder.push({ id: payload.res.data.id, fileName: payload.res.data.name, folderId: payload.folderId });
        },
        makeFolderEmpty(state) {
            state.folder.splice(0);
            state.folderResponse.splice(0)
        },
        makeFileResponseEmpty(state) {
            state.fileResponse = []
            state.openedFolders = []
            state.filesInsideFolder = []
            state.pageCounter = [],
                state.hideLoadMore = [],
                state.initialCall = [],
                state.folderThatsInsideFolder = []
        },
        clearAll(state) {
            state.fileThatsInsideFolder.splice(0);
            state.folderThatsInsideFolder.splice(0);
        },
        newchangeFileInsideFolder(state, payload) {
            state.fileThatsInsideFolder.push(payload);
        },
        removeFolder(state, folderName) {
            state.folder = state.folder.filter(folder => folder.name !== folderName);
        },
        removeFilesInsideFolder(state, payload) {
            state.filesInsideFolder = state.filesInsideFolder.filter(fol => fol.folderName !== payload.folder);
            state.folderThatsInsideFolder = state.folderThatsInsideFolder.filter(fol => fol.parentFolderId !== payload.parentFolderId)
        },
        updateFileName(state, payload) {
            for (let i in state.fileResponse) {
                if (state.fileResponse[i].fileName == payload.oldFile) {
                    state.fileResponse[i].fileName = payload.newFile
                }
            }
        },
        updateFileNameInFolder(state, payload) {
            for (let i in state.filesInsideFolder) {
                if (state.filesInsideFolder[i].fileName == payload.oldFile && state.filesInsideFolder[i].folderName == payload.folder) {
                    state.filesInsideFolder[i].fileName = payload.newFile
                }
            }
        },
        deleteFileInsideFolderUpdate(state, payload) {
            for (let a in state.fileThatsInsideFolder) {
                if (state.fileThatsInsideFolder[a].id == payload.fileId && state.fileThatsInsideFolder[a].folderId == payload.folderId) {
                    state.fileThatsInsideFolder.splice(a, 1);
                    for (let x in state.filesInsideFolder) {
                        if (state.filesInsideFolder[x].fileName == payload.fileName) {
                            state.filesInsideFolder.splice(x, 1);
                        }
                    }
                    return;
                }
            }
        },
        updateTheFolderNames(state, payload) {

            for (let a of state.folder) {
                if (a.id == payload.folderId) {
                    a.name = payload.newName;
                    break;
                }
            }
            for (let a of state.folderResponse) {
                if (a.id == payload.folderId) {
                    a.folderName = payload.newName;
                    break;
                }
            }
            for (let a of state.filesInsideFolder) {
                if (a.folderName == payload.oldName) {
                    a.folderName = payload.newName;
                    return;
                }
            }
        },
        updateFolderInFolder(state, payload) {
            for (let i in state.folderThatsInsideFolder) {
                if (state.folderThatsInsideFolder[i].parentFolderId == payload.parentFolderId && state.folderThatsInsideFolder[i].folderName == payload.oldFolder)
                    state.folderThatsInsideFolder[i].folderName = payload.newFolder
            }
        },
        deleteFolderInsideFolder(state, payload) {
            state.folderThatsInsideFolder = state.folderThatsInsideFolder.filter(
                folder => !(folder.parentFolderId === payload.parentFolderId &&
                    folder.folderName === payload.folder)
            );
        },
        setExistedNestedFiles(state, payload) {
            for (let i in payload.res) {
                state.fileThatsInsideFolder.push({ id: payload.res[i].id, fileName: payload.res[i].name, folderId: payload.folderId })
            }
        }
    },
    actions: {
        async addToFolder(context, payload) {
            try {
                const token = StorageWrapper.get("token"); 
                const proId = context.rootGetters['ProjectStore/projectId']
                const response = await fetch(`${API_BASE_URL}/api/folders`, {
                    method: 'POST',
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
                context.commit('setFolderResponse', res)
                context.commit('addToFolder', { "id": res.id, "name": res.name })
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
                    method: 'POST',
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
                context.commit('ShowFiles/addToFiles', payload, { root: true })
                const res = await response.json();
                context.commit('ShowFiles/addToOutsideFiles', { id: res.data.id, name: payload }, { root: true });
                context.commit('newchangeFileInsideFolder', { id: res.data.id, fileName: payload, folderId: null });
                context.commit('setFileResponse', res)
            }
            catch (err) {
                console.log(err.message)
            }
        },
        async addFileToFolder(context, payload) {
            try {
                const token = StorageWrapper.get("token"); 
                const proId = context.rootGetters['ProjectStore/projectId']
                context.commit('getFolderId', payload[1])
                const folderId = context.state.particularFolderId
                const initialContent = {
                    1: ""   // start with empty first line
                };
                const response = await fetch(`${API_BASE_URL}/api/files`, {
                    method: 'POST',
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
                context.commit('changeNewAgain', { res: res, folderId: folderId });
                context.commit('FilesInsideFolder', { id: res.data.id, payload: payload })
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
                    method: 'POST',
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
                context.commit('changeNewAgain', { res: res, folderId: folderId });
                // console.log("the response of the project selection is ", res);
                // context.commit('changeNewAgain', { res: res, folderId: folderId });
                // context.commit('FilesInsideFolder', { id: res.data.id, payload: payload })
            }
            catch (err) {
                console.log("Error in addFileToFolderInFolder:", err.message)
            }
        },
        async FetchExistedFilesInFolder({ state, commit, rootGetters }, folderName) {
            // if (getters.isFolderOpened(folderName)) return;

            const token = StorageWrapper.get("token"); 
            const proId = rootGetters['ProjectStore/projectId'];
            state.initialCall[folderName] = true;

            commit('getFolderId', folderName);
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
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const res = await response.json();
                    commit('setFileinFolderResponse', res.files);
                    if (state.c == 0) {
                        commit('folderInsideFolderSetter', { folders: res.folders, parentIdFolder: folderId });
                        state.c = 1;
                    }
                    commit('filesInsideFolderSetter', { files: res.files, folderId });
                    commit('FilesInsideFolderExisted', { folder: folderName, payload: res.files });
                    commit('openedFoldersPush', folderName);
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
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const res = await response.json();
                context.state.nested.push(payload.folderId)
                context.commit('setExistedNestedFiles', { res: res.files, folderId: payload.folderId })
            }
        },
        async deleteFolder({ commit, state }, folder) {
            try {
                const token = StorageWrapper.get("token"); 
                commit('getFolderId', folder)
                const folderId = state.particularFolderId
                await fetch(`${API_BASE_URL}/api/folders/${folderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                commit('removeFolder', folder)
                commit('removeFilesInsideFolder', { parentFolderId: folderId, folder: folder })
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
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    commit('deleteFileInsideFolderUpdate', { folderId: a.folderId, fileName: a.fileName, fileId: a.id });
                }
            }

        },
        async deleteFolderInFolder({ state, commit }, payload) {
            const token = StorageWrapper.get("token"); 
            for (let a of state.folderThatsInsideFolder) {
                if (a.parentFolderId == payload.parentFolderId && a.folderName == payload.folder) {
                    await fetch(`${API_BASE_URL}/api/folders/${a.folderId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    commit('deleteFolderInsideFolder', { parentFolderId: a.parentFolderId, folder: payload.folder });
                }
            }
        },
        async editFile({ commit, getters }, payload) {
            try {
                const token = StorageWrapper.get("token"); 
                const id = getters.getFileId(payload.oldFile)
                await fetch(`${API_BASE_URL}/api/files/fileNameUpdate`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "fileId": id,
                        "fileName": payload.newFile
                    })
                })
                commit('updateFileName', payload)
                commit('ShowFiles/updateProjectFiles', payload, { root: true })
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
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "fileId": id,
                        "fileName": payload.newFile
                    })
                })
                commit('updateFileNameInFolder', payload)
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
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        "folderId": id,
                        "updateName": payload.newFolder
                    })
                })
                commit('updateFolderInFolder', payload)
            }
            catch (err) {
                console.log(err.message)
            }
        },
        async FolderRename({ commit }, payload) {
            const token = StorageWrapper.get("token"); 
            await fetch(`${API_BASE_URL}/api/folders/rename`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    "folderId": payload.folder.id,
                    "updateName": payload.FolderNew
                })
            });

            commit('updateTheFolderNames', { newName: payload.FolderNew, folderId: payload.folder.id, oldName: payload.folder.name });
        },
    },


    getters: {
        fetchFolderInsideFolders: (state) => (parentfolder) => {
            let arr = []
            for (let folder of state.folderThatsInsideFolder) {
                if (folder.parentFolderId == parentfolder.id) {
                    arr.push(folder.folderName);
                }
            }
            return arr;
        },
        fetchFolderFiles: (state) => (folderName) => {
            let arr = []
            for (let i in state.filesInsideFolder) {
                if (state.filesInsideFolder[i].folderName == folderName) {
                    arr.push(state.filesInsideFolder[i].fileName)
                }
            }
            return arr;
        },
        fetchFiles: (state) => {
            return state.fileResponse;
        },
        folderAvailable: (state) => {
            return state.folder;
        },
        fileAvailable: (state) => {
            return state.files;
        },
        isFolderOpened: (state) => (folderName) => {
            return state.openedFolders.includes(folderName);
        },
        giveFolderIdAndFiles: (state) => {
            // console.log("this is the array we are looking for ", state.fileThatsInsideFolder);
            return state.fileThatsInsideFolder;
        },
        checkIfFileExist: (state) => (file, folder) => {
            if (folder == 0) {
                for (let i in state.fileResponse) {
                    if (state.fileResponse[i].fileName == file) {
                        return state.fileResponse[i].id;
                    }
                }
            }
            else {
                for (let i in state.filesInsideFolder) {
                    if (state.filesInsideFolder[i].fileName == file)
                        return state.filesInsideFolder[i].id
                }
            }
        },
        checkIfNestedFileExist: (state) => (file, nestedfolderId) => {
            for (let i in state.fileThatsInsideFolder) {
                if (state.fileThatsInsideFolder[i].fileName == file && state.fileThatsInsideFolder[i].folderId == nestedfolderId)
                    return state.fileThatsInsideFolder[i].id
            }
        },
        checkduplicate: (state) => (folder) => {
            for (let i in state.folder) {
                if (state.folder[i].name == folder)
                    return true;
            }
            return false;
        },
        checkduplicatefilefolder: (state) => (file, folder) => {
            for (let i in state.filesInsideFolder) {
                if (state.filesInsideFolder[i].fileName == file && state.filesInsideFolder[i].folderName == folder)
                    return true;
            }
            return false;
        },
        hasMoreForFolder: (state) => (folderId) => {
            const entry = state.fileFolderStatusNew.find(f => f.folderId === folderId);
            return entry ? entry.hasMore : false;
        },
        getFileId: (state) => (file) => {
            for (let i in state.fileResponse) {
                if (state.fileResponse[i].fileName == file) {
                    return state.fileResponse[i].id;
                }
            }
        },
        getFileIdInFolder: (state) => (file, folder) => {
            for (let i in state.filesInsideFolder) {
                if (state.filesInsideFolder[i].fileName == file && state.filesInsideFolder[i].folderName == folder) {
                    return state.filesInsideFolder[i].id;
                }
            }
        },
        getFolderIdInFolder: (state) => (folderName, parentFolderId) => {
            for (let i in state.folderThatsInsideFolder) {
                if (state.folderThatsInsideFolder[i].folderName == folderName && state.folderThatsInsideFolder[i].parentFolderId == parentFolderId) {
                    return state.folderThatsInsideFolder[i].folderId;
                }
            }
            return null;
        },
        checkduplicatefilefolderinfolder:(state)=>(parentFolderId,file)=>{
           for(let i in state.fileThatsInsideFolder){
            if(state.fileThatsInsideFolder[i].folderId==parentFolderId && state.fileThatsInsideFolder[i].fileName==file)
            return true;
           }
           return false;
        },
        fetchNestFiles: (state) => (folderid) => {
            let arr = []
            for (let i in state.fileThatsInsideFolder) {
                if (state.fileThatsInsideFolder[i].folderId == folderid)
                    arr.push(state.fileThatsInsideFolder[i].fileName)
            }
            return arr;
        },
        fetchFolderInsideFolderOnly: (state) => {
            return state.folderThatsInsideFolder;
        },
        fetchFilesthatsInsideFolder: (state) => {
            return state.fileThatsInsideFolder;
        }
    }
})