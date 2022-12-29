<template>
    <div class="container-custom">
        <div id="loginHeader">
         <h3>Log In</h3>
        </div>

        <form @submit.prevent="userLogin">
        <b-form-group id="input-group-1" label="Username:" label-for="input-1">
            <b-form-input id="input-1"  v-model="form.username" type="text" placeholder="Enter your username" required></b-form-input >
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="input-2">
            <b-form-input id="input-2"  v-model="form.password" type="password" placeholder="Enter your password" required></b-form-input >
        </b-form-group>

            <b-button id="loginButton" type="submit" pill variant="primary">Login</b-button>
        </form>
    </div>
</template>

<script>
export default {
  name: 'Login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
      }
    },

    methods:{
      
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
padding:  10px;
}

#loginHeader{
padding-bottom: 20px;;
}
#loginButton{
width: 100%;
height: 30px;
font-size: 14px;
padding: 0;
}

#input-group-1{
font-size: 14px;
}

#input-group-2{
font-size: 14px;
}

#input-1{
font-size: 14px;
}

#input-2{
font-size: 14px;
}

</style>
