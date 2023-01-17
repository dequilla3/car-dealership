<template>
  <div class="manage_user-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage User</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_user">
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
            class="form-manage_user-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="pw" label="Password:" label-for="input-pw">
          <b-form-input
            id="input-pw"
            v-model="form.pw"
            placeholder="Enter password"
            required
            class="form-manage_user-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_user-btn"
          ><font-awesome-icon icon="fa-solid fa-check" /> Submit</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dropDownText: "-- Select Role -- ",
      roleList: [],
      form: {
        username: "",
        pw: "",
        userRole: {
          roleId: "",
          role: "",
        },
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      console, log(JSON.stringify(this.form));
    },

    onClickRoleDropdownMenu(role) {
      this.form.userRole.roleId = role.roleId;
      this.form.userRole.role = role.role;
      this.dropDownText = this.form.userRole.role;
    },

    setRoleList() {
      this.roleList = this.getRoles;
    },
  },

  mounted() {
    this.setRoleList();
  },

  computed: {
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

.manage_user-container {
  margin: 80px 10px 0 280px;
}

.form-manage_user {
  width: 30%;
  font-size: 12px;
}

.form-manage_user-input {
  height: 35px;
  font-size: 12px;
}

.form-manage_user-btn {
  height: 35px;
  width: 150px;
  font-size: 12px;
}

@media (max-width: 800px) {
  .form-manage_user-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_user {
    width: 100%;
  }
}

.dropdown--dropdown_custom-size {
  width: 100%;
  font-size: 12px;
}

.dropdown--dropdown-menu-size {
  font-size: 12px !important;
  width: 300px !important;
}
</style>
