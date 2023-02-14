<template>
  <div>
    <b-alert
      :show="alert.showAlert"
      :variant="alert.variant"
      @dismissed="alert.showAlert = null"
    >
      {{ alert.message }}
    </b-alert>
    <b-modal id="manageCarModal" hide-header hide-footer size="lg">
      <b-form @submit="onSubmit" v-if="show" class="form-100">
        <b-alert
          :show="alertModal.showAlert"
          :variant="alertModal.variant"
          @dismissed="alertModal.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>

        <h6>Car Details</h6>
        <hr />

        <!-- GRID -->
        <div class="grid-container">
          <!-- Grid1 -->
          <div class="grid-item">
            <b-form-group
              id="serial_number"
              label="Serial Number:"
              label-for="input-serial_number"
            >
              <b-form-input
                type="text"
                id="input-serial_number"
                v-model="form.serial_number"
                placeholder="Enter serial #"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="color" label="Color:" label-for="input-color">
              <b-form-input
                type="text"
                id="input-color"
                v-model="form.color"
                placeholder="Enter color"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="model" label="Model:" label-for="input-model">
              <b-form-input
                type="text"
                id="input-model"
                v-model="form.model"
                placeholder="Enter model"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>

          <!-- Grrid2 -->
          <div class="grid-item">
            <b-form-group id="brandname" label="Brand Name:" label-for="input-brandname">
              <b-form-input
                type="text"
                id="input-brandname"
                v-model="form.brandname"
                placeholder="Enter brandname"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="unit" label="Unit:" label-for="input-unit">
              <b-form-input
                type="text"
                id="input-unit"
                v-model="form.unit"
                placeholder="Enter unit"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="cost" label="Cost:" label-for="input-cost">
              <b-form-input
                type="number"
                id="input-cost"
                v-model="form.cost"
                placeholder="Enter cost"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <!-- END OF GRID -->

        <b-button type="submit" variant="primary" class="font-12">
          <font-awesome-icon
            :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-user-plus']"
          />
          {{ btnSubmitLabel }}
        </b-button>

        <b-button type="reset" variant="danger" class="font-12" @click="onReset">
          <font-awesome-icon icon="fa-solid fa-close" /> Cancel
        </b-button>
      </b-form>
    </b-modal>

    <b-button variant="primary" class="font-12 mb-3" @click="onAdd">
      <font-awesome-icon icon="fa-solid fa-plus" />
      Add Car
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

    <!-- table -->
    <b-table
      class="customer_list-table"
      hover
      :items="tblItems"
      :fields="partsTblFields"
      :per-page="perPage"
      :current-page="currentPage"
    >
      <template #cell(cost)="data">
        {{ Number(data.value).toLocaleString("en-US") }}
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

      alertModal: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      inputSearch: "",
      isUpdate: false,
      perPage: 8,
      currentPage: 1,
      selected: [],
      tblItems: [],
      partsTblFields: [
        { key: "serial_number", label: "Serial Number", thStyle: { width: "20%" } },
        { key: "color", label: "Color", thStyle: { width: "10%" } },
        { key: "model", label: "Model", thStyle: { width: "15%" } },
        { key: "brand_name", label: "Brand", thStyle: { width: "25%" } },
        { key: "unit", label: "Unit", thStyle: { width: "10%" } },
        { key: "cost", label: "Cost", thStyle: { width: "10%" } },
        { key: "action", label: "", thStyle: { width: "10%" } },
      ],
      btnSubmitLabel: "Add New Car Details",

      form: {
        serial_number: "",
        color: "",
        model: "",
        brandname: "",
        unit: "",
        cost: "",
        qty: "",
      },

      show: true,
    };
  },

  methods: {
    onAdd() {
      this.$bvModal.show("manageCarModal");
      this.onReset();
    },

    onEdit(data) {
      this.$bvModal.show("manageCarModal");
      this.selected = data.item;
      this.form.serial_number = this.selected.serial_number;
      this.form.color = this.selected.color;
      this.form.model = this.selected.model;
      this.form.brandname = this.selected.brand_name;
      this.form.unit = this.selected.unit;
      this.form.cost = this.selected.cost;
      this.form.qty = this.selected.qty;
      this.btnSubmitLabel = "Update Car Details";
      this.isUpdate = true;
    },
    showAlert(dissmiss, warning, msg) {
      this.alert.showAlert = dissmiss;
      this.alert.variant = warning;
      this.alert.message = msg;
    },

    showAlertModal(dissmiss, warning, msg) {
      this.alertModal.showAlert = dissmiss;
      this.alertModal.variant = warning;
      this.alertModal.message = msg;
    },

    async onSearch() {
      await this.loadCars().then((res) => {
        let textSearch = this.inputSearch;
        var filteredList = this.tblItems.filter(function (val) {
          return (
            val.serial_number.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.brand_name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.model.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.color.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.unit.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.tblItems = filteredList;
      });
    },

    onReset() {
      this.form.barcode = "";
      this.form.printname = "";
      this.form.unit = "";
      this.form.cost = "";
      this.btnSubmitLabel = "Add New Car Details";
      this.isUpdate = false;
      this.$bvModal.hide("manageCarModal");
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.isUpdate) {
        this.editCars();
      } else {
        this.addCars();
      }
    },

    async loadCars() {
      await this.$store
        .dispatch("goods/loadCars", { token: localStorage.token })
        .then((res) => {
          this.tblItems = this.getCarList;
        });
    },

    async addCars() {
      await this.$store
        .dispatch("goods/addCars", {
          token: localStorage.token,
          unit: this.form.unit,
          cost: this.form.cost,
          serial_number: this.form.serial_number,
          brand_name: this.form.brandname,
          model: this.form.model,
          color: this.form.color,
        })
        .then(
          (res) => {
            this.showAlert(3, "success", "Successfully added new car!");
            this.loadCars();
            this.onReset();
          },
          (err) => {}
        );
    },

    async editCars() {
      await this.$store
        .dispatch("goods/editCars", {
          token: localStorage.token,
          product_car_id: this.selected.product_car_id,
          unit: this.form.unit,
          cost: this.form.cost,
          serial_number: this.form.serial_number,
          brand_name: this.form.brandname,
          model: this.form.model,
          color: this.form.color,
        })
        .then(
          (res) => {
            this.showAlert(3, "info", "Successfully updated selected car!");
            this.loadCars();
            this.onReset();
          },
          (err) => {}
        );
    },
  },

  mounted() {
    this.loadCars();
  },

  computed: {
    rows() {
      return this.tblItems === undefined ? 0 : this.tblItems.length;
    },

    getCarList() {
      return this.$store.state.goods.goodsCarList;
    },
  },
};
</script>

<style scoped>
.form-manage_car {
  width: 75%;
  font-size: 12px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
}
.grid-item {
  text-align: left;
  padding-right: 10px;
  width: 100%;
}

@media (max-width: 800px) {
  .form-manage_car {
    width: 100%;
  }
}

.customer_list-table {
  font-size: 12px;
}
</style>
