<template>
  <div class="manage_car-container">
    <Navbar />
    <SideBar />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_car">
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
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="color" label="Color:" label-for="input-color">
              <b-form-input
                type="text"
                id="input-color"
                v-model="form.color"
                placeholder="Enter color"
                required
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="model" label="Model:" label-for="input-model">
              <b-form-input
                type="text"
                id="input-model"
                v-model="form.model"
                placeholder="Enter model"
                required
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="brandname" label="Brand Name:" label-for="input-brandname">
              <b-form-input
                type="text"
                id="input-brandname"
                v-model="form.brandname"
                placeholder="Enter brandname"
                required
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>
          </div>

          <!-- Grrid2 -->
          <div class="grid-item">
            <b-form-group id="unit" label="Unit:" label-for="input-unit">
              <b-form-input
                type="text"
                id="input-unit"
                v-model="form.unit"
                placeholder="Enter unit"
                required
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="cost" label="Cost:" label-for="input-cost">
              <b-form-input
                type="number"
                id="input-cost"
                v-model="form.cost"
                placeholder="Enter cost"
                required
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="qty" label="Qty:" label-for="input-qty" disabled>
              <b-form-input
                type="number"
                id="input-qty"
                placeholder="Enter beginning balance"
                :disabled="isUpdate"
                class="form-manage_car-input"
              ></b-form-input>
            </b-form-group>
          </div>
          <!-- Grid3 -->
          <div class="grid-item">
            <div class="form-manage_car-after-grid"></div>
            <b-button type="submit" variant="primary" class="form-manage_car-btn">
              {{ btnSubmitLabel }}
            </b-button>

            <b-button
              type="reset"
              variant="danger"
              class="form-manage_car-btn"
              @click="onReset"
            >
              Reset
            </b-button>
          </div>
        </div>

        <!-- END OF GRID -->
      </b-form>

      <br />

      <!-- search input -->
      <b-form-group id="inputSearch" label="Search:" label-for="input-search">
        <b-form-input
          id="input-search"
          v-model="inputSearch"
          placeholder="Enter text . . ."
          class="form-manage_car-input"
        ></b-form-input>
      </b-form-group>

      <!-- table -->
      <b-table
        class="customer_list-table"
        hover
        :items="partsTblList"
        :fields="partsTblFields"
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
      isUpdate: false,
      perPage: 3,
      currentPage: 1,
      selected: [],
      partsTblFields: [
        "serial_number",
        "color",
        "model",
        "brandname",
        "unit",
        "cost",
        "qty",
      ],
      btnSubmitLabel: "Add New Car Details",
      partsTblList: [
        {
          serial_number: "21456789JKL",
          id: 1,
          color: "RED",
          model: "v2",
          brandname: "BMW",
          unit: "PC",
          cost: "12000000",
          qty: "1",
        },
        {
          serial_number: "789456789EDE",
          id: 2,
          color: "BLUE",
          model: "v3.3",
          brandname: "MAZDA",
          unit: "PC",
          cost: "13500000",
          qty: "1",
        },
        {
          serial_number: "89897564231KLL",
          id: 3,
          color: "YELLOW",
          model: "v10",
          brandname: "Mercedes-Benz",
          unit: "PC",
          cost: "20500000",
          qty: "1",
        },
      ],

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
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.serial_number = this.selected[0].serial_number;
        this.form.color = this.selected[0].color;
        this.form.model = this.selected[0].model;
        this.form.brandname = this.selected[0].brandname;
        this.form.unit = this.selected[0].unit;
        this.form.cost = this.selected[0].cost;
        this.form.qty = this.selected[0].qty;
        this.btnSubmitLabel = "Update Car Details";
        this.isUpdate = true;
      } else {
        this.form.serial_number = "";
        this.form.color = "";
        this.form.model = "";
        this.form.brandname = "";
        this.form.unit = "";
        this.form.cost = "";
        this.form.qty = "";
        this.btnSubmitLabel = "Add New Car Details";
        this.isUpdate = false;
      }
    },
    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.barcode = "";
      this.form.printname = "";
      this.form.unit = "";
      this.form.cost = "";
      this.btnSubmitLabel = "Add new Parts";
      this.isUpdate = false;
    },
    onSubmit(event) {
      event.preventDefault();
      console.log(JSON.stringify(this.form));
    },
  },
  computed: {
    rows() {
      return this.partsTblList.length;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}

.form-manage_car {
  width: 75%;
  font-size: 12px;
}

.form-manage_car-input {
  height: 35px;
  font-size: 12px;
}

.form-manage_car-btn {
  font-size: 12px;
  width: 180px;
  margin-bottom: 10px;
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
  .form-manage_car-btn {
    width: 100%;
  }
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
