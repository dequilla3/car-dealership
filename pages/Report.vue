<template>
  <div class="mainContainer">
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <div><h6>Reports</h6></div>
      <hr />

      <b-card no-body class="print-parent">
        <b-tabs
          class="standardFontSize"
          card
          active-nav-item-class="font-weight-bold text-uppercase text-default"
        >
          <b-tab @click="setReportName('customer')" title="Customers" active>
            <CustomerReportTab />
          </b-tab>
          <b-tab @click="setReportName('car')" title="Cars">
            <CarReportTab />
          </b-tab>
          <b-tab @click="setReportName('parts')" title="Spare Parts">
            <SparePartsReportTab />
          </b-tab>
          <b-tab @click="setReportName('roles')" title="Roles">
            <RoleReportTab />
          </b-tab>
          <b-tab @click="setReportName('serviceItem')" title="Service Items">
            <ServiceItemReportTab />
          </b-tab>
          <b-tab @click="setReportName('services')" title="Services">
            <ServiceReportTab />
          </b-tab>
          <b-tab @click="setReportName('quotes')" title="Quotations">
            <QuotationReportTab />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
    <div class="print">
      <div v-if="reportName === 'customer'">
        <CustomerReport />
      </div>
      <div v-if="reportName === 'car'">
        <CarReport />
      </div>
      <div v-if="reportName === 'parts'">
        <SparePartsReport />
      </div>
      <div v-if="reportName === 'roles'">
        <RoleReport />
      </div>
      <div v-if="reportName === 'serviceItem'">
        <ServiceItemReport />
      </div>
      <div v-if="reportName === 'services'">
        <ServiceTicket />
      </div>
      <div v-if="reportName === 'quotes'">
        <QuotationReceipt />
      </div>
    </div>
  </div>
</template>

<script>
import CustomerReportTab from "../components/ReportTab/CustomerReportTab.vue";
import CustomerReport from "../components/Reports/CustomerReport.vue";
import CarReportTab from "../components/ReportTab/CarReportTab.vue";
import CarReport from "../components/Reports/CarReport.vue";
import SparePartsReportTab from "../components/ReportTab/SparePartsReportTab.vue";
import SparePartsReport from "../components/Reports/SparePartsReport.vue";
import RoleReportTab from "../components/ReportTab/RoleReportTab.vue";
import RoleReport from "../components/Reports/RoleReport.vue";
import ServiceItemReportTab from "../components/ReportTab/ServiceItemReportTab.vue";
import ServiceItemReport from "../components/Reports/ServiceItemReport.vue";
import ServiceReportTab from "../components/ReportTab/ServiceReportTab.vue";
import ServiceTicket from "../components/Reports/ServiceTicket.vue";
import QuotationReportTab from "../components/ReportTab/QuotationReportTab.vue";
import QuotationReceipt from "../components/Reports/QuotationReceipt.vue";

export default {
  name: "Report",

  components: {
    //customer
    CustomerReportTab,
    CustomerReport,

    //car
    CarReportTab,
    CarReport,

    //parts
    SparePartsReportTab,
    SparePartsReport,

    //roles
    RoleReportTab,
    RoleReport,

    //service item
    ServiceItemReportTab,
    ServiceItemReport,

    //seervices
    ServiceReportTab,
    ServiceTicket,

    //quotes
    QuotationReportTab,
    QuotationReceipt,
  },

  data() {
    return {
      reportName: "customer",
    };
  },

  methods: {
    setReportName(val) {
      this.reportName = val;
    },

    async loadCustomer() {
      return await this.$store
        .dispatch("customer/loadCustomers", { token: localStorage.token })
        .then(
          (res) => {
            return res;
          },
          (err) => {
            this.showAlert(3, "warning", `${err.response.data.error}`);
          }
        );
    },

    async loadCars() {
      await this.$store.dispatch("goods/loadCars", { token: localStorage.token });
    },
    async loadParts() {
      await this.$store.dispatch("goods/loadParts", { token: localStorage.token });
    },
    async loadRoles() {
      await this.$store.dispatch("role/loadRoles", { token: localStorage.token });
    },

    async loadServiceItems() {
      await this.$store.dispatch("service/loadServiceItemList", {
        token: localStorage.token,
      });
    },

    //TRANSCTIONS
    async loadServices() {
      return await this.$store.dispatch("service/loadServices");
    },
    async loadQuotes() {
      return await this.$store.dispatch("quotation/loadQuotes");
    },
  },

  mounted() {
    try {
      this.interval = setInterval(() => {
        this.loadCustomer();
        this.loadCars();
        this.loadParts();
        this.loadRoles();
        this.loadServiceItems();
        this.loadServices();
        this.loadQuotes();
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  },

  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped></style>
