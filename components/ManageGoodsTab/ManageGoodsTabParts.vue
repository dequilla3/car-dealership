<template>
  <div>
    <Navbar />
    <SideBar />
    <div>
      <b-alert
        :show="alert.showAlert"
        :variant="alert.variant"
        @dismissed="alert.showAlert = null"
        class="font-13"
      >
        {{ alert.message }}
      </b-alert>

      <!-- parts details modal -->
      <b-modal id="managePartsModal" hide-header hide-footer size="lg">
        <b-form @submit="onSubmit" v-if="show" class="form-100">
          <b-alert
            :show="alertModal.showAlert"
            :variant="alertModal.variant"
            @dismissed="alertModal.showAlert = null"
          >
            {{ alert.message }}
          </b-alert>

          <h6>Parts Details</h6>
          <hr />

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
          </div>
          <!-- END OF GRID -->

          <!-- Buttom submit -->
          <b-button type="submit" variant="primary" class="font-12">
            <font-awesome-icon
              :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-plus']"
            />
            {{ btnSubmitLabel }}
          </b-button>

          <!-- Button cancel -->
          <b-button type="reset" variant="danger" class="font-12" @click="onReset">
            <font-awesome-icon icon="fa-solid fa-close" /> Cancel
          </b-button>
        </b-form>
      </b-modal>
      <!-- modal ends here... -->

      <!-- on add button -->
      <b-button variant="primary" class="font-12 mb-3" @click="onAdd">
        <font-awesome-icon icon="fa-solid fa-plus" />
        Add Parts
      </b-button>

      <br />

      <!-- search input -->
      <b-form-group id="inputSearch" label="" label-for="input-search">
        <b-form-input
          id="input-search"
          v-model="inputSearch"
          placeholder="Enter text . . ."
          class="globalInputSize"
          @keyup.enter="onSearch"
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
      >
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
        class="pagination"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      // alert outside modal
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },

      // alert inside modal
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
      tblList: [],
      partsTblFields: ["barcode", "printname", "unit", "cost", "action"],
      btnSubmitLabel: "Add new Parts",

      form: {
        barcode: "",
        printname: "",
        unit: "",
        cost: "",
        qty: "",
      },

      show: true,
      isUpdate: false,
    };
  },
  methods: {
    onAdd() {
      this.$bvModal.show("managePartsModal");
      this.onReset();
    },

    onEdit(data) {
      this.selected = data.item;
      this.$bvModal.show("managePartsModal");
      this.form.barcode = this.selected.barcode;
      this.form.printname = this.selected.printname;
      this.form.unit = this.selected.unit;
      this.form.cost = this.selected.cost;
      this.btnSubmitLabel = "Update Parts";
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

    // request parts then filter based on input search text
    async onSearch() {
      await this.loadParts().then((res) => {
        let textSearch = this.inputSearch;
        var filteredList = this.tblList.filter(function (val) {
          return (
            val.printname.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.barcode.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.unit.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.tblList = filteredList;
      });
    },

    onReset() {
      this.$bvModal.hide("managePartsModal");
      this.form.barcode = "";
      this.form.printname = "";
      this.form.unit = "";
      this.form.cost = "";
      this.btnSubmitLabel = "Add new Parts";
      this.isUpdate = false;
    },

    // if update edit parts else add parts
    onSubmit(event) {
      event.preventDefault();
      if (this.isUpdate) {
        this.editParts();
      } else {
        this.addParts();
      }
    },

    async addParts() {
      await this.$store
        .dispatch("goods/addParts", {
          token: localStorage.token,
          unit: this.form.unit,
          cost: this.form.cost,
          barcode: this.form.barcode,
          printname: this.form.printname,
        })
        .then((res) => {
          this.showAlert(3, "success", "Successfully added new parts!");
          this.loadParts();
          this.onReset();
        });
    },

    async editParts() {
      await axios({
        method: "PATCH",
        url: `${this.$axios.defaults.baseURL}/part/edit/${this.selected.product_parts_id}`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
        data: {
          unit: this.form.unit,
          cost: this.form.cost,
          barcode: this.form.barcode,
          printname: this.form.printname,
        },
      }).then(
        (res) => {
          if (this.hasChanges) {
            this.showAlertModal(3, "warning", "Changes not found!");
            return;
          }
          this.showAlert(3, "info", "Successfully updated selected parts!");
          this.loadParts();
          this.onReset();
        },
        (err) => {
          this.showAlert(3, "warning", err.response.data.error);
        }
      );
    },

    async loadParts() {
      await this.$store
        .dispatch("goods/loadParts", { token: localStorage.token })
        .then((res) => {
          this.tblList = this.getPartList;
        });
    },
  },

  mounted() {
    this.loadParts();
  },

  computed: {
    hasChanges() {
      return (
        this.selected.unit == this.form.unit &&
        this.selected.cost == this.form.cost &&
        this.selected.barcode == this.form.barcode &&
        this.selected.printname == this.form.printname
      );
    },

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
