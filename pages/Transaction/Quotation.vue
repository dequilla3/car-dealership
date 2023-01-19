<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <div><h6>Quotation</h6></div>
    <hr />
    <div>
      <b-form @submit="onSubmit" class="form-t_quotation">
        <b-button
          variant="primary"
          class="form-t_quotation-btn t-btn-primary-margin-bottom"
          v-if="isProcessed"
          @click="onClickedNewTrans"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Transaction
        </b-button>

        <b-form-checkbox id="checkbox-1" v-model="isService" name="checkbox-1" size="sm">
          Leave check if transaction is for service
        </b-form-checkbox>
        <br />
        <!-- transaction number form group-->
        <b-form-group
          id="quotationNumber"
          label="Reference Number:"
          label-for="input-quotationNumber"
          class="b-form-group-t_quotation"
        >
          <b-form-input
            id="input-quotationNumber"
            v-model="form.quotationNumber"
            placeholder="None"
            required
            class="globalInputSize"
            disabled
          ></b-form-input>
        </b-form-group>

        <!-- customer form grp-->
        <b-form-group
          id="customerName"
          label="Select Customer:"
          label-for="input-customerName"
          class="b-form-group-t_quotation"
        >
          <b-input-group id="b-input-group-customerName">
            <b-form-input
              id="input-customerName"
              v-model="form.customer.customerName"
              required
              class="globalInputSize"
              placeholder="None"
              disabled
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="b-modal-customer"
                v-b-modal.modal-lg="'customerModal'"
                variant="secondary"
                class="form-t_quotation-btn"
                @click="openCustomerModal"
                >Select</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <!-- select service form grp-->
        <b-form-group
          id="serviceModal"
          label="Select Service Number:"
          label-for="input-service"
          class="b-form-group-t_quotation"
          v-if="isService"
        >
          <b-input-group id="b-input-group-service">
            <b-form-input
              id="input-service"
              v-model="form.service.serviceNumber"
              required
              class="globalInputSize"
              placeholder="None"
              disabled
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="b-modal-service"
                v-b-modal.modal-lg="'serviceModal'"
                variant="secondary"
                class="form-t_quotation-btn"
                @click="onClickServiceBtnModal"
                >Select</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-form>
      <br />
      <div>
        <b-button
          v-b-modal.modal-lg="'insertItemModal'"
          variant="info"
          class="form-t_quotation-btn t-btn-secondary-margin-bottom"
          @click="openItemListModalDialog"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-down" />
          Insert Product
        </b-button>

        <b-button
          variant="danger"
          class="form-t_quotation-btn t-btn-secondary-margin-bottom"
          @click="removeItem"
        >
          <font-awesome-icon icon="fa-solid fa-close" />
          Remove Product
        </b-button>

        <!-- table -->
        <b-table
          class="t_quotation-table"
          hover
          :items="quotationLineList"
          :fields="quotationLineTblFields"
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
              :disabled="isProcessed"
              class="b-table-input"
              type="number"
              v-model="quotationLineList[data.index].qty"
              :value="data.value"
              @keyup="onKeypressInputQty"
            ></b-form-input>
          </template>

          <template #cell(amount)="data">
            <b-form-input
              disabled
              class="b-table-input"
              type="number"
              :value="
                quotationLineList[data.index].qty * quotationLineList[data.index].cost
              "
            ></b-form-input>
          </template>
        </b-table>

        <hr />

        <!-- Total amount section -->
        <div class="d-flex flex-row-reverse">
          <div class="p-2">
            <b-input-group class="input--total-size" size="sm" prepend="Total:">
              <b-form-input disabled v-model="totalAmount" type="text"></b-form-input>
            </b-input-group>
          </div>
          <div class="p-2">
            <b-pagination
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
              v-if="rows > 0"
              class="pagination"
            ></b-pagination>
          </div>
        </div>

        <hr />

        <!-- Proecss and Print button -->
        <div class="div-content-left">
          <b-button
            variant="info"
            class="form-t_quotation-btn btn-transaction"
            @click="onClickProcess"
          >
            <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
          </b-button>

          <b-button variant="info" class="form-t_quotation-btn btn-transaction">
            <font-awesome-icon icon="fa-solid fa-file" />
            Print Receipt
          </b-button>
        </div>
      </div>

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
            class="t_quotation-table"
            hover
            :items="customerModal.customerTblList"
            :fields="customerModal.customerTblFields"
            :per-page="customerModal.perPage"
            :current-page="customerModal.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="customerModalRowSelected"
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
              class="form-t_quotation-btn modal-action-btn"
              @click="selectCustomer"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Select
            </b-button>

            <b-button
              variant="danger"
              class="form-t_quotation-btn modal-action-btn"
              @click="$bvModal.hide('customerModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>

      <!-- Service Modals -->
      <b-modal id="serviceModal" size="lg" hide-footer hide-header title="Select Service">
        <div class="modal-container">
          <h6>Select Service</h6>
          <hr />
          <!-- search input -->
          <b-form-group id="inputSearch" label="Search:" label-for="input-search">
            <b-form-input
              id="input-search"
              v-model="serviceModal.inputSearch"
              placeholder="Search . . ."
              class="modal-input"
            ></b-form-input>
          </b-form-group>

          <!-- service modal table -->
          <b-table
            class="t_quotation-table"
            hover
            :items="serviceModal.serviceTblList"
            :fields="serviceModal.serviceTblFields"
            :per-page="serviceModal.perPage"
            :current-page="serviceModal.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="setSelectedService"
          >
          </b-table>

          <!-- tbl pages -->
          <b-pagination
            v-model="serviceModal.currentPage"
            :total-rows="totalRowsServiceModal"
            :per-page="serviceModal.perPage"
            aria-controls="my-table"
            class="pagination"
          ></b-pagination>

          <hr />

          <!-- service modal action btn -->
          <div class="div-content-left">
            <b-button
              variant="success"
              class="form-t_quotation-btn modal-action-btn"
              @click="selectService"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Select
            </b-button>

            <b-button
              variant="danger"
              class="form-t_quotation-btn modal-action-btn"
              @click="$bvModal.hide('serviceModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>

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
            class="t_quotation-table"
            hover
            :items="insertItemModal.itemList"
            :fields="insertItemModal.itemTblFields"
            :per-page="insertItemModal.perPage"
            :current-page="insertItemModal.currentPage"
            select-mode="single"
            ref="selectableTable"
            selectable
            selected-variant="info"
            @row-selected="insertSelectedItem"
          >
          </b-table>

          <!-- tbl pages -->
          <b-pagination
            v-model="insertItemModal.currentPage"
            :total-rows="totalRowsItemListModal"
            :per-page="insertItemModal.perPage"
            aria-controls="my-table"
            class="pagination"
          ></b-pagination>

          <hr />

          <!-- item modal action btn -->
          <div class="div-content-left">
            <b-button
              variant="success"
              class="form-t_quotation-btn modal-action-btn"
              @click="insertItem"
            >
              <font-awesome-icon icon="fa-solid fa-check" /> Insert
            </b-button>

            <b-button
              variant="danger"
              class="form-t_quotation-btn modal-action-btn"
              @click="$bvModal.hide('insertItemModal')"
            >
              <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
            </b-button>
          </div>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
let currentDate = new Date().toJSON().slice(0, 10);
export default {
  data() {
    return {
      isService: false,
      selectedLine: [],
      show: true,
      name: "quotation",
      perPage: 4,
      totalAmount: 0,
      currentPage: 1,
      isProcessed: false,

      quotationLineList: [],
      quotationLineTblFields: [
        { key: "productCode", label: "Product Code", thStyle: { width: "10%" } },
        { key: "productName", label: "Product Name", thStyle: { width: "50%" } },
        { key: "unit", label: "Unit", thStyle: { width: "10%" } },
        { key: "cost", label: "Cost", thStyle: { width: "10%" } },
        { key: "qty", label: "Quantity", thStyle: { width: "10%" } },
        { key: "amount", label: "Amount", thStyle: { width: "10%" } },
      ],

      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },

      form: {
        quotationNumber: "",
        salesPersonId: "",
        customer: {
          customerId: "",
          customerName: "",
        },
        service: {
          serviceId: "",
          serviceNumber: "",
        },
      },

      customerModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        customerTblFields: ["name", "contactNumber", "address", "dateCreated"],
        customerTblList: [],
      },

      serviceModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        serviceTblFields: [
          { key: "serviceNumber", label: "Service Reference Number" },
          "dateTrans",
        ],
        serviceTblList: [],
      },

      insertItemModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        itemTblFields: [
          {
            key: "productCode",
            label: "Product Code",
          },
          {
            key: "productName",
            label: "Product Name",
          },
          {
            key: "unit",
            label: "Unit",
          },
          {
            key: "cost",
            label: "Cost",
          },
        ],
        itemList: [],
      },
    };
  },

  methods: {
    onSubmit() {},

    setSelectedLine(items) {
      this.selectedLine = items;
    },

    // SELECT CUSTOMER MODAL
    customerModalRowSelected(items) {
      this.customerModal.selected = items;
    },

    setSelectedService(items) {
      this.serviceModal.selected = items;
      console.log(this.serviceModal.selected);
    },

    openCustomerModal() {
      this.customerModal.customerTblList = this.getCustomerList;
    },

    onClickServiceBtnModal() {
      this.serviceModal.serviceTblList = this.getServiceList;
    },

    onKeypressInputQty() {
      this.totalAmount = this.computeTotalAmount;
    },

    openItemListModalDialog() {
      this.insertItemModal.itemList = this.getItemList;
    },

    onClickedNewTrans() {
      this.isProcessed = false;
      this.quotationLineList = [];
      this.form.customer = "";
      this.form.quotationNumber = "";
    },

    onClickProcess() {
      this.isProcessed = true;
    },

    //select btn on customerModal
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

    //select btn on serviceModal
    selectService() {
      this.$bvModal.hide("serviceModal");
      if (this.serviceModal.selected.length > 0) {
        this.form.service.serviceId = this.serviceModal.selected[0].serviceId;
        this.form.service.serviceNumber = this.serviceModal.selected[0].serviceNumber;
        this.form.service.dateTrans = this.serviceModal.selected[0].dateTrans;
      } else {
        this.form.service.serviceId = "";
        this.form.service.serviceNumber = "";
      }
    },

    // INSERT ITEM MODAL
    insertSelectedItem(items) {
      this.insertItemModal.selected = items;
    },

    insertItem() {
      let selectedLine = this.insertItemModal.selected[0];
      let isNotExist = true;

      if (this.customerModal.selected.length < 1) {
        this.alert = {
          showAlert: 3,
          variant: "warning",
          message: "Please select customer first!",
        };
      } else {
        // if exist in list increase qty
        this.quotationLineList.forEach(function (line) {
          if (selectedLine.skuId === line.skuId) {
            line.qty++;
            isNotExist = false;
            return;
          }
        });

        // if ntot exist push to list
        if (isNotExist) {
          this.quotationLineList.push(this.insertItemModal.selected[0]);
        }

        //set total amount
        this.totalAmount = this.computeTotalAmount;
      }
    },

    removeItem() {
      let selectedIndex = 0;
      let selectedLine = this.selectedLine[0];
      if (this.selectedLine.length > 0) {
        this.quotationLineList.forEach(function (line, index) {
          if (selectedLine.skuId === line.skuId) {
            selectedIndex = index;
          }
        });
        this.quotationLineList.splice(selectedIndex, 1);
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

  computed: {
    computeTotalAmount() {
      let totalAmount = 0;

      this.quotationLineList.forEach(function (val) {
        totalAmount = totalAmount + val.cost * val.qty;
      });
      return totalAmount.toLocaleString("en-US");
    },
    rows() {
      return this.quotationLineList.length;
    },

    totalRowsCustomerModal() {
      return this.customerModal.customerTblList.length;
    },

    totalRowsServiceModal() {
      return this.serviceModal.serviceTblList.length;
    },

    totalRowsItemListModal() {
      return this.insertItemModal.itemTblFields.length;
    },

    getCustomerList() {
      return this.$store.state.customer.customerList;
    },

    getItemList() {
      return this.$store.state.item.itemList;
    },

    getServiceList() {
      return this.$store.state.service.serviceList;
    },
  },
};
</script>

<style scoped>
.t_quotation-btn {
  width: 150px;
  font-size: 12px;
}

.form-t_quotation {
  width: 25%;
  font-size: 12px;
}

.form-t_quotation-btn {
  height: 35px;
  font-size: 12px;
}
.t-btn-primary-margin-bottom {
  width: 150px;
  margin-bottom: 20px;
}
.t-btn-secondary-margin-bottom {
  width: 140px;
  margin-bottom: 10px;
}
.btn-transaction {
  width: 170px;
  margin: 20px 0px 20px 5px;
}
.t_quotation-table {
  width: 100%;
  font-size: 12px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
}
.grid-item {
  text-align: left;
  padding-right: 10px;
  width: 100%;
}
.b-table-input {
  font-size: 12px;
  width: 100px;
}

.div-content-left {
  display: flex;
  justify-content: flex-end;
}

.div-content-spacing {
  display: flex;
  justify-content: space-between;
  width: 410px;
}

.modal-container {
  font-size: 13px;
}

.modal-input {
  font-size: 13px;
}
.modal-action-btn {
  width: 130px;
  margin-top: 20px;
  margin-left: 5px;
}
.pagination {
  font-size: 12px;
}
.input--total-size {
  width: 200px;
}
</style>
