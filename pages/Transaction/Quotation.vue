<template>
  <div class="t_quotation-container">
    <Navbar />
    <SideBar />
    <div><h6>Quotation</h6></div>
    <hr />

    <b-alert
      :show="alert.showAlert"
      :variant="alert.variant"
      @dismissed="alert.showAlert = null"
    >
      {{ alert.message }}
    </b-alert>

    <div @keyup.delete="removeItem">
      <b-form @submit="onSubmit" class="form-t_quotation">
        <b-form-checkbox id="checkbox-1" v-model="isService" name="checkbox-1" size="sm">
          Leave check if transaction is for service
        </b-form-checkbox>
        <br />
        <!-- transaction number form group-->
        <b-form-group
          id="quotationNumber"
          label="Quotation reference number:"
          label-for="input-quotationNumber"
          class="b-form-group-t_quotation"
        >
          <b-form-input
            id="input-quotationNumber"
            v-model="form.quotationNumber"
            placeholder="None"
            required
            class="form-t_quotation-input"
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
          <b-input-group id="b-input-group-customerName" class="mt-3">
            <b-form-input
              id="input-customerName"
              v-model="form.customer.customerName"
              required
              class="form-t_quotation-input"
              placeholder="None"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="b-modal-customer"
                v-b-modal.modal-lg="'customerModal'"
                variant="secondary"
                class="form-t_quotation-btn"
                >Select</b-button
              >
            </b-input-group-append>
          </b-input-group>
        </b-form-group>

        <!-- select service form grp-->
        <b-form-group
          id="customerName"
          label="Select service number:"
          label-for="input-service"
          class="b-form-group-t_quotation"
          v-if="isService"
        >
          <b-input-group id="b-input-group-service" class="mt-3">
            <b-form-input
              id="input-service"
              v-model="form.service.serviceNumber"
              required
              class="form-t_quotation-input"
              placeholder="None"
            ></b-form-input>
            <b-input-group-append>
              <b-button
                id="b-modal-customer"
                v-b-modal.modal-lg="'customerModal'"
                variant="secondary"
                class="form-t_quotation-btn"
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
              class="b-table-input"
              type="number"
              v-model="quotationLineList[data.index].qty"
              :value="data.value"
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

        <!-- Proecss and Print button -->
        <div class="div-content-left">
          <b-button variant="info" class="form-t_quotation-btn btn-transaction">
            <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
          </b-button>

          <b-button variant="info" class="form-t_quotation-btn btn-transaction">
            <font-awesome-icon icon="fa-solid fa-file" />
            Print Receipt
          </b-button>

          <b-button variant="danger" class="form-t_quotation-btn btn-transaction">
            <font-awesome-icon icon="fa-solid fa-redo" />
            Reset
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
      </div>

      <!-- Customer Modals -->
      <b-modal
        id="customerModal"
        size="lg"
        hide-footer
        hide-header
        title="Select Customer"
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
            :total-rows="totalRowsCustomerModal"
            :per-page="insertItemModal.perPage"
            aria-controls="my-table"
            class="pagination"
          ></b-pagination>

          <hr />

          <!-- customer modal action btn -->
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
      alert: {
        showAlert: 0,
        variant: "",
        message: "",
      },
      isService: false,
      selectedLine: [],
      show: true,
      name: "quotation",
      perPage: 4,
      currentPage: 1,
      quotationLineTblFields: [
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
        {
          key: "qty",
          label: "Quantity",
        },
        {
          key: "amount",
          label: "Amount",
        },
      ],

      quotationLineList: [],

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
        customerTblList: [
          {
            id: 1,
            name: "Test Data Customer",
            contactNumber: "09123456789",
            address: "Surallah 3232323",
            dateCreated: currentDate,
            // _rowVariant: "info",
          },
          {
            id: 2,
            name: "Test Customer Data II",
            contactNumber: "09123456789",
            address: "Koronadal",
            dateCreated: currentDate,
          },
        ],
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

        itemList: [
          {
            id: 1,
            skuId: 1,
            productCode: "456452323DSDA",
            productName: "PC220 Excavator Bushing Customized Excavatot Bucket Bush",
            unit: "PC",
            cost: 566,
            qty: 1,
          },
          {
            id: 4434,
            skuId: 9384,
            productCode: "90099023-LJN",
            productName:
              "MANY SMD Diode FM4007/A7/1N4007W Rectifier Diode 1A 1000V SOD-123FL IC",
            unit: "PC",
            cost: 1500,
            qty: 1,
          },
          {
            id: 522,
            skuId: 9111,
            productCode: "8236473-JBXMN",
            productName:
              "Mop Bucket Factory Wholesale Fashion Round New Clean Dirty Water Separated Spin Flat Mop For House Floor Cleaning",
            unit: "PC",
            cost: 2000,
            qty: 1,
          },
          {
            id: 3125,
            skuId: 87421,
            productCode: "5684231489-NDGBM",
            productName:
              "Vacuum Pump Manufacturers SV025 Rotary Vane Vacuum Pump For Electric Vehicle Vacuum Pump",
            unit: "PC",
            cost: 2000,
            qty: 1,
          },
          {
            id: 87912303,
            skuId: 4342342,
            productCode: "ASD-NDGBM2321",
            productName: "Super xt yamalube oil",
            unit: "PC",
            cost: 355,
            qty: 1,
          },
        ],
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

    // INSERT ITEM MODAL
    insertSelectedItem(items) {
      this.insertItemModal.selected = items;
    },

    insertItem() {
      if (this.customerModal.selected.length < 1) {
        this.alert = {
          showAlert: 3,
          variant: "warning",
          message: "Please select customer first!",
        };
      }
      let selectedLine = this.insertItemModal.selected[0];
      let isNotExist = true;

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
    rows() {
      return this.quotationLineList.length;
    },

    totalRowsCustomerModal() {
      return this.customerModal.customerTblList.length;
    },

    totalRowsItemListModal() {
      return this.insertItemModal.itemTblFields.length;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.t_quotation-container {
  margin: 65px 10px 0 270px;
  padding: 20px;
  /* background: rgb(239, 239, 239); */
}
.t_quotation-btn {
  width: 150px;
  font-size: 12px;
}

.form-t_quotation {
  width: 25%;
  font-size: 12px;
}
.form-t_quotation-input {
  height: 35px;
  font-size: 12px;
}
.form-t_quotation-btn {
  height: 35px;
  font-size: 12px;
}

.t-btn-secondary-margin-bottom {
  width: 150;
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
</style>
