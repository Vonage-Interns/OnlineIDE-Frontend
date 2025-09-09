import API_BASE_URL from "../../../config";
import StorageWrapper from "../../../storageWrapper";
import METHODS  from "../../../httpMethods"

export default {
    async fetchUserInfo({ commit }, payload) {
        if (
            payload.firstName === "" ||
            payload.lastName === "" ||
            payload.email === "" ||
            payload.password === ""
        ) {
            return false;
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: METHODS.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            return false;
        }

        commit("CREATE_USER", payload);
        return true;
    },

    async checkLogin({ commit, dispatch }, payload) {
        const res = await fetch(`${API_BASE_URL}/api/auth/signin`, {
            method: METHODS.POST,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            StorageWrapper.set("token", data.data.token);
            StorageWrapper.set("email", payload.email);
            StorageWrapper.set("password", payload.password);

            const val = data.data.token;
            commit("ASSIGN_TOKEN", val);
        } else {
            return false;
        }

        if (res.ok) {
            const token = StorageWrapper.get("token");
            commit("USER_VERIFIED", payload);

            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                method: METHODS.GET,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const res = await response.json();
                const projects = res.data;
                dispatch("ProjectStore/setProjectNameAndId", projects, { root: true });
                return true;
            } else {
                return false;
            }
        }
    }
};
