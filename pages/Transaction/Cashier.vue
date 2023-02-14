<template>
  <div class="mainContainer">
    <b-overlay :show="isBusy" rounded="sm" variant="light" opacity="0.30" no-wrap />
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <div><h6>Cashier</h6></div>
      <hr />
      <b-form class="form-60">
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
        <b-button variant="primary" class="font-12 mb-3" v-if="isPr" @click="onReset">
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Trasaction
        </b-button>

        <div class="grid-container-3">
          <div class="grid-item">
            <!-- transaction number form group-->
            <b-form-group id="sI" label="Sales Invoice Number:" label-for="sI">
              <b-form-input
                id="sI"
                v-model="form.salesInvoiceNumber"
                placeholder="None"
                required
                class="globalInputSize docnoInput"
                disabled
              ></b-form-input>
            </b-form-group>
          </div>

          <div class="grid-item">
            <!-- quote -->
            <b-form-group id="quote" label="Select Quotation:" label-for="input-quote">
              <b-input-group id="b-input-group-quote">
                <b-form-input
                  id="input-quote"
                  v-model="form.quote.quoteNum"
                  required
                  class="globalInputSize"
                  placeholder="None"
                  disabled
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    id="b-modal-quote"
                    variant="secondary"
                    class="font-12"
                    v-b-modal.modal-lg="'quoteModal'"
                    @click="openQuoteModal"
                    :disabled="isDisableQuote || isPr"
                    >Select</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>

          <div class="grid-item">
            <!-- service -->
            <b-form-group id="service" label="Select Service:" label-for="input-service">
              <b-input-group id="b-input-group-quote">
                <b-form-input
                  id="input-service"
                  v-model="form.service.serviceNum"
                  required
                  class="globalInputSize"
                  placeholder="None"
                  disabled
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    id="b-modal-service"
                    variant="secondary"
                    class="font-12"
                    v-b-modal.modal-lg="'serviceModal'"
                    @click="openServiceModal"
                    :disabled="isDisableService || isPr"
                    >Select</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </div>
      </b-form>

      <!-- table service -->
      <b-table
        class="standardTable"
        hover
        :items="serviceProps.serviceLineList"
        :fields="serviceProps.serviceLineTblField"
        select-mode="single"
        ref="selectableTable"
        v-if="showServiceTable"
      >
      </b-table>

      <!-- table goods -->
      <b-table
        class="standardTable"
        hover
        :items="quotationProps.quotationLineList"
        :fields="quotationProps.quotationLineTblFields"
        select-mode="single"
        ref="selectableTable"
        v-if="showGoodsTable"
      >
      </b-table>

      <div v-if="showServiceTable || showGoodsTable">
        <br />
        <hr />

        <!-- total section -->
        <div class="d-flex flex-row-reverse">
          <div class="p-2">
            <b-input-group class="input--total-size" size="sm" prepend="Total:">
              <b-form-input disabled v-model="totalAmount" type="text"></b-form-input>
            </b-input-group>
          </div>
        </div>

        <hr />
      </div>

      <!-- Proecss and Print button -->
      <div class="div-content-left" v-if="showServiceTable || showGoodsTable">
        <b-button
          variant="primary"
          class="font-12"
          @click="onClickProcess"
          :disabled="isPr"
        >
          <b-spinner v-if="false" small></b-spinner>
          <font-awesome-icon v-if="true" icon="fa-solid fa-cogs" /> Process Transaction
        </b-button>

        <b-button variant="info" class="font-12 ml-2" @click="onPrint" :disabled="!isPr">
          <font-awesome-icon icon="fa-solid fa-file" />
          Print Receipt
        </b-button>

        <b-button variant="danger" class="font-12 ml-2" @click="onReset" v-if="!isPr">
          <font-awesome-icon icon="fa-solid fa-redo" />
          Reset
        </b-button>
      </div>

      <!-- Service Modals -->
      <b-modal id="serviceModal" size="lg" hide-footer hide-header title="Select Service">
        <div class="font-13">
          <h6>Select Service</h6>
          <hr />
          <!-- search input -->
          <b-form-group id="inputSearch" label="Search:" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="serviceModalProps.inputSearch"
              placeholder="Search . . ."
              class="standardFontSize"
              @keyup.enter="loadServices"
            ></b-form-input>
          </b-form-group>

          <!-- service modal table -->
          <b-table
            class="standardTable"
            hover
            :items="serviceModalProps.serviceTblList"
            :fields="serviceModalProps.serviceTblFields"
            :per-page="serviceModalProps.perPage"
            :current-page="serviceModalProps.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="setSelectedService"
          >
            <template #cell(dateTrans)="data">
              {{ new Date(data.value).toJSON().slice(0, 10) }}
            </template>
          </b-table>

          <!-- tbl pages -->
          <b-pagination
            v-model="serviceModalProps.currentPage"
            :total-rows="totalRowsServiceModal"
            :per-page="serviceModalProps.perPage"
            aria-controls="my-table"
            class="paginationSmall"
          ></b-pagination>

          <hr />

          <!-- service modal action btn -->
          <div class="div-content-left">
            <b-button
              variant="success"
              class="form-btn modal-action-btn"
              @click="selectService"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Select
            </b-button>

            <b-button
              variant="danger"
              class="form-btn modal-action-btn"
              @click="$bvModal.hide('serviceModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>

      <!-- Quotation Modals -->
      <b-modal id="quoteModal" size="lg" hide-footer hide-header title="Select Quotation">
        <div class="font-13">
          <h6>Select Service</h6>
          <hr />
          <!-- search input -->
          <b-form-group id="inputSearch" label="Search:" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="quotationModalProps.inputSearch"
              placeholder="Search . . ."
              class="standardFontSize"
              @keyup.enter="loadQuotes()"
            ></b-form-input>
          </b-form-group>

          <!-- quotation modal table -->
          <b-table
            class="standardTable"
            hover
            :items="quotationModalProps.quotationTblList"
            :fields="quotationModalProps.quotationTblFields"
            :per-page="quotationModalProps.perPage"
            :current-page="quotationModalProps.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="setSelectedQuote"
          >
            <template #cell(dateTrans)="data">
              {{ new Date(data.value).toJSON().slice(0, 10) }}
            </template>
          </b-table>

          <!-- tbl pages -->
          <b-pagination
            v-model="quotationModalProps.currentPage"
            :total-rows="totalRowsQuoteModal"
            :per-page="quotationModalProps.perPage"
            aria-controls="my-table"
            class="paginationSmall"
          ></b-pagination>

          <hr />

          <!-- quote modal action btn -->
          <div class="div-content-left">
            <b-button
              variant="success"
              class="form-btn modal-action-btn"
              @click="selectQuote"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Select
            </b-button>

            <b-button
              variant="danger"
              class="form-btn modal-action-btn"
              @click="$bvModal.hide('quoteModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>

    <div class="print">
      <SalesInvoice />
    </div>
  </div>
</template>

<script>
import SalesInvoice from "../../components/Reports/SalesInvoice.vue";
import axios from "axios";
export default {
  components: {
    SalesInvoice,
  },

  name: "Cashier",

  data() {
    return {
      totalAmount: 0,
      isBusy: false,
      isPr: false,
      isDisableService: false,
      isDisableQuote: false,

      form: {
        customderId: "",
        salesInvoiceNumber: "",
        quote: {
          quoteId: "",
          quoteNum: "",
        },
        service: {
          serviceId: "",
          serviceNum: "",
        },
      },

      serviceProps: {
        perPage: 4,
        currentPage: 1,
        serviceLineList: [],
        serviceLineTblField: [
          { key: "service_name", label: "Service Item", thStyle: { width: "60%" } },
          { key: "unit", label: "Unit", thStyle: { width: "10%" } },
          { key: "cost", label: "Cost", thStyle: { width: "10%" } },
          { key: "qty", label: "Qty", thStyle: { width: "10%" } },
          { key: "amount", label: "Amount", thStyle: { width: "10%" } },
        ],
      },

      quotationProps: {
        perPage: 4,
        currentPage: 1,
        quotationLineList: [],
        quotationLineTblFields: [
          { key: "productCode", label: "Product Code", thStyle: { width: "20%" } },
          { key: "productName", label: "Product Name", thStyle: { width: "40%" } },
          { key: "unit", label: "Unit", thStyle: { width: "10%" } },
          { key: "cost", label: "Cost", thStyle: { width: "10%" } },
          { key: "qty", label: "Quantity", thStyle: { width: "10%" } },
          { key: "amount", label: "Amount", thStyle: { width: "10%" } },
        ],
      },

      serviceModalProps: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        serviceTblList: [],
        serviceTblFields: [
          { key: "serviceNumber", label: "Service Number", thStyle: { width: "20%" } },
          { key: "customerName", label: "Customer Name", thStyle: { width: "30%" } },
          { key: "serial_number", label: "Serial Number", thStyle: { width: "30%" } },
          "dateTrans",
        ],
      },

      quotationModalProps: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        quotationTblList: [],
        quotationTblFields: [
          { key: "quoteNumber", label: "Qoutation #", thStyle: { width: "20%" } },
          { key: "customerName", label: "Customer Name", thStyle: { width: "30%" } },
          { key: "dateTrans", label: "Date Transaction", thStyle: { width: "30%" } },
        ],
      },

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
    };
  },

  methods: {
    //EVENTS

    async openServiceModal() {
      try {
        await this.loadBillings().then((res) => {
          this.loadQuotes();
        });
      } catch (err) {
        console.log(err);
      }
    },

    async openQuoteModal() {
      await this.loadBillings().then((res) => {
        this.loadQuotes();
      });
    },

    onPrint() {
      window.print();
    },

    async onClickProcess() {
      this.isBusy = true;

      return await this.$store
        .dispatch("customer/loadCustomerById", {
          customerId: this.form.customderId,
        })
        .then(
          (res) => {
            //POST quote
            this.postBilling();
          },
          (err) => {
            this.isBusy = false;
          }
        );
    },

    async postBilling() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/billing/create`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
        data: {
          customer_id: this.form.customderId,
          user_id: localStorage.userId,
          quotation_id: this.form.quote.quoteId === "" ? null : this.form.quote.quoteId,
          service_id:
            this.form.service.serviceId == "" ? null : this.form.service.serviceId,
        },
      }).then(
        (res) => {
          //SET state for report
          this.form.salesInvoiceNumber = `SI-${res.data.data[0].billing_id}`;
          this.$store.commit("cashier/SET_HEADER", {
            siNum: this.form.salesInvoiceNumber,
            invoiceDate: new Date().toJSON().slice(0, 10),
            svcNum:
              this.form.service.serviceId === ""
                ? "None"
                : `SVC-${this.form.service.serviceId}`,
            quoteNum:
              this.form.quote.quoteId === "" ? "None" : `QTN-${this.form.quote.quoteId}`,
            cashierName: localStorage.userName,
          });

          // SET STATE QUOTELINE
          this.$store.commit(
            "quotation/SET_QUOTE_LINE",
            this.quotationProps.quotationLineList
          );

          //SET STATE SERVICELINE
          this.$store.commit(
            "service/SET_SERVICE_LINE",
            this.serviceProps.serviceLineList
          );

          this.isPr = true;
          this.isBusy = false;

          this.showAlert(3, "success", "Successfully Processed!");
        },
        (err) => {
          console.log(err.response);
          this.isBusy = false;
        }
      );
    },
    showAlert(showAlert, variant, message) {
      this.alert.showAlert = showAlert;
      this.alert.variant = variant;
      this.alert.message = message;
      this.isBusy = false;
    },
    selectService() {
      this.form.service.serviceId = this.serviceModalProps.selected[0].service_id;
      this.form.service.serviceNum = this.serviceModalProps.selected[0].serviceNumber;
      this.form.customderId = this.serviceModalProps.selected[0].customer_id;
      this.loadServiceLineById();
      this.isDisableQuote = true;
      this.$bvModal.hide("serviceModal");
    },

    async loadServiceLineById() {
      await this.$store
        .dispatch("service/loadServiceLineById", {
          serviceId: this.form.service.serviceId,
        })
        .then(
          (res) => {
            this.serviceProps.serviceLineList = this.getServiceLinesById;
            this.computeTotalAmount();
          },
          (err) => {
            console.log(err);
          }
        );
    },

    selectQuote() {
      this.form.quote.quoteId = this.quotationModalProps.selected[0].quotation_id;
      this.form.quote.quoteNum = this.quotationModalProps.selected[0].quoteNumber;
      this.form.customderId = this.quotationModalProps.selected[0].customer_id;
      this.loadQuoteLineById();
      this.$bvModal.hide("quoteModal");
    },

    async loadQuoteLineById() {
      await this.$store
        .dispatch("quotation/loadQuoteLineByID", {
          quoteId: this.form.quote.quoteId,
        })
        .then(
          (res) => {
            this.setAllProducts();
            this.computeTotalAmount();
            this.isDisableService = true;

            //Populate service data here if quotation has service
            if (res.data[0].service_id !== null) {
              this.form.service.serviceId = res.data[0].service_id;
              this.form.service.serviceNum = `SVC-${res.data[0].service_id}`;
              this.loadServiceLineById();
            } else {
              //if no service found then reset service data
              this.serviceProps.serviceLineList = [];
              this.form.service.serviceId = "";
              this.form.service.serviceNum = "";

              this.computeTotalAmount();
            }
          },
          (err) => {
            console.log(err);
          }
        );
    },

    setAllProducts() {
      //temporary list to create custom columns
      let tempList = [];
      // temporary details list to store all temp list
      let tempDetailList = [];

      this.getQuoteLineById.forEach(function (val) {
        //reset temporary list upon iteration
        tempList = [];

        // set customized column
        tempList.skuId = val.sku_id;
        tempList.productCode = val.barcode == null ? val.serial_number : val.barcode;
        tempList.productName =
          val.printname == null ? `${val.brand_name} ${val.model}` : val.printname;
        tempList.unit = val.unit;
        tempList.cost = val.cost;
        tempList.qty = val.qty;
        tempList.amount = val.amount;
        tempList.customer_id = val.customer_id;

        // push temp list to temp details list
        tempDetailList.push(tempList);
      });

      //set to actual list
      this.quotationProps.quotationLineList = tempDetailList;
    },

    //total service + total quote
    computeTotalAmount() {
      let totalAmount = 0;
      this.quotationProps.quotationLineList.forEach(function (val) {
        totalAmount = totalAmount + Number(val.amount);
      });

      this.serviceProps.serviceLineList.forEach(function (val) {
        totalAmount = totalAmount + Number(val.amount);
      });
      this.totalAmount = totalAmount;
    },

    //SET METHODS
    setSelectedServiceLine(items) {
      this.selectedServiceLine = items;
    },
    setSelectedQuoteLine(items) {
      this.selectedLine = items;
    },

    setSelectedService(items) {
      this.serviceModalProps.selected = items;
    },

    setSelectedQuote(items) {
      this.quotationModalProps.selected = items;
    },

    getDoc(mod) {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === mod;
      });
      return doc[0].code;
    },

    //LOAD
    async loadServices() {
      return await this.$store.dispatch("service/loadServices").then((res) => {
        this.serviceModalProps.serviceTblList = this.getServicedList.filter(
          function (val) {
            return val.serviceNumber
              .toLowerCase()
              .includes(this.serviceModalProps.inputSearch);
          }.bind(this)
        );
      });
    },

    async loadQuotes() {
      return await this.$store.dispatch("quotation/loadQuotes").then((res) => {
        this.quotationModalProps.quotationTblList = this.getQuotes.filter(
          function (val) {
            return val.quoteNumber
              .toLowerCase()
              .includes(this.quotationModalProps.inputSearch);
          }.bind(this)
        );
        this.loadServices();
      });
    },

    async loadBillings() {
      return await this.$store.dispatch("cashier/loadBilling");
    },

    onReset() {
      this.form.salesInvoiceNumber = "";
      this.isPr = false;
      this.isDisableService = false;
      this.isDisableQuote = false;
      this.form.quote.quoteId = "";
      this.form.quote.quoteNum = "";
      this.form.service.serviceId = "";
      this.form.service.serviceNum = "";
      this.serviceProps.serviceLineList = [];
      this.quotationProps.quotationLineList = [];
      this.serviceModalProps.serviceTblList = [];
      this.quotationModalProps.quotationTblList = [];
    },
  },

  computed: {
    getBillings() {
      return this.$store.state.cashier.billings;
    },

    totalRowsServiceModal() {
      return this.serviceModalProps.serviceTblList.length;
    },

    totalRowsQuoteModal() {
      return this.quotationModalProps.quotationTblList === undefined
        ? 0
        : this.quotationModalProps.quotationTblList.length;
    },

    showServiceTable() {
      return this.serviceProps.serviceLineList.length > 0;
    },

    showGoodsTable() {
      return this.quotationProps.quotationLineList.length > 0;
    },

    getServicedList() {
      let doc = this.getDoc("SERVICE");
      let servicesList = this.$store.state.service.serviceList;
      let tempList = [];
      let curList = [];
      let serviceIdFromQtn = [];
      let serviceIdFromBilling = [];

      //select all service_id from qtn where service id !== null
      this.getQuotes.forEach(function (val) {
        if (val.service_id !== null) {
          serviceIdFromQtn.push(val.service_id);
        }
      });

      //select all service list where service id not in quotation
      let servicedWithoutQuote = servicesList.filter(function (val) {
        return !serviceIdFromQtn.includes(val.service_id);
      });

      //select all service_id from billing where is not null
      this.getBillings.forEach(function (val) {
        if (val.service_id !== null) {
          serviceIdFromBilling.push(val.service_id);
        }
      });

      // select all quote where not in billing
      let servicedNotBilled = servicedWithoutQuote.filter(function (val) {
        return !serviceIdFromBilling.includes(val.service_id);
      });

      //iterate filteredServiceListand do set new columns
      servicedNotBilled.forEach(function (val) {
        tempList = []; // set temp list to empty
        tempList.service_id = val.service_id;
        tempList.customer_id = val.customer_id;
        tempList.serviceNumber = `${doc}-${val.service_id}`;
        tempList.customerName = val.name;
        tempList.dateTrans = val.date_transaction;
        tempList.serial_number = val.serial_number;
        tempList.comment = val.comment;
        curList.push(tempList);
      });

      //sort then reverse
      curList.sort();
      curList.reverse();

      // return final list
      return curList;
    },

    getServiceLinesById() {
      return this.$store.state.service.serviceLines;
    },
    getQuoteLineById() {
      return this.$store.state.quotation.quoteLines;
    },

    getQuotes() {
      let doc = this.getDoc("QUOTATION");
      let quotesList = this.$store.state.quotation.quotes;
      let tempList = [];
      let curList = [];
      let quoteIdFromBilling = [];

      //select all quote_id from billing where is not null
      this.getBillings.forEach(function (val) {
        if (val.quotation_id !== null) {
          quoteIdFromBilling.push(val.quotation_id);
        }
      });

      // select all quote where not in billing
      let filteredQuoteList = quotesList.filter(function (val) {
        return !quoteIdFromBilling.includes(val.quotation_id);
      });

      filteredQuoteList.forEach(function (val) {
        // set temp list to empty
        tempList = [];
        tempList.quotation_id = val.quotation_id;
        tempList.service_id = val.service_id;
        tempList.customer_id = val.customer_id;
        tempList.quoteNumber = `${doc}-${val.quotation_id}`;
        tempList.customerName = val.name;
        tempList.dateTrans = val.date_transaction;
        curList.push(tempList);
      });

      return curList;
    },
  },
};
</script>

<style scoped></style>
