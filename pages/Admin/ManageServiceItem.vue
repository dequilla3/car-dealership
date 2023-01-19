<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <div><h6>Manage Service Items</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_customer">
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

        <b-form-group id="unit" label="Unit:" label-for="input-unit">
          <b-form-input
            id="input-unit"
            v-model="form.unit"
            placeholder="Enter unit"
            required
            class="globalInputSize"
          ></b-form-input>
        </b-form-group>

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
      isUpdate: false,
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      customerTblFields: ["service_name", "unit", "cost", "dateCreated"],
      btnSubmitLabel: "Add New Service Item",
      customerTblList: [
        {
          id: 1,
          service_name: "FI Cleaning",
          unit: "per car",
          cost: "500",
          dateCreated: currentDate,
        },
        {
          id: 2,
          service_name: "Change Oil",
          unit: "per car",
          cost: "100",
          dateCreated: currentDate,
        },
        {
          id: 2,
          service_name: "Tune-up",
          unit: "day",
          cost: "500",
          dateCreated: currentDate,
        },
      ],

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
