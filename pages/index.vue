<template>
  <div class="container-custom" v-if="!isLoggedIn">
    <div id="loginHeader">
      <h3><font-awesome-icon icon="fa-solid fa-lock" /> Log In</h3>
    </div>

    <b-form @submit.prevent="userLogin">
      <b-form-group id="input-group-1" label="Username:" label-for="username-input">
        <b-form-input
          id="username-input"
          v-model="user.username"
          @keyup.enter="userLogin()"
          type="text"
          placeholder="Enter your username"
          required
        />
      </b-form-group>

      <b-form-group id="input-group-2" label="Password:" label-for="pw-input">
        <b-form-input
          id="pw-input"
          v-model="user.pw"
          @keyup.enter="userLogin()"
          type="password"
          placeholder="Enter your password"
          required
          autocomplete="off"
        />
      </b-form-group>

      <b-button id="loginButton" type="submit" variant="primary">Login</b-button>

      <div id="alert-login-div">
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
      isLoggedIn: false,
      user: {
        username: "",
        pw: "",
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: "The username and / or password is Incorrect",
      },
      userMockdatas: [
        {
          id: 1,
          username: "admin",
          pw: "admin",
        },
        {
          id: 2,
          username: "useradmin",
          pw: "12345",
        },
      ],
    };
  },
  mounted() {
    this.isLoggedIn = localStorage.isLoggedIn;
    if (this.isLoggedIn) {
      this.$router.push({ path: "/dashboard" });
    } else {
      this.$router.push({ path: "./" });
    }
  },

  created() {},

  methods: {
    userLogin() {
      var userName = this.user.username;
      var passWord = this.user.pw;
      var isUserFound = false;

      //iterate user list
      this.userMockdatas.forEach(function (el) {
        if (userName === el.username && passWord === el.pw) {
          //user found
          isUserFound = true;
        }
      });

      //proceed to dashboard if true
      if (isUserFound) {
        localStorage.isLoggedIn = true;
        localStorage.userName = userName;
        localStorage.activeMenuId = "dashboard";
        this.$router.push({ path: "/dashboard" });
      } else {
        this.showAlert("Failed to Log In!", "danger");
      }
    },

    showAlert(message, variant) {
      this.alert = {
        showAlert: 2,
        variant,
        message,
      };
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.container-custom {
  border-radius: 5px;
  width: 400px;
  height: 400px;
  background-color: lightgray;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  padding: 25px;
}

#loginHeader {
  padding-bottom: 20px;
}
#loginButton {
  width: 100%;
  font-size: 13px;
  margin-bottom: 20px;
}

#input-group-1 {
  font-size: 14px;
}

#input-group-2 {
  font-size: 14px;
}

#username-input {
  font-size: 13px;
}

#pw-input {
  font-size: 13px;
}

#alert-login-div {
  text-align: center;
}

.h-icon {
  height: 100%;
  width: 16%;
}
</style>
