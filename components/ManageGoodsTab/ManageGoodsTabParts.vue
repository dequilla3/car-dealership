<template>
  <div>
    <Navbar />
    <SideBar />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manag_parts">
        <!-- GRID -->
        <div class="grid-container">
          <!-- Grid1 -->
          <div class="grid-item">
            <b-form-group id="barcode" label="Barcode:" label-for="input-barcode">
              <b-form-input
                type="text"
                id="input-barcode"
                v-model="form.barcode"
                placeholder="Enter barcode"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="printname" label="Printname:" label-for="input-printname">
              <b-form-input
                type="text"
                id="input-printname"
                v-model="form.printname"
                placeholder="Enter printname"
                required
                class="globalInputSize"
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
          <!-- Grid3 -->
          <div class="grid-item">
            <b-form-group id="qty" label="Qty:" label-for="input-qty" disabled>
              <b-form-input
                type="number"
                id="input-qty"
                v-model="form.qty"
                placeholder="Enter beginning balance"
                :disabled="isUpdate"
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>
          </div>
          <!-- Grid4 -->
          <div class="grid-item"></div>
          <!-- Grid5 -->
          <div class="grid-item">
            <div class="form-manag_parts-after-grid"></div>
            <b-button type="submit" variant="primary" class="form-manag_parts-btn">
              <font-awesome-icon
                :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-user-plus']"
              />
              {{ btnSubmitLabel }}
            </b-button>

            <b-button
              type="reset"
              variant="danger"
              class="form-manag_parts-btn"
              @click="onReset"
            >
              <font-awesome-icon icon="fa-solid fa-redo" /> Reset
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
          class="globalInputSize"
        ></b-form-input>
      </b-form-group>

      <!-- table -->
      <b-table
        class="customer_list-table"
        hover
        :items="tblList"
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
      isUpdate: false,
      perPage: 3,
      currentPage: 1,
      selected: [],
      partsTblFields: ["barcode", "printname", "unit", "cost"],
      btnSubmitLabel: "Add new Parts",
      tblList: [],

      form: {
        barcode: "",
        printname: "",
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
        this.form.barcode = this.selected[0].barcode;
        this.form.printname = this.selected[0].printname;
        this.form.unit = this.selected[0].unit;
        this.form.cost = this.selected[0].cost;
        this.btnSubmitLabel = "Update Parts";
        this.isUpdate = true;
      } else {
        this.form.barcode = "";
        this.form.printname = "";
        this.form.unit = "";
        this.form.cost = "";
        this.btnSubmitLabel = "Add new Parts";
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

  created() {
    this.tblList = this.getPartList;
  },

  computed: {
    rows() {
      return this.tblList === undefined ? 0 : this.tblList.length;
    },

    getPartList() {
      return this.$store.state.goods.partsList;
    },
  },
};
</script>

<style scoped>
.form-manag_parts {
  width: 75%;
  font-size: 12px;
}

.form-manag_parts-btn {
  font-size: 12px;
  width: 150px;
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
  .form-manag_parts-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manag_parts {
    width: 100%;
  }
}

.customer_list-table {
  font-size: 12px;
}
.pagination {
  font-size: 12px;
}
</style>
