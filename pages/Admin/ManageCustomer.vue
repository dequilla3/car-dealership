<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <div><h6>Manage Customer</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_customer">
        <b-form-group id="name" label="Name:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="form.name"
            placeholder="Enter name"
            required
            class="globalInputSize"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
          <b-form-input
            id="input-contact"
            v-model="form.contact"
            placeholder="Enter contact number"
            required
            class="globalInputSize"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="address" label="Address:" label-for="input-address">
          <b-form-input
            id="input-address"
            v-model="form.address"
            placeholder="Enter address"
            required
            class="globalInputSize"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_customer-btn">
          <font-awesome-icon :icon="['fa-solid', icn]" /> {{ btnSubmitLabel }}
        </b-button>

        <b-button
          type="reset"
          variant="danger"
          class="form-manage_customer-btn"
          @click="onReset"
        >
          <font-awesome-icon icon="fa-solid fa-redo" /> Reset
        </b-button>
      </b-form>

      <br />

      <!-- search input -->
      <b-form-group id="inputSearch" label="Search:" label-for="input-search">
        <b-form-input
          id="input-search"
          v-model="inputSearch"
          placeholder="Enter text . . ."
          class="globalInputSize"
        ></b-form-input>
      </b-form-group>

      <b-table
        class="customer_list-table"
        hover
        :items="customerTblList"
        :fields="customerTblFields"
        :per-page="perPage"
        :current-page="currentPage"
        select-mode="single"
        ref="selectableTable"
        selectable
        selected-variant="info"
        @row-selected="onRowSelected"
      >
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        class="pagination"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      icn: "fa-user-plus",
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contactNumber", "address", "dateCreated"],
      btnSubmitLabel: "Add new Customer",
      customerTblList: [],

      form: {
        name: "",
        contact: "",
        address: "",
      },

      show: true,
    };
  },

  methods: {
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.name = this.selected[0].name;
        this.form.contact = this.selected[0].contactNumber;
        this.form.address = this.selected[0].address;
        this.btnSubmitLabel = "Update Customer";
        this.icn = "fa-user-pen";
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.btnSubmitLabel = "Add new Customer";
        this.icn = "fa-user-plus";
      }
    },
    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Customer";
    },
    onSubmit(event) {
      event.preventDefault();
      console.log(JSON.stringify(this.form));
    },
  },

  created() {
    this.customerTblList = this.getCustomerList;
  },

  computed: {
    rows() {
      return this.customerTblList.length;
    },

    getCustomerList() {
      return this.$store.state.customer.customerList;
    },
  },
};
</script>

<style scoped>
.form-manage_customer {
  width: 30%;
  font-size: 12px;
}

.form-manage_customer-btn {
  font-size: 12px;
  width: 160px;
  margin-bottom: 10px;
}

@media (max-width: 800px) {
  .form-manage_customer-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_customer {
    width: 100%;
  }
}

.customer_list-table {
  width: 100%;
  font-size: 12px;
}

.pagination {
  font-size: 12px;
}
</style>
