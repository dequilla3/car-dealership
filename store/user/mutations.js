export default {
  ADD_USER(state, user) {
    state.userList.push(user);
  },

  LOAD_USER(state, data) {
    state.userList = data;
  },

  SET_USER_BY_ID(state, data) {
    state.userById = data;
  }
};
