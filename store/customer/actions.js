import axios from "axios";

// http://172.16.28.13:5000/api/customers

export default {
  async loadCustomers({ commit }, { token }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/customers`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_CUSTOMERLIST", res.data);
      return res;
    });
  },

  async addCustomer({ commit }, { token, name, contact_number, address }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/customer/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        contact_number,
        address,
      },
    });
  },

  async editCustomer(
    { commit },
    { token, customer_id, name, contact_number, address }
  ) {
    console.log(name);
    return await axios({
      method: "PATCH",
      url: `${this.$axios.defaults.baseURL}/customer/edit/${customer_id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        name,
        contact_number,
        address,
      },
    });
  },


  async loadCustomerById({ commit }, { customerId }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/customer/view/${customerId}`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(
      (res) => {
        commit("SET_CUSTOMER", res.data);
      },
      (err) => { }
    );
  },
};
