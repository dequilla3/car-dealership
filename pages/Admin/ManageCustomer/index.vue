<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <div><h6>Manage Customer</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-60">
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
        <div class="grid-container-3">
          <div class="grid-item">
            <b-form-group id="name" label="Name:" label-for="input-name">
              <b-form-input
                id="input-name"
                v-model="form.name"
                placeholder="Enter name"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="grid-item">
            <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
              <b-form-input
                id="input-contact"
                v-model="form.contact"
                placeholder="Enter contact number"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>

          <div class="grid-item">
            <b-form-group id="address" label="Address:" label-for="input-address">
              <b-form-input
                id="input-address"
                v-model="form.address"
                placeholder="Enter address"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>

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
          @keyup.enter="onSearch"
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
        <template #cell(date_created)="data">
          {{ new Date(data.value).toJSON().slice(0, 10) }}
        </template>
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
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      icn: "fa-user-plus",
      inputSearch: "",
      perPage: 5,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contact_number", "address", "date_created"],
      btnSubmitLabel: "Add new Customer",
      customerTblList: [],

      form: {
        name: "",
        contact: "",
        address: "",
      },

      show: true,
      isUpdate: false,
    };
  },

  methods: {
    showAlert(dissmiss, warning, msg) {
      this.alert.showAlert = dissmiss;
      this.alert.variant = warning;
      this.alert.message = msg;
    },

    async onSearch() {
      await this.loadCustomer().then((res) => {
        let textSearch = this.inputSearch;
        var filteredList = this.customerTblList.filter(function (val) {
          return (
            val.name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.address.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.contact_number.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.customerTblList = filteredList;
      });
    },

    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.name = this.selected[0].name;
        this.form.contact = this.selected[0].contact_number;
        this.form.address = this.selected[0].address;
        this.btnSubmitLabel = "Update Customer";
        this.icn = "fa-user-pen";
        this.isUpdate = true;
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.btnSubmitLabel = "Add new Customer";
        this.icn = "fa-user-plus";
        this.isUpdate = false;
      }
    },
    onReset() {
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Customer";
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.isUpdate) {
        this.editCustomer();
      } else {
        this.addCustomer();
      }
    },

    async loadCustomer() {
      return await this.$store
        .dispatch("customer/loadCustomers", { token: localStorage.token })
        .then(
          (res) => {
            this.customerTblList = this.getCustomerList;
            return res;
          },
          (err) => {
            this.showAlert(3, "warning", `${err.response.data.error}`);
          }
        );
    },

    async addCustomer() {
      await this.$store
        .dispatch("customer/addCustomer", {
          token: localStorage.token,
          name: this.form.name,
          contact_number: this.form.contact,
          address: this.form.address,
        })
        .then(
          (res) => {
            this.showAlert(3, "success", "Successfully added new customer!");
            this.loadCustomer();
            this.onReset();
          },
          (err) => {
            this.showAlert(3, "warning", `${err.response.data.error}`);
          }
        );
    },

    async editCustomer() {
      await this.$store
        .dispatch("customer/editCustomer", {
          token: localStorage.token,
          customer_id: this.selected[0].customer_id,
          name: this.form.name,
          contact_number: this.form.contact,
          address: this.form.address,
        })
        .then(
          (res) => {
            this.showAlert(3, "info", "Successfully updated customer!");
            this.loadCustomer();
            this.onReset();
          },
          (err) => {
            this.showAlert(3, "warning", `${err.response.data.error}`);
          }
        );
    },
  },

  mounted() {
    this.loadCustomer();
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
