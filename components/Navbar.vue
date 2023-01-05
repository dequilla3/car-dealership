<template>
  <div>
    <b-navbar fixed="top" type="dark" variant="dark">
      <b-navbar-brand href="/dashboard">DMS</b-navbar-brand>
      <b-navbar-nav>
        <!-- Navbar dropdowns -->
        <b-nav-item-dropdown text="User" left>
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item @click="onLogout()" href="./">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
  <!-- <b-navbar fixed="top" toggleable type="dark" variant="dark">
    <b-navbar-brand href="/dashboard">DMS</b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item-dropdown text="User" right>
        <b-dropdown-item href="#">Account</b-dropdown-item>
        <b-dropdown-item href="#">Settings</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar> -->
</template>

<script>
export default {
  name: "Navbar",

  methods: {
    onLogout() {
      localStorage.clear();
    },
  },
};
</script>

<style></style>
