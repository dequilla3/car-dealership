<template>
  <div>
    <b-container class="bv-example-row">
      <div class="print-body">
        <b-row>
          <b-col>
            <ReceiptHeader />
          </b-col>

          <b-col>
            <h2>Sales Invoice</h2>
            <h6><b>Invoice No.:</b> {{ this.getHeader.siNum }}</h6>
            <h6><b>Invoice Date: </b> {{ this.getHeader.invoiceDate }}</h6>
            <h6><b>Service #: </b> {{ this.getHeader.svcNum }}</h6>
            <h6><b>Quote #: </b> {{ this.getHeader.quoteNum }}</h6>
          </b-col>

          <div class="w-100"></div>

          <b-col>
            <h5><b>BILL TO</b></h5>
            <hr />
            <label
              ><b>Name:</b>
              {{ this.customer[0] === undefined ? "" : this.customer[0].name }}</label
            >
            <br />
            <label
              ><b>Address:</b>
              {{ this.customer[0] === undefined ? "" : this.customer[0].address }}</label
            >
            <br />
            <label
              ><b>Contact:</b>
              {{
                this.customer[0] === undefined ? "" : this.customer[0].contact_number
              }}</label
            >

            <hr />

            <b-table
              small
              striped
              hover
              :items="getQuoteLines"
              :fields="quotationLineTblFields"
              v-if="getQuoteLines.length > 0"
            />

            <b-table
              :items="getServiceLine"
              :fields="serviceLineTblField"
              small
              striped
              hover
              v-if="getServiceLine.length > 0"
            >
            </b-table>

            <hr />
            <br />

            <br />
            <label class="total"
              >TOTAL: Php {{ this.getTotalAmount.toLocaleString("en-US") }}</label
            >
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
import ReceiptHeader from "./ReceiptHeader.vue";
export default {
  name: "SalesInvoice",

  components: {
    ReceiptHeader,
  },

  data() {
    return {
      currentDate: new Date().toJSON().slice(0, 10),
      quotationLineTblFields: [
        { key: "productCode", label: "Product Code", thStyle: { width: "20%" } },
        { key: "productName", label: "Product Name", thStyle: { width: "40%" } },
        { key: "unit", label: "Unit", thStyle: { width: "10%" } },
        { key: "cost", label: "Cost", thStyle: { width: "10%" } },
        { key: "qty", label: "Quantity", thStyle: { width: "10%" } },
        { key: "amount", label: "Amount", thStyle: { width: "10%" } },
      ],
      serviceLineList: [],
      serviceLineTblField: [
        { key: "service_name", label: "Service Item", thStyle: { width: "60%" } },
        { key: "unit", label: "Unit", thStyle: { width: "10%" } },
        { key: "cost", label: "Cost", thStyle: { width: "10%" } },
        { key: "qty", label: "Qty", thStyle: { width: "10%" } },
        { key: "amount", label: "Amount", thStyle: { width: "10%" } },
      ],
    };
  },

  computed: {
    getTotalAmount() {
      let totalAmount = 0;
      this.getQuoteLines.forEach(function (val) {
        totalAmount = totalAmount + Number(val.amount);
      });

      this.getServiceLine.forEach(function (val) {
        totalAmount = totalAmount + Number(val.amount);
      });
      return totalAmount;
    },
    getQuoteLines() {
      let lines = this.$store.state.quotation.quotationLineList;
      //insert additional coulumn (amount)
      lines.forEach(function (val) {
        val.amount = Number(val.qty) * Number(val.cost);
      });
      return lines;
    },

    getServiceLine() {
      let lines = this.$store.state.service.serviceTransactionLines;
      //insert additional coulumn (amount)
      lines.forEach(function (val) {
        val.amount = Number(val.qty) * Number(val.cost);
      });
      return lines;
    },

    customer() {
      return this.$store.state.customer.customer;
    },

    getHeader() {
      return this.$store.state.cashier.header;
    },
  },
};
</script>

<style scoped>
.total {
  font-size: 20px;
  font-weight: bold;
}
</style>
