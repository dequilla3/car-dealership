<template>
  <div class="dontPrint">
    <b-overlay
      no-wrap
      :show="isBusy && !isLoggedIn"
      :opacity="this.token === undefined ? 1 : 0.33"
    />
    <b-navbar class="navbar" fixed="top" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/dashboard"
        ><font-awesome-icon icon="fa-solid fa-car" /> DMS</b-navbar-brand
      >
      <div class="d-flex flex-row-reverse w-100">
        <b-dropdown id="dropdown-right" right variant="info" size="sm">
          <template #button-content>
            <font-awesome-icon icon="fa-solid fa-user" />
            <span class="font-12"> {{ userName }}</span>
          </template>
          <hr />
          <b-dropdown-item class="standardFontSize" @click="onLogout">
            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
            Logout
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-navbar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Navbar",
  data() {
    return {
      token: "",
      isLoggedIn: false,
      userName: "",
      isBusy: true,
    };
  },

  methods: {
    onLogout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    },

    async validateUser() {
      try {
        return await this.$store.dispatch("login/getUserById").then((res) => {
          if (res === undefined) {
            this.onLogout();
            return;
          }

          if (res.data != []) {
            this.isBusy = false;
            localStorage.isLoggedIn = true;
            this.isLoggedIn = true;
          } else {
            localStorage.clear();
            this.$router.push({ path: "/" });
          }

          this.loadRoles();
        });
      } catch (err) {
        console.log(err);
      }
    },

    async loadRoles() {
      await this.$store
        .dispatch("role/loadRoles", { token: localStorage.token })
        .then((res) => {
          localStorage.userRole = this.getUserRole;
        });
    },
  },
  mounted() {
    if (this.validateLogin) {
      this.onLogout();
    }

    this.userName = localStorage.userName;
    this.token = localStorage.token;
    this.validateUser();
  },

  computed: {
    getUser() {
      return this.$store.state.login.user;
    },

    getRoles() {
      return this.$store.state.role.roles;
    },
    getUserRole() {
      let users = this.getUser;
      let roles = this.getRoles;
      let role = "";
      users.forEach(function (valUser) {
        roles.forEach(function (valRole) {
          if (valUser.user_role_id === valRole.user_role_id) {
            role = valRole.role;
          }
        });
      });
      return role;
    },
    validateLogin() {
      return (
        localStorage.userId === undefined ||
        localStorage.userName === undefined ||
        localStorage.token === undefined
      );
    },
  },
};
</script>

<style scoped></style>
