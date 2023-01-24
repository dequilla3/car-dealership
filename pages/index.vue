<template>
  <div class="container-login" v-if="!isLoggedIn">
    <div id="loginHeader">
      <h3><font-awesome-icon icon="fa-solid fa-lock" /> Lou Geh DMS</h3>
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

      <b-button class="standardButton" id="loginButton" type="submit" variant="primary">
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
            localStorage.isLoggedIn = true;
            localStorage.userId = res.data.user_id;
            localStorage.userName = `${res.data.name} (${res.data.username})`;
            localStorage.token = res.data.token;

            this.show = false;
            this.$router.push({ path: "/dashboard" });
          },
          (err) => {
            if (err.response === undefined) {
              this.showAlert("Not Connected!", "danger");
              this.show = false;
            } else {
              this.showAlert(err.response.data.error, "danger");
            }
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

    async validateUser() {
      await this.$store.dispatch("login/getUserById");
    },
  },

  mounted() {
    this.isLoggedIn = localStorage.isLoggedIn;
    if (this.isLoggedIn) {
      this.show = true;
      setTimeout(() => {
        this.$router.push({ path: "/dashboard" });
      }, 3000);
    } else {
      this.$router.push({ path: "./" });
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
/* @import url("@fontsource/poppins");
* {
  font-family: "Poppins";
} */
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
</style>
