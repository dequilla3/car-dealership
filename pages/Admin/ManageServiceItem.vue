<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <div><h6>Manage Service Items</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-60">
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }} <br />
          {{ alert.subMsg }}
        </b-alert>
        <div class="grid-container-3">
          <div class="grid-item">
            <b-form-group
              id="service_name"
              label="Service Item:"
              label-for="input-service_name"
            >
              <b-form-input
                id="input-service_name"
                v-model="form.service_name"
                placeholder="Enter service item name"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="grid-item">
            <b-form-group id="unit" label="Unit:" label-for="input-unit">
              <b-form-input
                id="input-unit"
                v-model="form.unit"
                placeholder="Enter unit"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="grid-item">
            <b-form-group id="cost" label="Cost:" label-for="input-cost">
              <b-form-input
                id="input-cost"
                type="number"
                v-model="form.cost"
                placeholder="Enter cost"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>

        <b-button type="submit" variant="primary" class="form-manage_customer-btn">
          <font-awesome-icon
            :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-user-plus']"
          />
          {{ btnSubmitLabel }}
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
        :items="serviceTblList"
        :fields="serviceTblFields"
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
        subMsg: "",
      },
      isUpdate: false,
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      serviceTblFields: ["service_name", "unit", "cost", "date_created"],
      btnSubmitLabel: "Add New Service Item",
      serviceTblList: [],

      form: {
        service_name: "",
        unit: "",
        cost: "",
        dateCreated: "",
      },

      show: true,
    };
  },
  methods: {
    showAlert(dissmiss, warning, msg) {
      this.alert.showAlert = dissmiss;
      this.alert.variant = warning;
      this.alert.message = msg;
    },
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.service_name = this.selected[0].service_name;
        this.form.unit = this.selected[0].unit;
        this.form.cost = this.selected[0].cost;
        this.btnSubmitLabel = "Update Service Item";
        this.isUpdate = true;
      } else {
        this.form.service_name = "";
        this.form.unit = "";
        this.form.cost = "";
        this.btnSubmitLabel = "Add New Service Item";
        this.isUpdate = false;
      }
    },
    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.service_name = "";
      this.form.unit = "";
      this.form.cost = "";
      this.btnSubmitLabel = "Add New Service Item";
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.isUpdate) {
        this.editServiceItem();
      } else {
        this.addServiceItem();
      }
    },

    async loadServiceItems() {
      await this.$store
        .dispatch("service/loadServiceItemList", {
          token: localStorage.token,
        })
        .then((res) => {
          this.serviceTblList = this.getServiceItems;
        });
    },

    async addServiceItem() {
      await this.$store
        .dispatch("service/addServiceITem", {
          token: localStorage.token,
          service_name: this.form.service_name,
          unit: this.form.unit,
          cost: this.form.cost,
        })
        .then((res) => {
          this.showAlert(3, "success", "Successfully added new service item!");
          this.loadServiceItems();
          this.onReset();
        });
    },

    async editServiceItem() {
      await this.$store
        .dispatch("service/editServiceITem", {
          token: localStorage.token,
          service_item_id: this.selected[0].service_item_id,
          service_name: this.form.service_name,
          unit: this.form.unit,
          cost: this.form.cost,
        })
        .then(
          (res) => {
            this.showAlert(3, "success", "Successfully updated selected service item!");
            this.loadServiceItems();
            this.onReset();
          },
          (err) => {
            this.onReset();
            this.showAlert(3, "warning", err.response.data.error);
          }
        );
    },
  },
  mounted() {
    this.loadServiceItems();
  },
  computed: {
    rows() {
      return this.serviceTblList.length;
    },

    getServiceItems() {
      return this.$store.state.service.serviceItemsList;
    },
  },
};
</script>

<style scoped>
.form-manage_customer {
  width: 75%;
  font-size: 12px;
}

.form-manage_customer-btn {
  font-size: 12px;
  width: 185px;
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
