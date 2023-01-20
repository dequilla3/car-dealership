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
          </b-col>

          <div class="w-100"></div>
          <br />

          <b-col>
            <h6>BILL TO</h6>
            <hr />
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
};
</script>

<style lang="scss" scoped></style>
