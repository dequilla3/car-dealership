import axios from "axios";

export default {
    async loadAllProducts({ commit }) {
        return await axios({
            method: "GET",
            url: `${this.$axios.defaults.baseURL}/get-all-products`,
            headers: {
                Authorization: `Bearer ${localStorage.token}`
            }
        }).then((res) => {
            commit("LOAD_ALL_PRODUCTS", res.data);
        }, (err) => { console.log(res.response); });
    }
};