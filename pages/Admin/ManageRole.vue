<template>
  <div class="manage_role-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage Role</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" v-if="show" class="form-manage_role">
        <b-form-group id="role" label="Role name:" label-for="input-role">
          <b-form-input
            id="input-role"
            v-model="form.role"
            placeholder="Enter role"
            required
            class="form-manage_role-input"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_role-btn">
          <font-awesome-icon icon="fa-solid fa-check" /> {{ btnSubmitLabel }}
        </b-button>

        <b-button
          type="reset"
          variant="danger"
          class="form-manage_role-btn"
          @click="onReset"
        >
          <font-awesome-icon icon="fa-solid fa-redo" /> Reset
        </b-button>
      </b-form>

      <br />

      <!-- search input -->
      <b-form-group id="inputSearch" label="Search:" label-for="input-search">
        <b-form-input
          id="input-search"
          v-model="inputSearch"
          placeholder="Enter text . . ."
          class="form-manage_role-input"
        ></b-form-input>
      </b-form-group>

      <b-table
        class="customer_list-table"
        hover
        :items="roleList"
        :fields="roleTblFields"
        :per-page="perPage"
        :current-page="currentPage"
        select-mode="single"
        ref="selectableTable"
        selectable
        selected-variant="info"
        @row-selected="onRowSelected"
      >
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="rows"
        :per-page="perPage"
        aria-controls="my-table"
        class="pagination"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      roleTblFields: ["role"],
      roleList: [],
      btnSubmitLabel: "Add new Role",

      form: {
        role: "",
      },

      show: true,
    };
  },

  methods: {
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length > 0) {
        this.form.role = this.selected[0].role;
        this.btnSubmitLabel = "Update Role";
      } else {
        this.form.role = "";
      }
    },
    onReset() {
      this.$refs.selectableTable.clearSelected();
      this.form.role = "";
      this.btnSubmitLabel = "Add new Role";
    },
    onSubmit(event) {
      event.preventDefault();
      console.log(JSON.stringify(this.form));
    },
  },

  mounted() {
    this.roleList = this.getRoleList;
  },

  computed: {
    getRoleList() {
      return this.$store.state.role.roles;
    },
    rows() {
      return this.roleList === undefined ? 0 : this.roleList.length;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.manage_role-container {
  margin: 80px 10px 0 280px;
}
.form-manage_role {
  width: 30%;
  font-size: 12px;
}

.form-manage_role-input {
  height: 35px;
  font-size: 12px;
}

.form-manage_role-btn {
  font-size: 12px;
  width: 130px;
  margin-bottom: 10px;
}

@media (max-width: 800px) {
  .form-manage_role-btn {
    width: 100%;
  }
}

@media (max-width: 800px) {
  .form-manage_role {
    width: 100%;
  }
}

.customer_list-table {
  width: 100%;
  font-size: 12px;
}

.pagination {
  font-size: 12px;
}
</style>
