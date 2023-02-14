<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <transition name="slide-fade">
      <div v-show="showDelay">
        <div><h6>Manage User</h6></div>
        <hr />

        <div class="font-13">
          <b-alert
            :show="alert.showAlert"
            :variant="alert.variant"
            @dismissed="alert.showAlert = null"
          >
            {{ alert.message }}
          </b-alert>

          <base-button @click="onAdd()" type="primary" class="font-12 mb-3">
            <font-awesome-icon icon="fa-solid fa-user-plus" /> Add new User
          </base-button>

          <b-modal id="userModal" size="lg" hide-footer hide-header>
            <b-form @submit="onSubmit" v-if="show" class="form-100">
              <b-alert
                :show="alertModal.showAlert"
                :variant="alertModal.variant"
                @dismissed="alertModal.showAlert = null"
              >
                {{ alert.message }}
              </b-alert>
              <h6>User Details</h6>
              <hr />
              <div class="row">
                <div class="col-6 col-sm-6">
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
                </div>

                <div class="col-6 col-sm-6">
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

                  <b-form-group
                    id="username"
                    label="Username:"
                    label-for="input-username"
                  >
                    <b-form-input
                      id="input-username"
                      v-model="form.username"
                      placeholder="Enter username"
                      required
                      class="globalInputSize"
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
                        :type="isPwShow ? 'text' : 'password'"
                      ></b-form-input>
                      <b-input-group-append>
                        <base-button
                          type="info"
                          class="globalInputSize"
                          @click="onlickShowPw"
                        >
                          <font-awesome-icon
                            :icon="['fa-solid', isPwShow ? 'fa-eye' : 'fa-eye-slash']"
                          />
                        </base-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </div>
              </div>

              <b-button type="submit" variant="primary" class="font-12">
                <font-awesome-icon :icon="['fa-solid', icn]" />
                {{ isUpdate ? "Update User" : "Add User" }}
              </b-button>

              <b-button type="reset" variant="danger" class="font-12" @click="onReset">
                <font-awesome-icon icon="fa-solid fa-close" /> Cancel
              </b-button>
            </b-form>
          </b-modal>

          <br />

          <!-- search input -->
          <b-form-group id="inputSearch" label="" label-for="input-search">
            <b-form-input
              id="input-search "
              v-model="inputSearch"
              placeholder="Search . . ."
              class="globalInputSize"
              @keyup.enter="onSearch"
            ></b-form-input>
          </b-form-group>

          <b-table
            class="standardTable"
            hover
            :items="userTblList"
            :fields="userTblFields"
            :per-page="perPage"
            :current-page="currentPage"
          >
            <template #cell(date_created)="data">
              {{ new Date(data.value).toJSON().slice(0, 10) }}
            </template>

            <template #cell(action)="data">
              <base-button size="sm" class="font-10" type="info" @click="onEdit(data)">
                <font-awesome-icon icon="fa-solid fa-user-pen" /> Update</base-button
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
import axios from "axios";

const currentDate = new Date().toJSON().slice(0, 10);

export default {
  data() {
    return {
      showDelay: false,
      isUpdate: false,
      isPwShow: false,
      icn: "fa-user-plus",
      dropDownText: "-- Select Role -- ",
      inputSearch: "",
      perPage: 5,
      currentPage: 1,
      selected: [],
      userTblList: [],
      userTblFields: [
        { key: "name", label: "Name", thStyle: { width: "20%" } },
        { key: "contact_number", label: "Contact Number", thStyle: { width: "10%" } },
        { key: "address", label: "Address", thStyle: { width: "15%" } },
        { key: "date_created", label: "Date Created", thStyle: { width: "10%" } },
        { key: "action", label: "Update", thStyle: { width: "10%" } },
      ],

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

      alertModal: {
        showAlert: 0,
        variant: "",
        message: "",
      },
    };
  },

  methods: {
    showConfirmationDialog() {
      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to ${this.isUpdate ? "UPDATE" : "ADD"} User?`
        )
        .then((value) => {
          return value === null ? false : value;
        })
        .catch((err) => {
          // An error occurred
          return false;
        });
    },

    onAdd() {
      this.onReset();
      this.$bvModal.show("userModal");
      this.isUpdate = false;
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
    onEdit(data) {
      this.$bvModal.show("userModal");
      this.selected = data.item;

      if (this.selected !== undefined) {
        this.form.name = this.selected.name;
        this.form.contact = this.selected.contact_number;
        this.form.address = this.selected.address;
        this.form.username = this.selected.username;
        this.form.pw = "";
        this.icn = "fa-user-pen";

        this.isDisabled = true;
        this.isUpdate = true;

        this.roleList.forEach((val) => {
          if (val.user_role_id === this.selected.user_role_id) {
            this.form.userRole.roleId = val.user_role_id;
            this.form.userRole.role = val.role;
            this.dropDownText = val.role;
          }
        });

        return;
      }

      this.onReset();
    },

    onReset() {
      this.$bvModal.hide("userModal");

      this.form.name = "";
      this.form.contact = "";
      this.form.address = "";
      this.form.username = "";
      this.form.pw = "";
      this.icn = "fa-user-plus";

      this.isDisabled = false;
      this.isPwShow = false;
      this.isUpdate = false;

      this.form.userRole.roleId = "";
      this.form.userRole.role = "";
      this.dropDownText = "-- Select Role -- ";
    },

    async onSearch() {
      await this.loadUser().then((res) => {
        let textSearch = this.inputSearch;
        var filteredList = this.userTblList.filter(function (val) {
          return (
            val.name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.address.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.contact_number.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.userTblList = filteredList;
      });
    },

    async onSubmit(event) {
      event.preventDefault();

      this.$bvModal
        .msgBoxConfirm(
          `Are you sure you want to ${this.isUpdate ? "UPDATE" : "ADD"} User?`
        )
        .then((value) => {
          let proceed = value === null ? false : value;
          if (proceed) {
            if (this.form.userRole.roleId === "") {
              this.showAlertModal(3, "warning", "Please select role");
              return;
            }

            if (this.isUpdate) {
              this.editUser();
            } else {
              this.addUser();
            }
          }
        })
        .catch((err) => {
          // An error occurred
          return false;
        });
    },

    async addUser() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/create-user`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
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

    async editUser() {
      await axios({
        method: "PATCH",
        url: `${this.$axios.defaults.baseURL}/user/edit/${this.selected.user_id}`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
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
          this.showAlert(3, "success", "Successfully updated user!");
          this.loadRoles();
          this.loadUser();
          this.onReset();
        },
        (err) => {
          console.log(err.response);
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
      return await this.$store
        .dispatch("user/loadUsers", {
          token: localStorage.token,
        })
        .then((res) => {
          this.userTblList = this.getUserList;
          this.isBusy = false;
          return res;
        });
    },
  },

  mounted() {
    this.loadRoles();
    this.loadUser();
    setTimeout(() => {
      this.showDelay = true;
    }, 1);
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
.dropdown--dropdown_custom-size {
  width: 100%;
  font-size: 12px !important;
}
.dropdown--dropdown-menu-size {
  font-size: 12px !important;
  width: 300px !important;
}
</style>
