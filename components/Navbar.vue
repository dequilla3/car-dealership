<template>
  <div>
    <b-overlay no-wrap :show="isBusy && !isLoggedIn" opacity="1" />
    <b-navbar class="navbar" fixed="top" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/dashboard"
        ><font-awesome-icon icon="fa-solid fa-car" /> DMS</b-navbar-brand
      >
      <div class="d-flex flex-row-reverse w-100">
        <b-dropdown id="dropdown-right" right variant="info" size="sm">
          <template #button-content
            ><font-awesome-icon icon="fa-solid fa-user" /> {{ userName }}
          </template>
          <hr />
          <b-dropdown-item class="standardFontSize" @click="onLogout"
            ><font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
            Logout</b-dropdown-item
          >
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
      });
    },
  },
  mounted() {
    if (this.validateLogin) {
      this.onLogout();
    }

    this.userName = localStorage.userName;
    this.validateUser();
  },

  computed: {
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
