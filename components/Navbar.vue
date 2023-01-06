<template>
  <div>
    <b-navbar fixed="top" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#">DMS</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template #button-content>
              {{ userName }}
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="onLogout()">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
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
      this.$router.push({ path: "./" });
    },
  },
  mounted() {
    this.userName = localStorage.userName;
  },
};
</script>

<style></style>
