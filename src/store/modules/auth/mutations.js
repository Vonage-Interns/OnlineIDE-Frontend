export default {
    CREATE_USER(state, payload) {
        state.isLoggedIn = true;
        state.firstName = payload.firstName;
        state.lastName = payload.lastName;
        state.email = payload.email;
        state.password = payload.password;
    },  

    USER_VERIFIED(state, payload) {
        state.email = payload.email;
        state.password = payload.password;
        state.isLoggedIn = true;
    },

    ASSIGN_TOKEN(state, payload) {
        state.token = payload;
    },

    ROOT_RENDERING(state, payload) {
        state.rootRendering = payload;
    }
};
