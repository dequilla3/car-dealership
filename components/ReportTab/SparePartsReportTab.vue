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
        :items="partsList"
        :fields="tblFields"
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
  name: "SparePartsReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      perPage: 5,
      currentPage: 1,
      tblFields: ["barcode", "printname", "unit", "cost", "date_created"],
      partsList: [],
    };
  },

  methods: {
    onPrint() {
      window.print();
    },
  },

  mounted() {
    setInterval(() => {
      this.partsList = this.getPartList;
    }, 3000);
  },

  computed: {
    isListEmpty() {
      return this.partsList.length < 1;
    },
    getPartList() {
      return this.$store.state.goods.partsList;
    },
    rows() {
      return this.partsList === undefined ? 0 : this.partsList.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
