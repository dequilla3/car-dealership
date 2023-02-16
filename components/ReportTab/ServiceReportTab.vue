<template>
  <div class="dontPrint">
    <b-overlay no-wrap :show="show" opacity=" 0.33" />

    <b-form-group id="search" label="Search:" label-for="input-search">
      <b-input-group>
        <b-form-input
          id="input-search"
          v-model="inputSearch"
          placeholder="Search . . ."
          class="globalInputSize"
          @keyup.enter="loadServices"
        ></b-form-input>
        <b-input-group-append>
          <b-button class="btn-100" @click="loadServices">
            <font-awesome-icon icon="fa-solid fa-filter" /> Filter
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

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

      <template #cell(viewDetails)="data">
        <b-button
          v-b-modal="'viewDetailsModalService'"
          size="sm"
          class="font-10"
          variant="info"
          @click="onViewDetails(data)"
        >
          <font-awesome-icon icon="fa-solid fa-eye" /> View Details</b-button
        >
      </template>

      <template #cell(print)="data">
        <b-button size="sm" class="font-10" variant="info" @click="onPrint(data)">
          <font-awesome-icon icon="fa-solid fa-print" /> Print Ticket</b-button
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

    <!-- MODALS -->

    <!-- view details modal -->
    <b-modal
      id="viewDetailsModalService"
      size="xl"
      hide-footer
      hide-header
      title="Details"
    >
      <div class="modal-container">
        <h6>Service Details</h6>
        <hr />

        <!-- details modal table -->
        <b-table
          class="standardTable"
          hover
          :items="viewDetailsModal.detailsList"
          :fields="viewDetailsModal.detailsFields"
          :per-page="viewDetailsModal.perPage"
          :current-page="viewDetailsModal.currentPage"
          select-mode="single"
          ref="selectableTable"
          selectable
          selected-variant="info"
        >
        </b-table>

        <div class="d-flex flex-row-reverse">
          <div class="p-2">
            <b-input-group class="input--total-size" size="sm" prepend="Total:">
              <b-form-input disabled v-model="getTotal" type="text"></b-form-input>
            </b-input-group>
          </div>
          <div class="p-2">
            <b-pagination
              v-model="viewDetailsModal.currentPage"
              :total-rows="detailsTotalRows"
              :per-page="viewDetailsModal.perPage"
              aria-controls="my-table"
              v-if="rows > 0"
              class="pagination"
            ></b-pagination>
          </div>
        </div>

        <!-- tbl pages -->
        <b-pagination
          v-model="viewDetailsModal.currentPage"
          :total-rows="detailsTotalRows"
          :per-page="viewDetailsModal.perPage"
          aria-controls="my-table"
          class="pagination"
        ></b-pagination>

        <hr />

        <div class="div-content-left">
          <!-- item modal action btn -->
          <b-button
            variant="danger"
            class="form-btn modal-action-btn"
            @click="$bvModal.hide('viewDetailsModalService')"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" /> Close
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ReceiptHeader from "../Reports/ReceiptHeader.vue";

export default {
  name: "ServiceReportTab",
  components: {
    ReceiptHeader,
  },

  data(item) {
    return {
      inputSearch: "",
      show: false,
      selectedService: [],
      perPage: 5,
      currentPage: 1,
      services: [],
      serviceLines: [],
      tblFields: [
        { key: "serviceNumber", label: "Service #", thStyle: { width: "10%" } },
        { key: "name", label: "Customer Name", thStyle: { width: "10%" } },
        { key: "serial_number", label: "Serial Number", thStyle: { width: "15%" } },
        { key: "comment", label: "Comment", thStyle: { width: "15%" } },
        { key: "user_name", label: "Mechanic", thStyle: { width: "15%" } },
        { key: "date_transaction", label: "Date Transaction", thStyle: { width: "10%" } },
        { key: "viewDetails", label: "View Details", thStyle: { width: "10%" } },
        { key: "print", label: "Print", thStyle: { width: "10%" } },
      ],

      viewDetailsModal: {
        detailsList: [],
        detailsFields: [
          { key: "service_name", label: "Service Item", thStyle: { width: "60%" } },
          { key: "unit", label: "Unit", thStyle: { width: "10%" } },
          { key: "cost", label: "Cost", thStyle: { width: "10%" } },
          { key: "qty", label: "Qty", thStyle: { width: "10%" } },
          { key: "amount", label: "Amount", thStyle: { width: "10%" } },
        ],
        perPage: 5,
        currentPage: 1,
      },
    };
  },

  methods: {
    onViewDetails(data) {
      this.selectedService = data.item;
      this.loadServiceLineById();
    },

    async loadServiceLineById() {
      await this.$store
        .dispatch("service/loadServiceLineById", {
          serviceId: this.selectedService.service_id,
        })
        .then(
          (res) => {
            this.viewDetailsModal.detailsList = this.getServiceLinesById;
          },
          (err) => {
            console.log(err);
          }
        );
    },

    async onPrint(data) {
      try {
        this.show = true;
        await this.$store
          .dispatch("customer/loadCustomerById", {
            customerId: data.item.customer_id,
          })
          .then((res) => {
            //SET selected item then load specific lines
            this.selectedService = data.item;
            this.loadLinesOnPrint();
          });
      } catch (err) {
        console.log(err);
      }
    },

    async loadLinesOnPrint() {
      await this.$store
        .dispatch("service/loadServiceLineById", {
          serviceId: this.selectedService.service_id,
        })
        .then(
          (res) => {
            //SET loaded lines from global state to local state
            this.serviceLines = this.getServiceLinesById;

            // SET Service STATE
            this.setStateForPrint();

            //SET delay; SET state first then do print
            setTimeout(() => {
              this.show = false;
              window.print();
            }, 1000);
          },
          (err) => {
            console.log(err);
          }
        );
    },

    setStateForPrint() {
      this.$store.commit("service/SET_SERVICE_LINE", this.serviceLines);
      this.$store.commit("service/SET_SERVICE_HEADER", {
        serviceNumber: this.selectedService.serviceNumber,
        serialNumber: this.selectedService.serial_number,
        dateTrans: new Date(this.selectedService.date_transaction).toJSON().slice(0, 10),
        comment: this.selectedService.comment,
        userName: this.selectedService.user_name,
      });
    },

    async loadServices() {
      await this.$store.dispatch("service/loadServices").then(
        (res) => {
          let searchTxt = this.inputSearch.toLowerCase();
          let filteredSvc = this.getServiceList.filter(function (val) {
            return (
              val.serviceNumber.toLowerCase().includes(searchTxt.toLowerCase()) ||
              val.name.toLowerCase().includes(searchTxt.toLowerCase()) ||
              val.serial_number.toLowerCase().includes(searchTxt.toLowerCase())
            );
          });
          this.services = filteredSvc;
        },
        (err) => {
          console.log(err.response);
        }
      );
    },
  },

  mounted() {
    this.interval = setInterval(() => {
      this.loadServices();
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },

  computed: {
    getDoc() {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === "SERVICE";
      });
      return doc[0].code;
    },

    getServiceLinesById() {
      return this.$store.state.service.serviceLines;
    },

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
        tempList.customer_id = val.customer_id;
        tempList.serviceNumber = `${doc}-${val.service_id}`;
        tempList.name = val.name;
        tempList.date_transaction = val.date_transaction;
        tempList.serial_number = val.serial_number;
        tempList.comment = val.comment;
        tempList.user_name = val.user_name;
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

    detailsTotalRows() {
      return this.viewDetailsModal.detailsList === undefined
        ? 0
        : this.viewDetailsModal.detailsList.length;
    },

    getTotal() {
      let total = 0;
      this.viewDetailsModal.detailsList.forEach(function (val) {
        total = total + Number(val.amount);
      });
      return total;
    },
  },
};
</script>

<style lang="scss" scoped></style>
