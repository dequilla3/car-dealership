<template>
  <div>
    <div class="dontPrint">
      <b-table
        class="standardTable"
        hover
        :items="services"
        :fields="tblFields"
        :per-page="perPage"
        :current-page="currentPage"
        select-mode="single"
        ref="selectableTable"
      >
        <template #cell(date_transaction)="data">
          {{ new Date(data.value).toJSON().slice(0, 10) }}
        </template>

        <template #cell(action)="data">
          <b-button size="sm" class="font-10" variant="info" @click="onViewDetails(data)">
            <font-awesome-icon icon="fa-solid fa-eye" /> View Details</b-button
          >
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
  name: "ServiceReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      perPage: 5,
      currentPage: 1,
      services: [],
      tblFields: [
        "serviceNumber",
        { key: "name", label: "Customer Name" },
        "date_transaction",
        "action",
      ],
    };
  },

  methods: {
    onViewDetails(data) {
      console.log(data.item);
    },
  },

  mounted() {
    setInterval(() => {
      this.services = this.getServiceList;
    }, 3000);
  },

  computed: {
    isListEmpty() {
      return this.services.length < 1;
    },

    getServiceList() {
      let doc = this.getDocService;
      let servicesList = this.$store.state.service.serviceList;
      let tempList = [];
      let curList = [];

      servicesList.forEach(function (val) {
        // set temp list to empty
        tempList = [];
        tempList.service_id = val.service_id;
        tempList.serviceNumber = `${doc}-${val.service_id}`;
        tempList.name = val.name;
        tempList.date_transaction = val.date_transaction;
        curList.push(tempList);
      });
      curList.sort();
      curList.reverse();
      return curList;
    },

    getDocService() {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === "SERVICE";
      });
      return doc[0].code;
    },

    rows() {
      return this.services === undefined ? 0 : this.services.length;
    },
  },
};
</script>

<style lang="scss" scoped></style>
