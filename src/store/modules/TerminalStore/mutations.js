export default {
    SET_OUTPUT_FOLDERID(state, payload) {
        state.outputFolderId = payload;
    },
    HANDLE_TERMINAL_VISIBLE_FALSE(state) {
        state.terminalVisible = false;
    },
    HANDLE_TERMINAL_VISIBLE_TRUE(state) {
        state.terminalVisible = true;
    },
    UPDATE_TERMINAL_INPUT(state, payload) {
        state.terminalInput.push(payload);
        return;
    },
    CHANGE_HEIGHT(state, payload) {
        state.heightOfTerminal = payload;
        return;
    },
    UPDATE_OUTPUT_ARRAY(state, payload) {
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
    CLEAR_INPUT_OUTPUT(state) {
        state.terminalInput.splice(0)
        state.outputArray.splice(0)
    },
    CHANGE_FILE_ID_AND_NAME(state, payload) {
        state.outputFileId = payload.id;
        state.fileNameNeeded = payload.fileName;
    },
    CHANGE_IT_BACK(state) {
        state.outputFileId = null;
        state.fileNameNeeded = null;
    }
}