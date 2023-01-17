<template>
  <div class="t_service-container">
    <Navbar />
    <SideBar />
    <div><h6>Service</h6></div>
    <hr />
    <b-form @submit="onSubmuit" class="form-t_service">
      <b-button variant="primary" class="form-t_service-btn t-btn-primary-margin-bottom">
        <font-awesome-icon icon="fa-solid fa-plus" />
        New Trasaction
      </b-button>
      <!-- transaction number form group-->
      <b-form-group id="serviceNum" label="Reference Number:" label-for="serviceNum">
        <b-form-input
          id="serviceNum"
          v-model="form.serviceNumber"
          placeholder="None"
          required
          class="form-t_service-input"
          disabled
        ></b-form-input>
      </b-form-group>

      <!-- customer form grp-->
      <b-form-group
        id="customerName"
        label="Select Customer:"
        label-for="input-customerName"
      >
        <b-input-group id="b-input-group-customerName">
          <b-form-input
            id="input-customerName"
            v-model="form.customer.customerName"
            required
            class="form-t_service-input"
            placeholder="None"
            disabled
          ></b-form-input>
          <b-input-group-append>
            <b-button
              id="b-modal-customer"
              v-b-modal.modal-lg="'customerModal'"
              variant="secondary"
              class="form-t_service-btn"
              @click="openCustomerModal"
              >Select</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-form-group>

      <!-- car serial number -->
      <b-form-group id="serialNum" label="Serial Number:" label-for="serialNum">
        <b-form-input
          id="serialNum"
          v-model="form.serialNum"
          placeholder="Enter serial number"
          required
          class="form-t_service-input"
        ></b-form-input>
      </b-form-group>

      <!-- Customer Modals -->
      <b-modal
        id="customerModal"
        size="lg"
        hide-footer
        hide-header
        title="Select Customer"
        centered
      >
        <div class="modal-container">
          <h6>Select Customer</h6>
          <hr />
          <!-- search input -->
          <b-form-group id="inputSearch" label="Search:" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="customerModal.inputSearch"
              placeholder="Search . . ."
              class="modal-input"
            ></b-form-input>
          </b-form-group>

          <!-- customer modal table -->
          <b-table
            class="t_service-table"
            hover
            :items="customerModal.customerTblList"
            :fields="customerModal.customerTblFields"
            :per-page="customerModal.perPage"
            :current-page="customerModal.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="setSelectedCustomer"
          >
          </b-table>

          <!-- tbl pages -->
          <b-pagination
            v-model="customerModal.currentPage"
            :total-rows="totalRowsCustomerModal"
            :per-page="customerModal.perPage"
            aria-controls="my-table"
            class="pagination"
          ></b-pagination>

          <hr />

          <!-- customer modal action btn -->
          <div class="div-content-left">
            <b-button
              variant="success"
              class="form-t_service-btn modal-action-btn"
              @click="selectCustomer"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Select
            </b-button>

            <b-button
              variant="danger"
              class="form-t_service-btn modal-action-btn"
              @click="$bvModal.hide('customerModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>
    </b-form>
    <br />

    <!-- Insert item button -->
    <b-button
      v-b-modal.modal-lg="'insertItemModal'"
      variant="info"
      class="form-t_service-btn t-btn-secondary-margin-bottom"
      @click="onClickInsertItem"
    >
      <font-awesome-icon icon="fa-solid fa-arrow-down" />
      Insert Item
    </b-button>

    <!-- Remove item button -->
    <b-button
      variant="danger"
      class="form-t_service-btn t-btn-secondary-margin-bottom"
      @click="removeItem"
    >
      <font-awesome-icon icon="fa-solid fa-close" />
      Remove Item
    </b-button>

    <!--transaction table -->
    <b-table
      class="t_service-table"
      hover
      :items="serviceLineList"
      :fields="serviceLineTblField"
      :per-page="perPage"
      :current-page="currentPage"
      select-mode="single"
      ref="selectableTable"
      selectable
      selected-variant="info"
      @row-selected="setSelectedLine"
    >
      <template #cell(qty)="data">
        <b-form-input
          class="b-table-input"
          type="number"
          v-model="serviceLineList[data.index].qty"
          :value="data.value"
          @keyup="onKeypressInputQty"
        ></b-form-input>
      </template>

      <template #cell(amount)="data">
        <b-form-input
          disabled
          class="b-table-input"
          type="number"
          :value="serviceLineList[data.index].qty * serviceLineList[data.index].cost"
        ></b-form-input>
      </template>
    </b-table>

    <hr />

    <!-- Total amount section -->
    <div class="div-content-left">
      <b-input-group class="input--total-size" size="sm" prepend="Total:">
        <b-form-input disabled v-model="totalAmount" type="text"></b-form-input>
      </b-input-group>
    </div>

    <hr />

    <!-- Proecss and Print button -->
    <div class="div-content-left">
      <b-button variant="info" class="form-t_service-btn btn-transaction">
        <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
      </b-button>

      <b-button variant="info" class="form-t_service-btn btn-transaction">
        <font-awesome-icon icon="fa-solid fa-file" />
        Print Receipt
      </b-button>
    </div>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      v-if="rows > 0"
      class="pagination"
    ></b-pagination>

    <!-- Insert Item Modal -->
    <b-modal
      id="insertItemModal"
      size="xl"
      hide-footer
      hide-header
      title="Insert Customer"
    >
      <div class="modal-container">
        <h6>Insert Item</h6>
        <hr />
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
        <!-- search input -->
        <b-form-group
          id="inputSearchInsertItemModal"
          label="Search:"
          label-for="input-search"
        >
          <b-form-input
            id="input-search"
            v-model="insertItemModal.inputSearch"
            placeholder="Search . . ."
            class="modal-input"
          ></b-form-input>
        </b-form-group>

        <!-- item modal table -->
        <b-table
          class="t_service-table"
          hover
          :items="insertItemModal.itemList"
          :fields="insertItemModal.itemTblFields"
          :per-page="insertItemModal.perPage"
          :current-page="insertItemModal.currentPage"
          select-mode="single"
          ref="selectableTable"
          selectable
          selected-variant="info"
          @row-selected="setSelectedItem"
        >
        </b-table>

        <!-- tbl pages -->
        <b-pagination
          v-model="insertItemModal.currentPage"
          :total-rows="totalItemRows"
          :per-page="insertItemModal.perPage"
          aria-controls="my-table"
          class="pagination"
        ></b-pagination>

        <hr />

        <!-- item modal action btn -->
        <div class="div-content-left">
          <b-button
            variant="success"
            class="form-t_service-btn modal-action-btn"
            @click="onClickInsertItemModal"
          >
            <font-awesome-icon icon="fa-solid fa-check" /> Insert
          </b-button>

          <b-button
            variant="danger"
            class="form-t_service-btn modal-action-btn"
            @click="$bvModal.hide('insertItemModal')"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
          </b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      totalAmount: 0,
      perPage: 4,
      currentPage: 1,
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },

      form: {
        serviceNumber: "",
        serialNum: "",
        customer: {
          customerId: "",
          customerName: "",
        },
      },

      serviceLineList: [],
      serviceLineTblField: [
        { key: "serviceName", label: "Service Item", thStyle: { width: "60%" } },
        { key: "unit", label: "Unit", thStyle: { width: "10%" } },
        { key: "cost", label: "Cost", thStyle: { width: "10%" } },
        { key: "qty", label: "Qty", thStyle: { width: "10%" } },
        { key: "amount", label: "Amount", thStyle: { width: "10%" } },
      ],
      selectedServiceLine: [],

      customerModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        customerTblFields: ["name", "contactNumber", "address", "dateCreated"],
        customerTblList: [],
      },

      insertItemModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        itemTblFields: ["serviceName", "unit", "cost"],
        itemList: [],
      },
    };
  },

  methods: {
    // SETTER
    setSelectedLine(items) {
      this.selectedServiceLine = items;
    },
    setSelectedCustomer(items) {
      this.customerModal.selected = items;
    },

    setSelectedItem(items) {
      this.insertItemModal.selected = items;
    },

    // EVENTS
    showAlert(message, variant) {
      this.alert = {
        showAlert: 2,
        variant,
        message,
      };
    },

    onSubmuit() {},

    openCustomerModal() {
      this.customerModal.customerTblList = this.getCustomerList;
    },

    onClickInsertItem() {
      //load service item from store to modal
      this.insertItemModal.itemList = this.getServiceItems;
    },

    onKeypressInputQty() {
      this.totalAmount = this.computeTotalAmount;
    },

    selectCustomer() {
      this.$bvModal.hide("customerModal");
      if (this.customerModal.selected.length > 0) {
        this.form.customer.customerId = this.customerModal.selected[0].id;
        this.form.customer.customerName = this.customerModal.selected[0].name;
      } else {
        this.form.customer.customerId = "";
        this.form.customer.customerName = "";
      }
    },

    removeItem() {
      let selectedIndex = 0;
      let selectedLine = this.selectedServiceLine[0];
      if (this.selectedServiceLine.length > 0) {
        this.serviceLineList.forEach(function (line, index) {
          if (selectedLine.serviceId === line.serviceId) {
            selectedIndex = index;
          }
        });
        this.serviceLineList.splice(selectedIndex, 1);
      }
    },

    onClickInsertItemModal() {
      let selectedLine = this.insertItemModal.selected[0];
      let isNotExist = true;

      if (this.customerModal.selected.length < 1) {
        this.alert = {
          showAlert: 2,
          variant: "warning",
          message: "Please select customer first!",
        };
      } else {
        // if exist in list increase qty
        this.serviceLineList.forEach(function (line) {
          if (selectedLine.serviceId === line.serviceId) {
            line.qty++;
            isNotExist = false;
            return;
          }
        });

        // if not exist push to list
        if (isNotExist) {
          this.serviceLineList.push(this.insertItemModal.selected[0]);
        }

        //set total amount
        this.totalAmount = this.computeTotalAmount;
      }
    },
  },

  computed: {
    computeTotalAmount() {
      let totalAmount = 0;

      this.serviceLineList.forEach(function (val) {
        totalAmount = totalAmount + val.cost * val.qty;
      });
      return totalAmount.toLocaleString("en-US");
    },

    getCustomerList() {
      return this.$store.state.customer.customerList;
    },
    getServiceItems() {
      return this.$store.state.service.serviceItemsList;
    },
    totalRowsCustomerModal() {
      return this.customerModal.customerTblList.length;
    },
    totalItemRows() {
      return this.customerModal.customerTblList.length;
    },
    rows() {
      return this.serviceLineList.length;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.t_service-container {
  margin: 65px 10px 0 270px;
  padding: 20px;
}
.form-t_service {
  width: 25%;
  font-size: 12px;
}
.form-t_service-input {
  height: 35px;
  font-size: 12px;
}
.form-t_service-btn {
  height: 35px;
  font-size: 12px;
}
.pagination {
  font-size: 12px;
}
.div-content-left {
  display: flex;
  justify-content: flex-end;
}
.form-t_service-btn {
  height: 35px;
  font-size: 12px;
}
.modal-action-btn {
  width: 130px;
  margin-top: 20px;
  margin-left: 5px;
}
.t_service-table {
  width: 100%;
  font-size: 12px;
}
.form-t_service-btn {
  height: 35px;
  font-size: 12px;
}
.t-btn-secondary-margin-bottom {
  width: 150;
  margin-bottom: 10px;
}
.t_service-table {
  width: 100%;
  font-size: 12px;
}
.modal-input {
  font-size: 13px;
}
.b-table-input {
  font-size: 12px;
  width: 100px;
}
.btn-transaction {
  width: 170px;
  margin: 20px 0px 20px 5px;
}
.input--total-size {
  width: 200px;
}
.t-btn-primary-margin-bottom {
  width: 150px;
  margin-bottom: 20px;
}
</style>
