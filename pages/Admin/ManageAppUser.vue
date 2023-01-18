<template>
  <div class="app_user-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage User</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-app_user">
        <div class="row">
          <div class="col-6 col-sm-4">
            <b-form-group id="name" label="Name:" label-for="input-name">
              <b-form-input
                id="input-name"
                v-model="form.name"
                placeholder="Enter name"
                required
                class="form-app_user-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
              <b-form-input
                id="input-contact"
                v-model="form.contact"
                placeholder="Enter contact number"
                required
                class="form-app_user-input"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="address" label="Address:" label-for="input-address">
              <b-form-input
                id="input-address"
                v-model="form.address"
                placeholder="Enter address"
                required
                class="form-app_user-input"
              ></b-form-input>
            </b-form-group>
          </div>

          <div class="col-6 col-sm-4">
            <b-form-group id="username" label="Role:" label-for="input-username">
              <b-dropdown
                id="dropdown-1"
                :text="dropDownText"
                class="dropdown--dropdown_custom-size"
                size="sm"
                @click="setRoleList"
              >
                <b-dropdown-item
                  class="dropdown--dropdown-menu-size"
                  v-for="role in roleList"
                  :key="role.roleId"
                  @click="onClickRoleDropdownMenu(role)"
                  >{{ role.role }}
                </b-dropdown-item>
              </b-dropdown>
            </b-form-group>

            <b-form-group id="username" label="Username:" label-for="input-username">
              <b-form-input
                id="input-username"
                v-model="form.username"
                placeholder="Enter username"
                required
                class="form-custom-input"
                :disabled="isDisabled"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="pw" label="Password:" label-for="input-pw">
              <b-form-input
                id="input-pw"
                v-model="form.pw"
                placeholder="Enter password"
                required
                class="form-custom-input"
                :disabled="isDisabled"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>

        <b-button type="submit" variant="primary" class="form-app_user-btn">
          <font-awesome-icon icon="fa-solid fa-check" /> {{ btnSubmitLabel }}
        </b-button>

        <b-button
          type="reset"
          variant="danger"
          class="form-app_user-btn"
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
          class="form-app_user-input"
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
      dropDownText: "-- Select Role -- ",
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contactNumber", "address", "dateCreated"],
      btnSubmitLabel: "Add new User",
      customerTblList: [],

      form: {
        name: "",
        contact: "",
        address: "",
        username: "",
        pw: "",

        userRole: {
          roleId: "",
          role: "",
        },
      },

      show: true,
      isDisabled: false,
    };
  },

  methods: {
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.name = this.selected[0].name;
        this.form.contact = this.selected[0].contactNumber;
        this.form.address = this.selected[0].address;
        this.btnSubmitLabel = "Update User";
        this.isDisabled = true;
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.btnSubmitLabel = "Add new User";
        this.isDisabled = false;
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

    setRoleList() {
      this.roleList = this.getRoles;
    },

    onClickRoleDropdownMenu(role) {
      this.form.userRole.roleId = role.roleId;
      this.form.userRole.role = role.role;
      this.dropDownText = this.form.userRole.role;
    },
  },

  created() {
    this.customerTblList = this.getCustomerList;
    this.setRoleList();
  },

  computed: {
    rows() {
      return this.customerTblList.length;
    },

    getCustomerList() {
      return this.$store.state.user.userList;
    },

    getRoles() {
      return this.$store.state.role.roles;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.app_user-container {
  margin: 80px 10px 0 280px;
}
.form-app_user {
  width: 75%;
  font-size: 12px;
}

.form-app_user-input {
  height: 35px;
  font-size: 12px;
}

.form-app_user-btn {
  font-size: 12px;
  width: 180px;
  margin-bottom: 10px;
}

@media (max-width: 800px) {
  .form-app_user-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-app_user {
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

.dropdown--dropdown_custom-size {
  width: 100%;
  font-size: 12px !important;
}
.dropdown--dropdown-menu-size {
  font-size: 12px !important;
  width: 300px !important;
}
.form-custom-input {
  height: 35px;
  font-size: 12px;
}
</style>
