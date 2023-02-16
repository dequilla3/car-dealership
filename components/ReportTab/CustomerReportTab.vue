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
        :items="customerTblList"
        :fields="customerTblFields"
        :per-page="perPage"
        :current-page="currentPage"
        select-mode="single"
        ref="selectableTable"
      >
        <template #cell(date_created)="data">
          {{ new Date(data.value).toJSON().slice(0, 10) }}
        </template>
      </b-table>

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
  name: "CustomerReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      perPage: 5,
      currentPage: 1,
      customerTblFields: ["name", "contact_number", "address", "date_created"],
      customerTblList: [],
    };
  },

  methods: {
    onPrint() {
      window.print();
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.customerTblList = this.getCustomerList;
    }, 3000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
  computed: {
    isListEmpty() {
      return this.customerTblList < 1;
    },
    getCustomerList() {
      return this.$store.state.customer.customerList;
    },
    rows() {
      return this.customerTblList === undefined ? 0 : this.customerTblList.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
