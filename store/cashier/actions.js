import axios from "axios";

export default {

    async loadBilling({ commit }) {
        return await axios({
            method: "GET",
            url: `${this.$axios.defaults.baseURL}/billings`,
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then((res) => {
            commit("SET_BILLINGS", res.data);
            return res;

        }).catch((err) => {
            conmsole.log(err);
        });
    }
};