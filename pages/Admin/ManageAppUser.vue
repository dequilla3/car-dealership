<template>
  <div class="mainContainer">
    <b-overlay :show="isBusy" rounded="sm" variant="light" opacity="0.30" no-wrap />
    <Navbar />
    <SideBar />
    <div><h6>Manage User</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-app_user">
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
        <div class="row">
          <div class="col-6 col-sm-4">
            <b-form-group id="name" label="Name:" label-for="input-name">
              <b-form-input
                id="input-name"
                v-model="form.name"
                placeholder="Enter name"
                required
                class="globalInputSize"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
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
          </div>

          <div class="col-6 col-sm-4">
            <b-form-group id="username" label="Role:" label-for="input-username">
              <b-dropdown
                id="dropdown-1"
                :text="dropDownText"
                class="dropdown--dropdown_custom-size"
                size="sm"
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
                class="globalInputSize"
                :disabled="isDisabled"
              ></b-form-input>
            </b-form-group>

            <b-form-group id="pw" label="Password:" label-for="input-pw">
              <b-input-group>
                <b-form-input
                  id="input-pw"
                  v-model="form.pw"
                  placeholder="Enter password"
                  required
                  class="globalInputSize"
                  :disabled="isDisabled"
                  :type="isPwShow ? 'text' : 'password'"
                ></b-form-input>
                <b-input-group-append>
                  <b-button variant="info" class="globalInputSize" @click="onlickShowPw">
                    <font-awesome-icon
                      :icon="['fa-solid', isPwShow ? 'fa-eye' : 'fa-eye-slash']"
                    />
                  </b-button>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>
        </div>

        <b-button type="submit" variant="primary" class="form-app_user-btn">
          <font-awesome-icon :icon="['fa-solid', icn]" /> {{ btnSubmitLabel }}
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
          class="globalInputSize"
        ></b-form-input>
      </b-form-group>

      <b-table
        class="customer_list-table"
        hover
        :items="userTblList"
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
import axios from "axios";

const currentDate = new Date().toJSON().slice(0, 10);

export default {
  data() {
    return {
      isUpdate: false,
      isPwShow: false,
      icn: "fa-user-plus",
      dropDownText: "-- Select Role -- ",
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      customerTblFields: ["name", "contact_number", "address", "date_created"],
      btnSubmitLabel: "Add new User",
      userTblList: [],
      roleList: [],

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
      isBusy: false,

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
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
        this.form.name = this.selected[0].name;
        this.form.contact = this.selected[0].contact_number;
        this.form.address = this.selected[0].address;
        this.form.username = "N/A";
        this.form.pw = "N/A";
        this.btnSubmitLabel = "Update User";
        this.icn = "fa-user-pen";

        this.isDisabled = true;
        this.isPwShow = true;
        this.isUpdate = true;

        this.roleList.forEach((val) => {
          if (val.user_role_id === this.selected[0].user_role_id) {
            this.form.userRole.roleId = val.user_role_id;
            this.form.userRole.role = val.role;
            this.dropDownText = val.role;
          }
        });
      } else {
        this.form.name = "";
        this.form.contact = "";
        this.form.address = "";
        this.form.username = "";
        this.form.pw = "";
        this.btnSubmitLabel = "Add new User";
        this.icn = "fa-user-plus";

        this.isDisabled = false;
        this.isPwShow = false;
        this.isUpdate = false;

        this.form.userRole.roleId = "";
        this.form.userRole.role = "";
        this.dropDownText = "-- Select Role -- ";
      }
    },

    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.btnSubmitLabel = "Add new Customer";
    },

    async onSubmit(event) {
      event.preventDefault();

      if (this.form.userRole.roleId === "") {
        this.showAlert(3, "warning", "Please select role");
        return;
      }

      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-user`,
        data: {
          name: this.form.name,
          contact_number: this.form.contact,
          address: this.form.address,
          username: this.form.username,
          password: this.form.pw,
          user_role_id: this.form.userRole.roleId,
        },
      }).then(
        (res) => {
          let existingUserCount = res.data.user === undefined ? 0 : res.data.user.length;
          if (existingUserCount > 0) {
            this.showAlert(3, "warning", `${res.data.msg}`);
            return;
          }
          this.showAlert(3, "success", "Successfully added new user!");
          this.loadRoles();
          this.loadUser();
          this.onReset();
        },
        (err) => {
          this.showAlert(3, "warning", `${err.response.data.error}`);
        }
      );
    },

    onlickShowPw() {
      this.isPwShow = !this.isPwShow;
    },

    onClickRoleDropdownMenu(role) {
      this.form.userRole.roleId = role.user_role_id;
      this.form.userRole.role = role.role;
      this.dropDownText = this.form.userRole.role;
    },

    //LOAD DATA FROM API
    async loadRoles() {
      this.isBusy = true;
      await this.$store
        .dispatch("role/loadRoles", { token: localStorage.token })
        .then((res) => {
          this.roleList = this.getRoles;
          this.isBusy = false;
        });
    },

    async loadUser() {
      this.isBusy = true;
      await this.$store
        .dispatch("user/loadUsers", {
          token: localStorage.token,
        })
        .then((res) => {
          this.userTblList = this.getUserList;
          this.isBusy = false;
        });
    },
  },

  mounted() {
    this.loadRoles();
    this.loadUser();
  },

  computed: {
    rows() {
      return this.userTblList.length;
    },

    getUserList() {
      return this.$store.state.user.userList;
    },

    getRoles() {
      return this.$store.state.role.roles;
    },

    getExistingUser() {
      return this.$store.state.user.existUser;
    },
  },
};
</script>

<style scoped>
.form-app_user {
  width: 75%;
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

.dropdown--dropdown_custom-size {
  width: 100%;
  font-size: 12px !important;
}
.dropdown--dropdown-menu-size {
  font-size: 12px !important;
  width: 300px !important;
}
</style>
