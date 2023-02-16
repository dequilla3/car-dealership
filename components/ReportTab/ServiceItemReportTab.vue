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
        :items="list"
        :fields="fields"
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
  name: "CarReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      perPage: 5,
      currentPage: 1,
      fields: ["service_name", "unit", "cost", "date_created"],
      list: [],
    };
  },

  methods: {
    onPrint() {
      window.print();
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.list = this.getList;
    }, 3000);
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },

  computed: {
    isListEmpty() {
      return this.list.length < 1;
    },
    getList() {
      return this.$store.state.service.serviceItemsList;
    },
    rows() {
      return this.list === undefined ? 0 : this.list.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
