<template>
  <div>
    <b-container class="bv-example-row">
      <div class="print-body">
        <b-row>
          <b-col>
            <ReceiptHeader />
          </b-col>

          <b-col>
            <h2>Service Ticket</h2>
            <h6>
              <b>Service No.:</b>
              {{ this.service.serviceNumber }}
            </h6>
            <h6>
              <b>Serial Number: </b>
              {{ this.service.serialNumber }}
            </h6>
            <h6>
              <b>Date Transcation: </b>
              {{ this.service.dateTrans }}
            </h6>
          </b-col>

          <div class="w-100"></div>
          <br />

          <b-col>
            <h5><b>REQUESTOR</b></h5>
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
            <h5><b>COMMENT BY MECHANIC:</b></h5>
            {{ this.service.comment }}
            <hr />
            <br />

            <h5><b>REQUESTED SERVICES</b></h5>
            <b-table small striped hover :items="this.getLines" :fields="reportFields" />

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
  name: "ServiceTicket",
  components: {
    ReceiptHeader,
  },
  data() {
    return {
      currentDate: new Date().toJSON().slice(0, 10),
      reportFields: ["service_name", "unit", "cost", "qty", "amount"],
    };
  },

  methods: {},

  mounted() {},

  computed: {
    customer() {
      return this.$store.state.customer.customer;
    },

    service() {
      return this.$store.state.service.serviceHeader;
    },

    getLines() {
      let lines = this.$store.state.service.serviceTransactionLines;
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
  },
};
</script>

<style scoped>
.total {
  font-size: 20px;
  font-weight: bold;
}
</style>
