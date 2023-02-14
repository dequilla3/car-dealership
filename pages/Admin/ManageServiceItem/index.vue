<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <transition name="slide-fade">
      <div v-show="showDelay">
        <div><h6>Manage Service Items</h6></div>
        <hr />
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
          class="font-12"
        >
          {{ alert.message }} <br />
          {{ alert.subMsg }}
        </b-alert>
        <div>
          <b-button variant="primary" class="font-12 mb-3" @click="onAdd">
            <font-awesome-icon icon="fa-solid fa-user-plus" />
            Add Service Item
          </b-button>

          <b-modal id="manageServiceItemModal" hide-footer hide-header size="lg">
            <b-form @submit="onSubmit" v-if="show" class="form-100">
              <b-alert
                :show="alertModal.showAlert"
                :variant="alertModal.variant"
                @dismissed="alertModal.showAlert = null"
              >
                {{ alert.message }} <br />
                {{ alert.subMsg }}
              </b-alert>

              <h6>Service Items Details</h6>
              <hr />

              <b-form-group
                id="service_name"
                label="Service Item:"
                label-for="input-service_name"
              >
                <b-form-input
                  id="input-service_name"
                  v-model="form.service_name"
                  placeholder="Enter service item name"
                  required
                  class="globalInputSize"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="unit" label="Unit:" label-for="input-unit">
                <b-form-input
                  id="input-unit"
                  v-model="form.unit"
                  placeholder="Enter unit"
                  required
                  class="globalInputSize"
                ></b-form-input>
              </b-form-group>

              <b-form-group id="cost" label="Cost:" label-for="input-cost">
                <b-form-input
                  id="input-cost"
                  type="number"
                  v-model="form.cost"
                  placeholder="Enter cost"
                  required
                  class="globalInputSize"
                ></b-form-input>
              </b-form-group>

              <b-button type="submit" variant="primary" class="font-12">
                <font-awesome-icon
                  :icon="['fa-solid', isUpdate ? 'fa-user-pen' : 'fa-user-plus']"
                />
                {{ btnSubmitLabel }}
              </b-button>

              <b-button type="reset" variant="danger" class="font-12" @click="onReset">
                <font-awesome-icon icon="fa-solid fa-close" /> Cancel
              </b-button>
            </b-form></b-modal
          >

          <br />

          <!-- search input -->
          <b-form-group id="inputSearch" label="" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="inputSearch"
              placeholder="Search . . ."
              class="globalInputSize"
              @keyup.enter="onSearch"
            ></b-form-input>
          </b-form-group>

          <b-table
            class="standardTable"
            hover
            :items="serviceTblList"
            :fields="serviceTblFields"
            :per-page="perPage"
            :current-page="currentPage"
            select-mode="single"
          >
            <template #cell(date_created)="data">
              {{ new Date(data.value).toJSON().slice(0, 10) }}
            </template>

            <template #cell(action)="data">
              <base-button size="sm" class="font-10" type="info" @click="onEdit(data)">
                <font-awesome-icon icon="fa-solid fa-user-pen" /> Update</base-button
              >
            </template>
          </b-table>

          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            class="paginationSmall"
          ></b-pagination>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      showDelay: false,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
        subMsg: "",
      },
      alertModal: {
        showAlert: 0,
        variant: "",
        message: "",
        subMsg: "",
      },
      isUpdate: false,
      inputSearch: "",
      perPage: 3,
      currentPage: 1,
      selected: [],
      serviceTblList: [],
      serviceTblFields: ["service_name", "unit", "cost", "date_created", "action"],
      btnSubmitLabel: "Add New Service Item",

      form: {
        service_name: "",
        unit: "",
        cost: "",
        dateCreated: "",
      },

      show: true,
    };
  },
  methods: {
    onAdd() {
      this.$bvModal.show("manageServiceItemModal");
      this.onReset();
    },

    onEdit(data) {
      this.$bvModal.show("manageServiceItemModal");

      this.selected = data.item;
      this.form.service_name = this.selected.service_name;
      this.form.unit = this.selected.unit;
      this.form.cost = this.selected.cost;
      this.btnSubmitLabel = "Update Service Item";
      this.isUpdate = true;
    },

    showAlert(dissmiss, warning, msg) {
      this.alert.showAlert = dissmiss;
      this.alert.variant = warning;
      this.alert.message = msg;
    },

    showAlertModal(dissmiss, warning, msg) {
      this.alertModal.showAlert = dissmiss;
      this.alertModal.variant = warning;
      this.alertModal.message = msg;
    },

    async onSearch() {
      await this.loadServiceItems().then((res) => {
        let textSearch = this.inputSearch;
        var filteredList = this.serviceTblList.filter(function (val) {
          return (
            val.service_name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.unit.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.serviceTblList = filteredList;
      });
    },

    onReset() {
      this.form.service_name = "";
      this.form.unit = "";
      this.form.cost = "";
      this.btnSubmitLabel = "Add New Service Item";
      this.isUpdate = false;
      this.$bvModal.hide("manageServiceItemModal");
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.isUpdate) {
        this.editServiceItem();
      } else {
        this.addServiceItem();
      }
    },

    async loadServiceItems() {
      await this.$store
        .dispatch("service/loadServiceItemList", {
          token: localStorage.token,
        })
        .then((res) => {
          this.serviceTblList = this.getServiceItems;
        });
    },

    async addServiceItem() {
      await this.$store
        .dispatch("service/addServiceITem", {
          token: localStorage.token,
          service_name: this.form.service_name,
          unit: this.form.unit,
          cost: this.form.cost,
        })
        .then((res) => {
          this.showAlert(3, "success", "Successfully added new service item!");
          this.loadServiceItems();
          this.onReset();
        });
    },

    async editServiceItem() {
      await this.$store
        .dispatch("service/editServiceITem", {
          token: localStorage.token,
          service_item_id: this.selected.service_item_id,
          service_name: this.form.service_name,
          unit: this.form.unit,
          cost: this.form.cost,
        })
        .then(
          (res) => {
            this.showAlert(3, "success", "Successfully updated selected service item!");
            this.loadServiceItems();
            this.onReset();
          },
          (err) => {
            this.onReset();
            this.showAlertModal(3, "warning", err.response.data.error);
          }
        );
    },
  },
  mounted() {
    this.loadServiceItems();
    setTimeout(() => {
      this.showDelay = true;
    }, 1);
  },
  computed: {
    rows() {
      return this.serviceTblList.length;
    },

    getServiceItems() {
      return this.$store.state.service.serviceItemsList;
    },
  },
};
</script>

<style scoped></style>
