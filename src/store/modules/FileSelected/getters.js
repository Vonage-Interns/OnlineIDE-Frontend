export default {
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
    checkduplicatefilefolderinfolder: (state) => (parentFolderId, file) => {
        for (let i in state.fileThatsInsideFolder) {
            if (state.fileThatsInsideFolder[i].folderId == parentFolderId && state.fileThatsInsideFolder[i].fileName == file)
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