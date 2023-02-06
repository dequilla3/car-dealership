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
          @keyup.enter="loadQuotes"
        ></b-form-input>
        <b-input-group-append>
          <b-button class="btn-100" @click="loadQuotes">
            <font-awesome-icon icon="fa-solid fa-filter" /> Filter
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>

    <b-table
      class="standardTable"
      hover
      :items="quotes"
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
          v-b-modal="'viewDetailsModalQuote'"
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
          <font-awesome-icon icon="fa-solid fa-print" /> Print</b-button
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
    <b-modal id="viewDetailsModalQuote" size="xl" hide-footer hide-header title="Details">
      <div class="modal-container">
        <h6>Quotation Details Details</h6>
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
            @click="$bvModal.hide('viewDetailsModalQuote')"
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
  name: "QuotationReportTab",
  components: {
    ReceiptHeader,
  },

  data() {
    return {
      inputSearch: "",
      show: false,
      selectedQuote: [],
      perPage: 5,
      currentPage: 1,
      quotes: [],
      quotationLines: [],
      tblFields: [
        { key: "quoteNumber", label: "Quotation #", thStyle: { width: "25%" } },
        { key: "name", label: "Customer Name", thStyle: { width: "25%" } },
        { key: "date_transaction", label: "Date Transaction", thStyle: { width: "25%" } },
        { key: "viewDetails", label: "View Details", thStyle: { width: "10%" } },
        { key: "print", label: "Print", thStyle: { width: "10%" } },
      ],

      viewDetailsModal: {
        detailsList: [],
        detailsFields: [
          { key: "productCode", label: "Product Code", thStyle: { width: "20%" } },
          { key: "productName", label: "Product Name", thStyle: { width: "40%" } },
          { key: "unit", label: "Unit", thStyle: { width: "10%" } },
          { key: "cost", label: "Cost", thStyle: { width: "10%" } },
          { key: "qty", label: "Quantity", thStyle: { width: "10%" } },
          { key: "amount", label: "Amount", thStyle: { width: "10%" } },
        ],
        perPage: 5,
        currentPage: 1,
      },
    };
  },

  methods: {
    onViewDetails(data) {
      this.selectedQuote = data.item;
      this.loadQuoteLineById();
    },

    async loadQuoteLineById() {
      await this.$store
        .dispatch("quotation/loadQuoteLineByID", {
          quoteId: this.selectedQuote.quotation_id,
        })
        .then(
          (res) => {
            this.setAllProducts();
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
          val.printname == null
            ? `${val.brand_name}-${val.model}-${val.color}`
            : val.printname;
        tempList.unit = val.unit;
        tempList.cost = val.cost;
        tempList.qty = val.qty;
        tempList.amount = val.amount;
        tempList.customer_id = val.customer_id;

        // push temp list to temp details list
        tempDetailList.push(tempList);
      });

      //set to actual list
      this.viewDetailsModal.detailsList = tempDetailList;
      this.quotationLines = tempDetailList;
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
            this.selectedQuote = data.item;
            this.loadLinesOnPrint();
          });
      } catch (err) {
        console.log(err);
      }
    },

    async loadLinesOnPrint() {
      await this.$store
        .dispatch("quotation/loadQuoteLineByID", {
          quoteId: this.selectedQuote.quotation_id,
        })
        .then(
          (res) => {
            //SET loaded lines from global state to local state
            this.setAllProducts();

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
      this.$store.commit("quotation/SET_QUOTE_LINE", this.quotationLines);
      this.$store.commit("quotation/SET_QUOTE_HEADER", {
        quoteNum: this.selectedQuote.quoteNumber,
        serviceNum: this.getDoc("SERVICE", this.selectedQuote.service_id),
      });
    },

    getDoc(module, id) {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === module;
      });
      return id === null ? "NONE" : `${doc[0].code}-${id}`;
    },

    async loadQuotes() {
      await this.$store.dispatch("quotation/loadQuotes").then(
        (res) => {
          let searchTxt = this.inputSearch.toLowerCase();
          let filteredList = this.getQuotes.filter(function (val) {
            return (
              val.name.toLowerCase().includes(searchTxt) ||
              val.quoteNumber.toLowerCase().includes(searchTxt)
            );
          });
          this.quotes = filteredList;
        },
        (err) => {}
      );
    },
  },

  mounted() {
    setInterval(() => {
      this.loadQuotes();
    }, 3000);
  },

  computed: {
    getQuoteLineById() {
      return this.$store.state.quotation.quoteLines;
    },

    isListEmpty() {
      return this.services.length < 1;
    },

    getQuotes() {
      let quotesList = this.$store.state.quotation.quotes;
      let tempList = [];
      let curList = [];

      quotesList.forEach(
        function (val) {
          // set temp list to empty
          tempList = [];
          tempList.quotation_id = val.quotation_id;
          tempList.service_id = val.service_id;
          tempList.customer_id = val.customer_id;
          tempList.quoteNumber = this.getDoc("QUOTATION", val.quotation_id);
          tempList.name = val.name;
          tempList.date_transaction = val.date_transaction;
          curList.push(tempList);
        }.bind(this)
      );

      return curList;
    },

    rows() {
      return this.quotes === undefined ? 0 : this.quotes.length;
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
