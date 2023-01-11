<template>
  <div class="manage_customer-container">
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
            class="form-manage_customer-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
          <b-form-input
            id="input-contact"
            v-model="form.contact"
            placeholder="Enter contact number"
            required
            class="form-manage_customer-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="address" label="Address:" label-for="input-address">
          <b-form-input
            id="input-address"
            v-model="form.address"
            placeholder="Enter address"
            required
            class="form-manage_customer-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_customer-btn">
          <font-awesome-icon icon="fa-solid fa-check" /> {{ btnSubmitLabel }}
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
          class="form-manage_customer-input"
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
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contactNumber", "address", "dateCreated"],
      btnSubmitLabel: "Add new Customer",
      customerTblList: [
        {
          id: 1,
          name: "Test Data Customer",
          contactNumber: "09123456789",
          address: "Surallah 3232323",
          dateCreated: currentDate,
          // _rowVariant: "info",
        },
        {
          id: 2,
          name: "Test Customer Data II",
          contactNumber: "09123456789",
          address: "Koronadal",
          dateCreated: currentDate,
        },
      ],

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
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.btnSubmitLabel = "Add new Customer";
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
  computed: {
    rows() {
      return this.customerTblList.length;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.manage_customer-container {
  margin: 80px 10px 0 280px;
}
.form-manage_customer {
  width: 75%;
  font-size: 14px;
}

.form-manage_customer-input {
  height: 35px;
  font-size: 13px;
}

.form-manage_customer-btn {
  font-size: 13px;
  width: 180px;
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
  font-size: 13px;
}

.pagination {
  font-size: 12px;
}
</style>
