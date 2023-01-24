import axios from "axios";

export default {
  async loadParts({ commit }, { token }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/parts`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_GOODS_PARTS", res.data);
      return res;
    });
  },

  async loadCars({ commit }, { token }) {
    return await axios({
      method: "GET",
      url: `${this.$axios.defaults.baseURL}/cars`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      commit("LOAD_GOODS_CARS", res.data);
    });
  },

  async addParts({ commit }, { token, unit, cost, barcode, printname }) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/part/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        unit,
        cost,
        barcode,
        printname,
      },
    });
  },

  async addCars(
    { commit },
    { token, unit, cost, serial_number, brand_name, model, color }
  ) {
    return await axios({
      method: "POST",
      url: `${this.$axios.defaults.baseURL}/car/add`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        unit,
        cost,
        serial_number,
        brand_name,
        model,
        color,
      },
    }).then(
      (res) => {
        return res;
      },
      (err) => {
        console.log(err.response);
      }
    );
  },

  async editCars(
    { commit },
    {
      token,
      product_car_id,
      unit,
      cost,
      serial_number,
      brand_name,
      model,
      color,
    }
  ) {
    return await axios({
      method: "PATCH",
      url: `${this.$axios.defaults.baseURL}/car/edit/${product_car_id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        unit,
        cost,
        serial_number,
        brand_name,
        model,
        color,
      },
    }).then(
      (res) => {
        return res;
      },
      (err) => {
        console.log(err.response);
      }
    );
  },
};
