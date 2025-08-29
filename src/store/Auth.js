import API_BASE_URL from "@/config";
import StorageWrapper from "./storageWrapper";
export default ({
    namespaced: true,
    state() {
        return {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            isloggedIn: false,
            token: "",
            rootRendering: true,
        }
    },
    mutations: {
        createUser(state, payload) {
            state.isloggedIn = true;
            state.firstName = payload.firstName;
            state.lastName = payload.lastName;
            state.email = payload.email
            state.password = payload.password
        },
        userVerified(state, payload) {
            state.email = payload.email;
            state.password = payload.password;
            state.isloggedIn = true;
        },
        assignToken(state, payload) {
            state.token = payload;
        },
        rootRendering(state, payload) {
            state.rootRendering = payload;
        }
    },
    actions: {
        async fetchUserInfo({ commit }, payload) {
            if (payload.firstName == '' || payload.lastName == '' || payload.email == '' || payload.password == '') {
                return false;
            }
            const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                return false;
            }
            commit('createUser', payload);
            return true;
        },
        async checkLogin({ commit, dispatch }, payload) {
            const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if(res.ok){
                const data = await res.json();
                StorageWrapper.set('token', data.data.token);
                StorageWrapper.set('email', payload.email);
                StorageWrapper.set('password', payload.password);
                const val = data.data.token;
                commit('assignToken', val);
            }
            else {
                return false;
            }
            if (res.ok) {
                const token = StorageWrapper.get("token"); 
                commit('userVerified', { payload });
                const response = await fetch(`${API_BASE_URL}/api/projects`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (response.ok) {
                    const res = await response.json();
                    const projects = res.data;
                    dispatch('ProjectStore/setProjectNameAndId', projects, { root: true })
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    }
})






