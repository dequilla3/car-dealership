export default {
  LOGIN_USER(state, user) {
    state.loggedInUser.push(user);
  },

  SET_USER(state, data) {
    state.user = data;
  },




};
