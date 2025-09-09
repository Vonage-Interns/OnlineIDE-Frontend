export default {
    FOLDER_INSIDE_FOLDER(state, payload) {
        if (state.folderThatsInsideFolder.length == 0) {
            state.folderThatsInsideFolder.push(payload);
            return;
        }
        state.folderThatsInsideFolder.push(payload);
        return;
    },
    FOLDER_INSIDE_FOLDER_SETTER(state, payload) {
        let parentId = payload.parentIdFolder;
        for (let a of payload.folders) {
            let folderId = a.id;
            let folderName = a.name;
            state.folderThatsInsideFolder.push({ folderId: folderId, folderName: folderName, parentFolderId: parentId });
        }
        return;
    },
    OPENED_FOLDERS_PUSH(state, folderName) {
        state.openedFolders.push(folderName);
    },
    ADD_TO_FOLDER(state, payload) {
        state.folder.push(payload);
    },
    SET_FOLDERS_FROM_DB(state, payload) {
        for (let i in payload) {
            state.folder.push(payload[i])
        }
    },
    SET_FILE_RESPONSE(state, payload) {
        state.fileResponse.push({ id: payload.data.id, fileName: payload.data.name, folderId: payload.data.folderID })
    },
    SET_FOLDER_RESPONSE(state, payload) {
        state.folderResponse.push({ id: payload.id, folderName: payload.name })
    },
    SET_FILE_RESPONSE_OF_EXISTING(state, payload) {
        for (let i in payload) {
            state.fileResponse.push({ id: payload[i].id, fileName: payload[i].name, folderId: null })
        }
    },
    SET_FOLDER_RESPONSE_OF_EXISTING(state, payload) {
        for (let i in payload) {
            state.folderResponse.push({ id: payload[i].id, folderName: payload[i].name })
        }
    },
    SET_FILE_IN_FOLDER_RESPONSE(state, payload) {
        for (let i in payload) {
            state.fileResponse.push({ id: payload[i].id, fileName: payload[i].name, folderId: payload[i].folderID })
        }
    },
    GET_FOLDER_ID(state, payload) {
        for (let i in state.folderResponse) {
            if (state.folderResponse[i].folderName == payload) {
                state.particularFolderId = state.folderResponse[i].id;
                break;
            }
        }
    },
    FILES_INSIDE_FOLDER(state, { id, payload }) {
        state.filesInsideFolder.push({ id: id, fileName: payload[0], folderName: payload[1] })
    },
    FILES_INSIDE_FOLDER_EXISTED(state, { folder, payload }) {
        for (let i in payload)
            state.filesInsideFolder.push({ id: payload[i].id, fileName: payload[i].name, folderName: folder })
    },
    FILES_INSIDE_FOLDER_SETTER(state, payload) {
        for (let i in payload.files) {
            state.fileThatsInsideFolder.push({ id: payload.files[i].id, fileName: payload.files[i].name, folderId: payload.folderId })
        }
    },
    SET_AGAIN_NEW(state, payload) {
        for (let file of payload) {
            state.fileThatsInsideFolder.push({ id: file.id, fileName: file.name, folderId: null })
        }
    },
    CHANGE_NEW_AGAIN(state, payload) {
        state.fileThatsInsideFolder.push({ id: payload.res.data.id, fileName: payload.res.data.name, folderId: payload.folderId });
    },
    MAKE_FOLDER_EMPTY(state) {
        state.folder.splice(0);
        state.folderResponse.splice(0)
    },
    MAKE_FILE_RESPONSE_EMPTY(state) {
        state.fileResponse = []
        state.openedFolders = []
        state.filesInsideFolder = []
        state.pageCounter = [],
            state.hideLoadMore = [],
            state.initialCall = [],
            state.folderThatsInsideFolder = []
    },
    CLEAR_ALL(state) {
        state.fileThatsInsideFolder.splice(0);
        state.folderThatsInsideFolder.splice(0);
    },
    NEW_CHANGE_FILE_INSIDE_FOLDER(state, payload) {
        state.fileThatsInsideFolder.push(payload);
    },
    REMOVE_FOLDER(state, folderName) {
        state.folder = state.folder.filter(folder => folder.name !== folderName);
    },
    REMOVE_FILES_INSIDE_FOLDER(state, payload) {
        state.filesInsideFolder = state.filesInsideFolder.filter(fol => fol.folderName !== payload.folder);
        state.folderThatsInsideFolder = state.folderThatsInsideFolder.filter(fol => fol.parentFolderId !== payload.parentFolderId)
    },
    UPDATE_FILE_NAME(state, payload) {
        for (let i in state.fileResponse) {
            if (state.fileResponse[i].fileName == payload.oldFile) {
                state.fileResponse[i].fileName = payload.newFile
            }
        }
    },
    UPDATE_FILE_IN_FOLDER(state, payload) {
        for (let i in state.filesInsideFolder) {
            if (state.filesInsideFolder[i].fileName == payload.oldFile && state.filesInsideFolder[i].folderName == payload.folder) {
                state.filesInsideFolder[i].fileName = payload.newFile
            }
        }
    },
    DELETE_FILE_INSIDE_FOLDER(state, payload) {
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
    UPDATE_FOLDER_NAME(state, payload) {

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
    UPDATE_FOLDER_IN_FOLDER(state, payload) {
        for (let i in state.folderThatsInsideFolder) {
            if (state.folderThatsInsideFolder[i].parentFolderId == payload.parentFolderId && state.folderThatsInsideFolder[i].folderName == payload.oldFolder)
                state.folderThatsInsideFolder[i].folderName = payload.newFolder
        }
    },
    DELETE_FOLDER_INSIDE_FOLDER(state, payload) {
        state.folderThatsInsideFolder = state.folderThatsInsideFolder.filter(
            folder => !(folder.parentFolderId === payload.parentFolderId &&
                folder.folderName === payload.folder)
        );
    },
    SET_EXISTED_NESTED_FILES(state, payload) {
        for (let i in payload.res) {
            state.fileThatsInsideFolder.push({ id: payload.res[i].id, fileName: payload.res[i].name, folderId: payload.folderId })
        }
    }
}