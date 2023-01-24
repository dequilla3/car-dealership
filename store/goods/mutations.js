export default {
  LOAD_GOODS_PARTS(state, data) {
    state.partsList = data;
  },

  LOAD_GOODS_CARS(state, data) {
    state.goodsCarList = data;
  },
};
