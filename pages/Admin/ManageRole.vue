<template>
  <div class="mainContainer">
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
            class="globalInputSize"
          ></b-form-input>
        </b-form-group>

        <b-button type="submit" variant="primary" class="form-manage_role-btn">
          <font-awesome-icon
            :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-user-plus']"
          />
          {{ btnSubmitLabel }}
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
          class="globalInputSize"
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
      isUpdate: false,
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
        this.isUpdate = true;
      } else {
        this.btnSubmitLabel = "Add New Role";
        this.form.role = "";
        this.isUpdate = false;
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
.form-manage_role {
  width: 30%;
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
