import axios from "axios";

export default {
  async loadServiceItemList({ commit }, { token }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/service-items`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_SERVICE_ITEM", res.data);
    });
  },

  async addServiceITem({ commit }, { token, service_name, unit, cost }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/service-item/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        service_name,
        unit,
        cost,
      },
    }).then((res) => {
      return res;
    });
  },

  async editServiceITem(
    { commit },
    { token, service_item_id, service_name, unit, cost }
  ) {
    return await axios({
      method: "PATCH",
      url: `${this.$axios.defaults.baseURL}/service-item/edit/${service_item_id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        service_name,
        unit,
        cost,
      },
    }).then((res) => {
      return res;
    });
  },


};
