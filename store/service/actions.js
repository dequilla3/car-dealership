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

  async loadServices({ commit }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/services`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => {

      let servicesList = res.data;
      let curList = [];

      servicesList.forEach(function (val) {
        //filter duplicates
        let duplicates = curList.filter(function (filteredVal) {
          //get duplicates using pk_id
          return val.service_id === filteredVal.service_id;
        });

        // if no duplicates push to currlist
        if (duplicates.length < 1) {
          curList.push(val);
        }
      });

      commit("SET_SERVICES", curList);
      return res;
    });
  },

  async loadServiceLineById({ commit }, { serviceId }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/service/view/${serviceId}`,
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    }).then(res => {
      commit("SET_SERVICELINE_BY_ID", res.data);
      return res;
    });
  }


};
