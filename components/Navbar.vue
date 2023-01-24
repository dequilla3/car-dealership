<template>
  <div>
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
      userName: "",
    };
  },

  methods: {
    onLogout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    },

    async validateUser() {
      await this.$store.dispatch("login/getUserById");
    },
  },
  mounted() {
    this.validateUser();
    this.userName = localStorage.userName;
  },
};
</script>

<style scoped></style>
