<template>
  <div>
    <b-container class="bv-example-row">
      <div class="print-body">
        <b-row>
          <b-col>
            <ReceiptHeader />
          </b-col>

          <b-col>
            <h1>Sales Invoice</h1>
            <h6><b>Invoice No.:</b> 25645602315</h6>
            <h6><b>Invoice Date: </b> {{ currentDate }}</h6>
            <h6><b>Service #: </b> {{ currentDate }}</h6>
            <h6><b>Quote #: </b> {{ currentDate }}</h6>
          </b-col>

          <div class="w-100"></div>
          <br />

          <b-col>
            <h6>BILL TO</h6>
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
    };
  },

  computed: {
    customer() {
      return this.$store.state.customer.customer;
    },
  },
};
</script>

<style lang="scss" scoped></style>
