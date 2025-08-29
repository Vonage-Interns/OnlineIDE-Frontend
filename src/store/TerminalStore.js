import API_BASE_URL from "@/config";

export default ({
    namespaced: true,
    state() {
        return {
            terminalInput: [],
            heightOfTerminal: null,
            outputShow: false,
            outputArray: [],
            folderShow: false,
            outputFolderId: null,
            outputFileId: null,
            fileNameNeeded: null,
            terminalVisible: true,
        }
    },
    mutations: {
        setOutputFolderId(state, payload) {
            state.outputFolderId = payload;
        },
        handleTerminalVisibleFalse(state) {
            state.terminalVisible = false;
        },
        handleTerminalVisibleTrue(state) {
            state.terminalVisible = true;
        },
        updateTerminalInput(state, payload) {
            state.terminalInput.push(payload);
            return;
        },
        changeHeight(state, payload) {
            state.heightOfTerminal = payload;
            return;
        },
        updataOutputArray(state, payload) {
            if (payload == -2) {
                state.outputArray.push("Path is incorrect");
                state.terminalInput.push("Path Incorrect");
                return;
            }
            if (payload == -1) {
                state.outputArray.push(null);
                return;
            }
            if (payload == 0) {
                state.outputArray.push("command not found");
                state.terminalInput.push("Command not found");
                return;
            }
            if (payload.data.error == "") {
                state.outputArray.push(payload.data.output);
            }
            else {
                state.outputArray.push(payload.data.error);
            }
        },
        clearInputOutput(state) {
            state.terminalInput.splice(0)
            state.outputArray.splice(0)
        },
        changeFileIdAndName(state, payload) {
            state.outputFileId = payload.id;
            state.fileNameNeeded = payload.fileName;
        },
        changeItBack(state) {
            state.outputFileId = null;
            state.fileNameNeeded = null;
        }
    },
    actions: {
        addtoTerminalInput({ state, commit, rootGetters }, payload) {
            // if(payload==""){
            //     return false;
            // }
            if (payload == "clear") {
                commit('clearInputOutput')
                return false;
            }

            const splitContent = payload.split(' ');
            if (payload != "" && splitContent.length == 1) {
                commit('updataOutputArray', 0);
                return false;
            }
            if (payload != "" && splitContent[0] != "node") {
                commit('updataOutputArray', -2);
                return false;
            }
            // const filesAvailables=rootGetters['FileSelected/fileAvailable'];
            // for(let a of filesAvailables){
            //     if(splitContent[1]==a){
            //         state.outputShow=true;
            //     }
            // }
            if (payload != "" && splitContent[0] == "node") {
                const FolderFile = splitContent[1].split('/');
                if (FolderFile.length == 1) {
                    const name = FolderFile[0];
                    const allFiles = rootGetters['FileSelected/giveFolderIdAndFiles'];
                    let atleastThere = false;
                    for (let files of allFiles) {
                        if (files.fileName == name) {
                            atleastThere = true;
                        }
                        if ((files.folderId == null || typeof files.folderId == 'undefined') && name == files.fileName) {
                            const id = files.id;
                            commit('updateTerminalInput', payload);
                            commit('changeFileIdAndName', { id: id, fileName: files.fileName });
                            return true;
                        }
                    }
                    if (atleastThere == false) {
                        commit('updataOutputArray', -2);
                        return false;
                    }
                    for (let content of allFiles) {

                        if ((content.folderId != null && typeof content.folderId != 'undefined') && name == content.fileName) {

                            const filesAll = rootGetters['FileSelected/giveFolderIdAndFiles'];

                            for (let sample of filesAll) {

                                if (sample.folderId === null && sample.fileName == name) {
                                    commit('updateTerminalInput', payload);
                                    commit('changeFileIdAndName', { id: sample.id, fileName: sample.fileName });
                                    return true;
                                }
                            }
                            commit('updataOutputArray', -2);
                            return false;
                        }
                    }
                }
                if (FolderFile.length == 2) {
                    const foldersAvailable = rootGetters['FileSelected/folderAvailable'];
                    const allInfo = rootGetters['FileSelected/giveFolderIdAndFiles'];
                    // const folderInsideFolder=rootGetters['FileSelected/fetchFolderInsideFolderOnly'];
                    let entered = false;
                    for (let folder of foldersAvailable) {
                        if (folder.name == FolderFile[0]) {
                            for (let newFolder of allInfo) {
                                if (newFolder.fileName == FolderFile[1] && folder.id == newFolder.folderId) {
                                    state.outputFolderId = newFolder.folderId;
                                    entered = true;
                                }
                            }
                            state.fileNameNeeded = FolderFile[1];
                            state.folderShow = true;
                        }
                    }

                    if (state.outputFolderId == null || entered == false) {
                        state.outputFolderId = null;
                        commit('updataOutputArray', -2);
                        return false;
                    }
                }
                if (FolderFile.length > 2) {
                    // check for files inside folder for the root folder and then dig inside folder inside folder tomorrow
                    const foldersAvailable = rootGetters['FileSelected/fetchFolderInsideFolderOnly'];
                    let x = 1;
                    let folderId = null;
                    for (let i = 0; i < 3; i++) {
                        for (let a of foldersAvailable) {
                            if (a.folderName == FolderFile[x]) {
                                x += 1;
                                folderId = a.folderId;
                            }
                        }
                    }

                    commit('setOutputFolderId', folderId);

                }
            }

            if (splitContent[0] == "node" && state.outputShow == true) {
                state.outputShow = true;
            }
            commit('updateTerminalInput', payload)
            return true;
        },
        async sendInputToBackend(context, payload) {
            if (context.state.outputFileId != null) {
                const res = await fetch(`${API_BASE_URL}/api/code/run`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context.rootState.auth.token}`
                    },
                    body: JSON.stringify({
                        "fileId": context.state.outputFileId,
                        "fileName": context.state.fileNameNeeded
                    })
                });
                const response = await res.json();
                context.commit('updataOutputArray', response);
                if (res.ok) {
                    console.log("worked")
                }
                else {
                    console.log("no");
                }
                context.commit('changeItBack');
                return;
            }
            if (context.state.isClear == true) {
                context.state.isClear = false;
                return;
            }
            if (context.state.folderShow == true) {
                const allFiles = context.rootGetters['FileSelected/giveFolderIdAndFiles'];
                let fileIdNew = null;

                for (let content of allFiles) {
                    if (content.folderId == context.state.outputFolderId && context.state.fileNameNeeded == content.fileName) {
                        fileIdNew = content.id;
                    }
                }
                const res = await fetch(`${API_BASE_URL}/api/code/run`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${context.rootState.auth.token}`
                    },
                    body: JSON.stringify({
                        "fileId": fileIdNew,
                        "fileName": context.state.fileNameNeeded
                    })
                });
                const response = await res.json();
                context.commit('updataOutputArray', response);
                context.state.folderShow = false;
                return;
            }
            
            if (payload == "") {
                context.commit('updataOutputArray', -1)
                return;
            }
            
            let comingInput = payload.split(' ');
            let fileName = comingInput[1];
            // const filesAvailables=context.rootGetters['FileSelected/fileAvailable'];
            const files = context.rootGetters['FileSelected/fetchFiles'];
            let fileId = null;
            for (let s of files) {
                if (s.fileName == fileName) {
                    fileId = s.id;
                }
            }
            if (fileId == null) {
                const filesComing = context.rootGetters['FileSelected/fetchFilesthatsInsideFolder'];
                let temperory = comingInput[1].split('/');
                fileName = temperory[temperory.length - 1];
                for (let a of filesComing) {
                    if (a.fileName == fileName && a.folderId == context.state.outputFolderId) {
                        fileId = a.id;
                        break;
                    }
                }
            }
            if (fileId == null) {
                if (payload == "") {
                    context.commit('updataOutputArray', -1)
                    return;
                }
                context.commit('updataOutputArray', 0);
                return;
            }
            
            const res = await fetch(`${API_BASE_URL}/api/code/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${context.rootState.auth.token}`
                },
                body: JSON.stringify({
                    "fileId": fileId,
                    "fileName": fileName
                })
            });
            const response = await res.json();
            context.commit('updataOutputArray', response);
            if (res.ok) {
                console.log("worked")
            }
            else {
                console.log("no");
            }

        }
    },
    getters: {
        getTerminalInput: (state) => {
            return state.terminalInput;
        },
        getTerminalOutput: (state) => {
            return state.outputArray;
        }
    }
})