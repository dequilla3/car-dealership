<template>
  <div class="container-login" v-if="!isLoggedIn">
    <div>
      <h3>
        <font-awesome-icon class="loginHeader" icon="fa-solid fa-lock" /> LOU GEH DMS
      </h3>
    </div>

    <hr />
    <br />

    <b-form @submit.prevent="userLogin">
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="username-input"
        class="standardFontSize"
      >
        <b-form-input
          id="username-input"
          v-model="user.username"
          @keyup.enter="userLogin()"
          type="text"
          placeholder="Enter your username"
          required
          class="globalInputSize"
        />
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="pw-input"
        class="standardFontSize"
      >
        <b-input-group>
          <b-form-input
            id="pw-input"
            v-model="user.pw"
            @keyup.enter="userLogin()"
            placeholder="Enter your password"
            required
            autocomplete="none"
            class="globalInputSize"
            :type="isPwShow ? 'text' : 'password'"
          />
          <b-input-group-append>
            <b-button @click="onclickShowPw" class="standardFontSize" variant="info">
              <font-awesome-icon
                :icon="['fa-solid', isPwShow ? 'fa-eye' : 'fa-eye-slash']"
            /></b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <b-button
        class="standardButton btn--color-login"
        id="loginButton"
        type="submit"
        variant="primary"
      >
        <b-spinner small v-if="show" />
        <font-awesome-icon icon="fa-solid fa-right-to-bracket" v-if="!show" />
        Login
      </b-button>

      <div>
        <br />
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      isPwShow: false,
      isLoggedIn: false,
      show: false,
      userList: [], //For mockdata only
      user: {
        username: "",
        pw: "",
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: "The username and / or password is Incorrect",
      },
    };
  },

  methods: {
    onclickShowPw() {
      this.isPwShow = !this.isPwShow;
    },
    async userLogin() {
      this.show = true;
      await this.$store
        .dispatch("login/loginUser", {
          username: this.user.username,
          password: this.user.pw,
        })
        .then(
          (res) => {
            localStorage.userId = res.data.user_id;
            localStorage.userName = `${res.data.name} `;
            localStorage.token = res.data.token;

            this.show = false;
            this.$router.push({ path: "/dashboard" });
          },
          (err) => {
            if (err.response === undefined || err.response.status == "502") {
              this.showAlert("Cannot connect. . .", "warning");
              this.show = false;
              return;
            }

            this.showAlert(err.response.data.error, "danger");
            this.show = false;
          }
        );
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 2,
        variant,
        message,
      };
    },
  },

  mounted() {
    this.isLoggedIn = localStorage.isLoggedIn;

    if (localStorage.loaded === undefined) {
      setTimeout(() => {
        location.reload();
      }, 3000);
      localStorage.loaded = "done";
    }

    if (this.isLoggedIn) {
      this.show = true;
      localStorage.isLoggedIn = true;
      this.$router.push({ path: "/dashboard" });
    } else {
      this.$router.push({ path: "./login" });
    }
  },

  computed: {
    getUsers() {
      return this.$store.state.login.users;
    },
  },
};
</script>

<style scoped>
.container-login {
  width: 500px;
  height: 500px;
  /* background-color: rgb(255, 255, 255); */
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 30px;
  border-style: solid;
  border-width: 0.5px;
  border-color: lightgray;
}

.btn--color-login {
  background-image: linear-gradient(to left, #3b671e, #286a36, #166b4a, #0c6c5a, #196b67);
}
</style>
