<template>
  <div class="manage_user-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage User</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_user">
        <b-form-group id="username" label="Username:" label-for="input-username">
          <b-form-input
            id="input-username"
            v-model="form.username"
            placeholder="Enter username"
            required
            class="form-manage_user-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="pw" label="Password:" label-for="input-pw">
          <b-form-input
            id="input-pw"
            v-model="form.pw"
            placeholder="Enter password"
            required
            class="form-manage_user-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_user-btn"
          >Submit</b-button
        >
      </b-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        pw: "",
      },
      show: true,
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      console, log(JSON.stringify(this.form));
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}

.manage_user-container {
  margin: 80px 10px 0 280px;
}

.form-manage_user {
  width: 50%;
  font-size: 14px;
}

.form-manage_user-input {
  height: 35px;
  font-size: 13px;
}

.form-manage_user-btn {
  height: 35px;
  font-size: 13px;
}

@media (max-width: 800px) {
  .form-manage_user-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_user {
    width: 100%;
  }
}
</style>
