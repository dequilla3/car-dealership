<template>
  <div class="dontPrint">
    <b-overlay
      no-wrap
      :show="showOverlay"
      :opacity="1"
      spinner-variant="primary"
      spinner-type="grow"
    ></b-overlay>
    <b-navbar class="navbar bringToBack" fixed="top" toggleable="lg">
      <div class="d-flex flex-row-reverse w">
        <b-dropdown id="dropdown-right" right variant="light" size="sm">
          <template #button-content>
            <b-avatar
              variant="primary"
              :text="userName.charAt(0).toUpperCase()"
              size="1.5rem"
            ></b-avatar>
            <span class="font-12"> {{ userName }}</span>
          </template>
          <hr />
          <b-dropdown-item class="standardFontSize" @click="doLogout()">
            <font-awesome-icon icon="fa-solid fa-arrow-right-from-bracket" />
            Logout
          </b-dropdown-item>
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
      showOverlay: false,
      token: "",
      isLoggedIn: false,
      userName: "",
      isBusy: true,
    };
  },

  methods: {
    doLogout() {
      this.showOverlay = true;
      localStorage.clear();

      setTimeout(() => {
        this.$router.push({ path: "/login" });
      }, 3000);
    },

    async validateUser() {
      try {
        return await this.$store.dispatch("login/getUserById").then((res) => {
          if (res === undefined) {
            this.doLogout();
            return;
          }

          if (res.data != []) {
            this.isBusy = false;
            localStorage.isLoggedIn = true;
            this.isLoggedIn = true;
          } else {
            this.doLogout();
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
  },

  mounted() {
    try {
      if (this.validateLogin) {
        this.showOverlay = true;
        this.doLogout();
      } else {
        this.userName = localStorage.userName;
        this.token = localStorage.token;
        this.validateUser();
      }
    } catch (err) {
      console.log(err);
    }
  },

  computed: {
    getToken() {
      return localStorage.token;
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

<style>
.w {
  width: 100%;
}

@media (max-width: 780px) {
  .w {
    width: 80%;
  }
}
</style>
