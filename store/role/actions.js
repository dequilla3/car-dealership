import axios from "axios";

export default {
  async loadRoles({ commit }, { token }) {
    await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/user_roles`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_ROLES", res.data);
    });
  },

  async addRole({ commit }, { role }) {
    await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/user_role/add`,
      data: {
        role,
      },
    });
  },

  async editRole({ commit }, { token, roleId, role }) {
    await axios({
      method: "PATCH",
      url: `${this.$axios.defaults.baseURL}/user_role/edit/${roleId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        role,
      },
    });
  },
};
