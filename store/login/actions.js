import axios from "axios";
export default {
  async loginUser({ commit }, { username, password }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/login`,
      data: {
        username,
        password,
      },
    }).then((res) => {
      commit("LOGIN_USER", res.data);
      return res;
    });
  },

  async getUserById() {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/user-details/${localStorage.userId}`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(
      (res) => {},
      (err) => {
        localStorage.isLoggedIn = false;
        this.$router.push({ path: "/" });
      }
    );
  },
};
