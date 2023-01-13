<template>
  <div class="manage_salesperson-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage Sales Person</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_salesperson">
        <b-form-group id="name" label="Name:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="form.name"
            placeholder="Enter name"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
          <b-form-input
            id="input-contact"
            v-model="form.contact"
            placeholder="Enter contact number"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="address" label="Address:" label-for="input-address">
          <b-form-input
            id="input-address"
            v-model="form.address"
            placeholder="Enter address"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_salesperson-btn">
          <font-awesome-icon icon="fa-solid fa-check" /> {{ btnSubmitLabel }}
        </b-button>

        <b-button
          type="reset"
          variant="danger"
          class="form-manage_salesperson-btn"
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
          class="form-manage_salesperson-input"
        ></b-form-input>
      </b-form-group>

      <b-table
        class="sales_person_list-table"
        hover
        :items="salesPersonList"
        :fields="salesPersonListFields"
        select-mode="single"
        ref="selectableTable"
        selectable
        selected-variant="info"
        @row-selected="onRowSelected"
      >
      </b-table>
    </div>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      inputSearch: "",
      selected: [],
      salesPersonListFields: ["name", "contactNumber", "address", "dateCreated"],
      btnSubmitLabel: "Add new Sales Person",
      salesPersonList: [
        {
          id: 1,
          name: "Kim Ariel Dequilla",
          contactNumber: "09123456789",
          address: "Surallah",
          dateCreated: currentDate,
          // _rowVariant: "info",
        },
        {
          id: 2,
          name: "Mitchell",
          contactNumber: "09123456789",
          address: "Surallah2",
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
        this.btnSubmitLabel = "Update Sales Person";
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.btnSubmitLabel = "Add new Sales Person";
      }
    },
    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Sales Person";
    },
    onSubmit(event) {
      event.preventDefault();
      console.log(JSON.stringify(this.form));
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.manage_salesperson-container {
  margin: 80px 10px 0 280px;
}
.form-manage_salesperson {
  width: 75%;
  font-size: 14px;
}

.form-manage_salesperson-input {
  height: 35px;
  font-size: 13px;
}

.form-manage_salesperson-btn {
  font-size: 13px;
  width: 185px;
  margin-bottom: 10px;
}

@media (max-width: 800px) {
  .form-manage_salesperson-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_salesperson {
    width: 100%;
  }
}

.sales_person_list-table {
  width: 100%;
  font-size: 13px;
}
</style>
