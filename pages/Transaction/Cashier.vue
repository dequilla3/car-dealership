<template>
  <div class="t_cashier-container">
    <Navbar />
    <SideBar />
    <div><h6>Cashier</h6></div>
    <hr />
    <b-form class="form-t_cashier">
      <b-button variant="primary" class="form-t_cashier-btn t-btn-primary-margin-bottom">
        <font-awesome-icon icon="fa-solid fa-plus" />
        New Trasaction
      </b-button>

      <!-- transaction number form group-->
      <b-form-group id="sI" label="Sales Invoice Number:" label-for="sI">
        <b-form-input
          id="sI"
          v-model="form.salesInvoiceNumber"
          placeholder="None"
          required
          class="form-t_cashier-input"
          disabled
        ></b-form-input>
      </b-form-group>

      <!-- quote -->
      <b-form-group id="quote" label="Select Quotation:" label-for="input-quote">
        <b-input-group id="b-input-group-quote">
          <b-form-input
            id="input-quote"
            v-model="form.quote.quoteId"
            required
            class="form-t_cashier-input"
            placeholder="None"
            disabled
          ></b-form-input>
          <b-input-group-append>
            <b-button id="b-modal-quote" variant="secondary" class="form-t_cashier-btn"
              >Select</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <!-- service -->
      <b-form-group id="service" label="Select Service:" label-for="input-service">
        <b-input-group id="b-input-group-quote">
          <b-form-input
            id="input-service"
            v-model="form.service.serviceId"
            required
            class="form-t_cashier-input"
            placeholder="None"
            disabled
          ></b-form-input>
          <b-input-group-append>
            <b-button id="b-modal-service" variant="secondary" class="form-t_cashier-btn"
              >Select</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-form>

    <!-- table service -->
    <b-table
      class="t_cashier-table"
      hover
      :items="serviceProps.serviceLineList"
      :fields="serviceProps.serviceLineTblField"
      :per-page="serviceProps.perPage"
      :current-page="serviceProps.currentPage"
      select-mode="single"
      ref="selectableTable"
      selectable
      selected-variant="info"
      @row-selected="setSelectedServiceLine"
    >
    </b-table>

    <!-- table goods -->
    <b-table
      class="t_cashier-table"
      hover
      :items="quotationProps.quotationLineList"
      :fields="quotationProps.quotationLineTblFields"
      :per-page="quotationProps.perPage"
      :current-page="quotationProps.currentPage"
      select-mode="single"
      ref="selectableTable"
      selectable
      selected-variant="info"
      @row-selected="setSelectedQuoteLine"
    >
    </b-table>

    <!-- Proecss and Print button -->
    <div class="div-content-left">
      <b-button variant="info" class="form-t_cashier-btn btn-transaction">
        <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
      </b-button>

      <b-button variant="info" class="form-t_cashier-btn btn-transaction">
        <font-awesome-icon icon="fa-solid fa-file" />
        Print Receipt
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        salesInvoiceNumber: "",
        quote: {
          quoteId: "",
        },
        service: {
          serviceId: "",
        },
      },
      serviceProps: {
        perPage: 4,
        currentPage: 1,
        serviceLineList: [],
        serviceLineTblField: [
          { key: "serviceName", label: "Service Item", thStyle: { width: "60%" } },
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
          { key: "productCode", label: "Product Code" },
          { key: "productName", label: "Product Name" },
          { key: "unit", label: "Unit" },
          { key: "cost", label: "Cost" },
          { key: "qty", label: "Quantity", thStyle: { width: "10%" } },
          { key: "amount", label: "Amount" },
        ],
      },
    };
  },

  methods: {
    setSelectedServiceLine(items) {
      this.selectedServiceLine = items;
    },
    setSelectedQuoteLine(items) {
      this.selectedLine = items;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}

.form-t_cashier-input {
  height: 35px;
  font-size: 12px;
}

.t_cashier-container {
  margin: 65px 10px 0 270px;
  padding: 20px;
}

.form-t_cashier {
  width: 25%;
  font-size: 12px;
}
.form-t_cashier-btn {
  height: 35px;
  font-size: 12px;
}

.t-btn-primary-margin-bottom {
  width: 150px;
  margin-bottom: 20px;
}
.t_cashier-table {
  width: 100%;
  font-size: 12px;
}

.div-content-left {
  display: flex;
  justify-content: flex-end;
}
.btn-transaction {
  width: 170px;
  margin: 20px 0px 20px 5px;
}
</style>
