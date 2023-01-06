<template>
  <div class="manage_salesperson-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage Sales Person</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_salesperson">
        <b-form-group id="name" label="Name:" label-for="input-name">
          <b-form-input
            id="input-name"
            v-model="form.name"
            placeholder="Enter name"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="contact" label="Cotanct Number:" label-for="input-contact">
          <b-form-input
            id="input-contact"
            v-model="form.contact"
            placeholder="Enter contact number"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-form-group id="address" label="Address:" label-for="input-address">
          <b-form-input
            id="input-address"
            v-model="form.address"
            placeholder="Enter address"
            required
            class="form-manage_salesperson-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_salesperson-btn"
          >Submit</b-button
        >
      </b-form>
      <b-table striped hover :items="items"></b-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { age: 21, first_name: "Larsen", last_name: "Shaw" },
        { age: 89, first_name: "Geneva", last_name: "Wilson" },
        { age: 38, first_name: "Jami", last_name: "Carney" },
      ],
      form: {
        name: "",
        contact: "",
        address: "",
      },

      salesPersons: {
        name: "Kim",
        contact: "243213123",
        address: "Zone 1, Surallah, South Cot.",
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

.form-manage_salesperson {
  width: 50%;
  font-size: 14px;
}

.form-manage_salesperson-input {
  height: 35px;
  font-size: 13px;
}

.form-manage_salesperson-btn {
  height: 35px;
  font-size: 13px;
}

@media (max-width: 800px) {
  .form-manage_salesperson-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_salesperson {
    width: 100%;
  }
}

.manage_salesperson-container {
  margin: 70px 10px 0 230px;
}
</style>
