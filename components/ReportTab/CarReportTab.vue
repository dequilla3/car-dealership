<template>
  <div>
    <div class="dontPrint">
      <b-button
        :disabled="isListEmpty"
        @click="onPrint"
        variant="info"
        class="btn-100 m-bttm-10"
        >Print</b-button
      >

      <b-table
        class="standardTable"
        hover
        :items="carList"
        :fields="tblFields"
        :per-page="perPage"
        :current-page="currentPage"
        select-mode="single"
        ref="selectableTable"
      />

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        class="pagination"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import ReceiptHeader from "../Reports/ReceiptHeader.vue";
export default {
  name: "CarReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      perPage: 5,
      currentPage: 1,
      tblFields: ["serial_number", "color", "model", "brand_name", "unit", "cost"],
      carList: [],
    };
  },

  methods: {
    onPrint() {
      window.print();
    },
  },

  mounted() {
    setInterval(() => {
      this.carList = this.getCarList;
    }, 3000);
  },

  computed: {
    isListEmpty() {
      return this.carList.length < 1;
    },
    getCarList() {
      return this.$store.state.goods.goodsCarList;
    },
    rows() {
      return this.carList === undefined ? 0 : this.carList.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
