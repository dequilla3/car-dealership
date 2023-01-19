export default {
  async addUser({ commit }, user) {
    commit("ADD_USER", user);
  },
};
