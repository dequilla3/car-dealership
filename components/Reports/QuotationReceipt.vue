<template>
  <div>
    <b-container class="bv-example-row">
      <div class="print-body">
        <b-row>
          <b-col>
            <ReceiptHeader />
          </b-col>

          <!-- HEAD -->
          <b-col>
            <h2>Quotation</h2>
            <h6>
              <b>Quotation No.:</b>
              {{ this.quotationHeader.quoteNum }}
            </h6>
            <h6 v-if="this.hasService">
              <b>Service No.:</b>
              {{ this.quotationHeader.serviceNum }}
            </h6>
            <h6>
              <b>Date: </b>
              {{ currentDate }}
            </h6>
            <h6>
              <b>Valid Until: </b>
              {{ currentDate }}
            </h6>
          </b-col>

          <div class="w-100"></div>
          <br />

          <!-- BODY -->
          <b-col>
            <h5><b>Customer Details</b></h5>
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

            <br />

            <h5><b>Description</b></h5>
            <b-table
              small
              striped
              hover
              :items="this.getLines"
              :fields="quotationLineTblFields"
            />

            <hr />
            <br />
            <label class="total"
              >TOTAL: Php {{ this.getTotal.toLocaleString("en-US") }}</label
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
  name: "QuotationReceipt",
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
    };
  },

  methods: {},

  mounted() {},

  computed: {
    customer() {
      return this.$store.state.customer.customer;
    },

    quotationHeader() {
      return this.$store.state.quotation.quoteHeader;
    },

    getLines() {
      let lines = this.$store.state.quotation.quotationLineList;
      //insert additional coulumn (amount)
      lines.forEach(function (val) {
        val.amount = Number(val.qty) * Number(val.cost);
      });
      return lines;
    },

    getTotal() {
      let lineAmt = 0;
      this.getLines.forEach(function (val) {
        lineAmt = lineAmt + val.amount;
      });
      return lineAmt;
    },

    hasService() {
      return this.quotationHeader.serviceNum != "";
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
