import axios from "axios";

export default {
  async addUser(
    { commit },
    { name, contact_number, address, username, password, user_role_id }
  ) {
    await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/create-user`,
      data: {
        name,
        contact_number,
        address,
        username,
        password,
        user_role_id,
      },
    }).then((res) => {
      // push to list if user already exist
      commit("ADD_EXISTING_USER", res.data);
    });
  },

  async loadUsers({ commit }, { token }) {
    await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/users`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_USER", res.data);
    });
  },

  async getUserById({ commit }, { id }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/user-details/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => {
      commit("SET_USER_BY_ID", res.data);
      return res;
    }, err => { console.log(err); });
  },
};
