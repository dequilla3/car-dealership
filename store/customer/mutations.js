export default {
  LOAD_CUSTOMERLIST(state, data) {
    state.customerList = data;
  },

  SET_CUSTOMER(state, data) {
    state.customer = data;
  }
};
