<template>
  <div class="print-body">
    <h1><ReceiptHeader /></h1>
    <h2 class="title">Customer List</h2>
    <b-table
      class="standardTable"
      :items="customerTblList"
      :fields="customerTblFields"
      small
    >
      <template #cell(date_created)="data">
        {{ new Date(data.value).toJSON().slice(0, 10) }}
      </template>
    </b-table>
  </div>
</template>

<script>
import ReceiptHeader from "./ReceiptHeader.vue";
export default {
  components: {
    ReceiptHeader,
  },
  name: "CustomerReport",

  data() {
    return {
      customerTblFields: ["name", "contact_number", "address", "date_created"],
      customerTblList: [],
    };
  },

  mounted() {
    //init list
    this.customerTblList = this.getCustomerList;

    //refresh list every 3secs
    setInterval(() => {
      this.customerTblList = this.getCustomerList;
    }, 3000);
  },

  computed: {
    getCustomerList() {
      return this.$store.state.customer.customerList;
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  opacity: 0.7;
}

.title {
  text-align: center;
  padding: 20px;
}
</style>
