<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <transition name="slide-fade">
      <div v-show="showDelay">
        <div><h6>Manage Customer</h6></div>
        <hr />
        <div>
          <b-alert
            :show="alert.showAlert"
            :variant="alert.variant"
            @dismissed="alert.showAlert = null"
            class="font-12"
          >
            {{ alert.message }}
          </b-alert>

          <b-modal id="customerFormModal" hide-footer hide-header size="lg">
            <b-form @submit="onSubmit" v-if="show" class="form-100">
              <b-alert
                :show="alertModal.showAlert"
                :variant="alertModal.variant"
                @dismissed="alertModal.showAlert = null"
              >
                {{ alert.message }}
              </b-alert>
              <h6>Customer Details</h6>
              <hr />
              <b-form-group id="name" label="Name:" label-for="input-name">
                <b-form-input
                  id="input-name"
                  v-model="form.name"
                  placeholder="Enter name"
                  required
                  class="globalInputSize"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                id="contact"
                label="Cotanct Number:"
                label-for="input-contact"
              >
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

              <b-button type="submit" variant="primary" class="font-12">
                <font-awesome-icon :icon="['fa-solid', icn]" /> {{ btnSubmitLabel }}
              </b-button>

              <b-button type="reset" variant="danger" class="font-12" @click="onReset">
                <font-awesome-icon icon="fa-solid fa-close" /> Cancel
              </b-button>
            </b-form>
          </b-modal>
          <!-- end of modal -->

          <b-button variant="primary" class="font-12 mb-3" @click="onAdd">
            <font-awesome-icon icon="fa-solid fa-user-plus" /> Add Customer
          </b-button>

          <!-- search input -->
          <b-form-group id="inputSearch" label="" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="inputSearch"
              placeholder="Search . . ."
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
          >
            <template #cell(date_created)="data">
              {{ new Date(data.value).toJSON().slice(0, 10) }}
            </template>

            <template #cell(action)="data">
              <b-button size="sm" class="font-10" variant="info" @click="onEdit(data)">
                <font-awesome-icon icon="fa-solid fa-user-pen" /> Update</b-button
              >
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            class="paginationSmall"
          ></b-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      showDelay: false,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      alertModal: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      icn: "fa-user-plus",
      inputSearch: "",
      perPage: 5,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contact_number", "address", "date_created", "action"],
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
    showAlertModal(dissmiss, warning, msg) {
      this.alert.showAlert = dissmiss;
      this.alert.variant = warning;
      this.alert.message = msg;
    },
    onAdd() {
      this.$bvModal.show("customerFormModal");
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Customer";
      this.icn = "fa-user-plus";
      this.isUpdate = false;
    },

    onEdit(data) {
      this.selected = data.item;
      this.$bvModal.show("customerFormModal");
      this.form.name = this.selected.name;
      this.form.contact = this.selected.contact_number;
      this.form.address = this.selected.address;
      this.btnSubmitLabel = "Update Customer";
      this.icn = "fa-user-pen";
      this.isUpdate = true;
    },

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

    onReset() {
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Customer";
      this.$bvModal.hide("customerFormModal");
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
            this.showAlertModal(3, "success", "Successfully added new customer!");
            this.loadCustomer();
            this.onReset();
          },
          (err) => {
            this.showAlertModal(3, "warning", `${err.response.data.error}`);
          }
        );
    },

    async editCustomer() {
      await this.$store
        .dispatch("customer/editCustomer", {
          token: localStorage.token,
          customer_id: this.selected.customer_id,
          name: this.form.name,
          contact_number: this.form.contact,
          address: this.form.address,
        })
        .then(
          (res) => {
            this.showAlertModal(3, "info", "Successfully updated customer!");
            this.loadCustomer();
            this.onReset();
          },
          (err) => {
            this.showAlertModal(3, "warning", `${err.response.data.error}`);
          }
        );
    },
  },

  mounted() {
    this.loadCustomer();
    setTimeout(() => {
      this.showDelay = true;
    }, 1);
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
</style>
