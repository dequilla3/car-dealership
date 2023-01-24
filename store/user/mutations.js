export default {
  ADD_USER(state, user) {
    state.userList.push(user);
  },

  LOAD_USER(state, data) {
    state.userList = data;
  },
};
