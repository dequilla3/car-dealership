<template>
  <div class="print-body">
    <h1><ReceiptHeader /></h1>
    <h2 class="title">Car List</h2>
    <b-table class="standardTable" :items="tblList" :fields="tblFields" small>
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
  name: "CarReport",

  data() {
    return {
      tblFields: ["serial_number", "color", "model", "brand_name", "unit", "cost"],
      tblList: [],
    };
  },

  mounted() {
    //init list data
    this.tblList = this.getList;

    //refresh list every 3secs
    setInterval(() => {
      this.tblList = this.getList;
    }, 3000);
  },

  computed: {
    getList() {
      return this.$store.state.goods.goodsCarList;
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
