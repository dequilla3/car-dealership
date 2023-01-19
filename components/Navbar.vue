<template>
  <div>
    <b-navbar class="navbar" fixed="top" toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/dashboard"
        ><font-awesome-icon icon="fa-solid fa-car" /> DMS</b-navbar-brand
      >

      <div class="d-flex flex-row-reverse w-100">
        <b-dropdown id="dropdown-right" right variant="info" class="w-150-px" size="sm">
          <template #button-content
            ><font-awesome-icon icon="fa-solid fa-user" /> {{ userName }}
          </template>
          <hr />
          <b-dropdown-item class="f-s-13" @click="onLogout"
            ><font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
            Logout</b-dropdown-item
          >
        </b-dropdown>
      </div>
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
      this.$router.push({ path: "/" });
    },
  },
  mounted() {
    this.userName = localStorage.userName;
  },
};
</script>

<style scoped>
.navbar.navbar-dark.bg-dark {
  background-color: rgb(88, 88, 88) !important;
}

.w-150-px {
  width: 150px;
}

.w-125-px {
  width: 150px;
}

.f-s-13 {
  font-size: 13px !important;
}
</style>
