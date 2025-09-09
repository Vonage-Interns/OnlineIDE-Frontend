export default {
    CHANGE_FILE_NAME_WITH_CONTENT(state, payload) {
        let flag = false;
        if (state.fileNameWithContent.length > 0) {
            for (let a of state.fileNameWithContent) {
                if (payload.fileid === a.fileld) {
                    a.content = payload.content;
                    flag = true;
                }
            }
            if (flag) {
                return;
            }
        }
        state.fileNameWithContent.push(payload);
    },
    TOGGLE_SLIDER(state) {
        state.slideropen = !state.slideropen
    }
}