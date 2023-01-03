<template>
    <div class="container-custom">
        <div id="loginHeader">
         <h3>Log In</h3>
        </div>

        <b-form @submit.prevent="userLogin">

        <b-form-group id="input-group-1" label="Username:" label-for="username-input">
            <b-form-input 
            id="username-input"  
            v-model="user.username"
            @keyup.enter="userLogin()"
            type="text" 
            placeholder="Enter your username" 
            required />
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="pw-input">
            <b-form-input 
            id="pw-input"  
            v-model="user.pw"
            @keyup.enter="userLogin()"
            type="password" 
            placeholder="Enter your password" 
            required />
        </b-form-group>

        <b-button id="loginButton" type="submit" pill variant="primary">Login</b-button>

        <div id="alert-login-div">
          <b-alert
            :show="alert.showAlert"
            :variant="alert.variant"
            @dismissed="alert.showAlert = null">
            {{ alert.message }}
          </b-alert
          >
        </div>

        </b-form>

    </div>
</template>

<script>
export default {
  data() {
    return { 
      user:{
        username:"",
        pw:""
      },
      alert: {
        showAlert: 0,
        variant: "success",
        message: "The username and / or password is Incorrect"
      },
      userMockdata:{
        username:"admin",
        pw:"admin"
      }
    }
  },

  methods:{
    userLogin(){
      if(this.user.username == this.userMockdata.username && this.user.pw == this.userMockdata.pw){
        window.localStorage.setItem("user", JSON.stringify(this.user));

        let localStorageUser = JSON.parse(window.localStorage.getItem("user"));
        console.log(localStorageUser.username);
        console.log(localStorageUser.pw)
        this.$router.push({ path: "../dashboard" });
      }else{
        this.showAlert("Failed to Log In!","danger");
        console.log("Failed!");
      }
    },
    showAlert(message, variant) {
      this.alert = {
        showAlert: 2,
        variant,
        message
      };
    }
  },
}
</script>

<style scoped> 
@import url('https://fonts.googleapis.com/css?family=Poppins');
* {
font-family: 'Poppins';
}
.container-custom {
border-radius: 5px;
width: 400px;
height: 400px;
background-color: #f2f2f2;
position: absolute;
top:0;
bottom: 0;
left: 0;
right: 0;
margin: auto;
padding:  25px;
}

#loginHeader{
padding-bottom: 20px;;
}
#loginButton{
width: 100%;
height: 30px;
font-size: 13px;
padding: 0;
margin-bottom: 20px;;
}

#input-group-1{
font-size: 14px;
}

#input-group-2{
font-size: 14px;
}

#username-input{
font-size: 13px;
}

#pw-input{
font-size: 13px;
}

#alert-login-div{
 text-align: center;
}

</style>
