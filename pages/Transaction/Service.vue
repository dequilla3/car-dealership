<template>
  <div class="mainContainer">
    <b-overlay no-wrap :show="isBusy" opacity="0.40" />
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <div><h6>Service</h6></div>
      <hr />
      <b-form @submit="onSubmuit" class="form-60">
        <b-alert
          :show="alert.showAlert"
          :variant="alert.variant"
          @dismissed="alert.showAlert = null"
        >
          {{ alert.message }}
        </b-alert>
        <b-button
          v-if="isProcessed"
          variant="primary"
          class="form-t_service-btn t-btn-primary-margin-bottom"
          @click="onNewTrans"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Trasaction
        </b-button>

        <div class="grid-container-3">
          <div class="grid-item">
            <!-- transaction number form group-->
            <b-form-group
              id="serviceNum"
              label="Reference Number:"
              label-for="serviceNum"
            >
              <b-form-input
                id="serviceNum"
                v-model="form.serviceNumber"
                placeholder="None"
                required
                class="globalInputSize docnoInput"
                disabled
              ></b-form-input>
            </b-form-group>
          </div>

          <div class="grid-item">
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
                  class="globalInputSize"
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
                    :disabled="isProcessed"
                    >Select</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </div>

          <div class="grid-item">
            <!-- car serial number -->
            <b-form-group id="serialNum" label="Serial Number:" label-for="serialNum">
              <b-form-input
                id="serialNum"
                v-model="form.serialNum"
                placeholder="Enter serial number"
                required
                class="globalInputSize"
                :disabled="isProcessed"
              ></b-form-input>
            </b-form-group>
          </div>

          <div class="grid-item">
            <!-- car serial number -->
            <b-form-group id="textarea" label="Comment:" label-for="textarea">
              <b-form-textarea
                id="textarea"
                v-model="form.comment"
                placeholder="Enter something..."
                rows="3"
                max-rows="6"
                class="standardFontSize"
                :disabled="isProcessed"
              ></b-form-textarea>
            </b-form-group>
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
                @keyup.enter="onSearchCustomer"
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
        :disabled="isProcessed"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-down" />
        Insert Item
      </b-button>

      <!-- Remove item button -->
      <b-button
        variant="danger"
        class="form-t_service-btn t-btn-secondary-margin-bottom"
        @click="removeItem"
        :disabled="isProcessed"
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
            :disabled="isProcessed"
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
          @click="onProcess"
          variant="info"
          class="form-t_service-btn btn-transaction"
        >
          <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
        </b-button>

        <b-button
          @click="onPrint"
          variant="info"
          class="form-t_service-btn btn-transaction"
          :disabled="!isProcessed"
        >
          <font-awesome-icon icon="fa-solid fa-file" />
          Print Receipt
        </b-button>
      </div>

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
              @keyup.enter="onSearchServiceItems"
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

    <div class="print">
      <ServiceTicket />
    </div>
  </div>
</template>

<script>
import ServiceTicket from "../../components/Reports/ServiceTicket.vue";
export default {
  components: {
    ServiceTicket,
  },
  data() {
    return {
      isBusy: false,
      isProcessed: false,
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
        comment: "",
        customer: {
          customerId: "",
          customerName: "",
        },
      },

      serviceLineList: [],
      serviceLineTblField: [
        { key: "service_name", label: "Service Item", thStyle: { width: "60%" } },
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
        customerTblFields: ["name", "contact_number", "address", "date_created"],
        customerTblList: [],
      },

      insertItemModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        itemTblFields: ["service_name", "unit", "cost"],
        itemList: [],
      },
    };
  },

  methods: {
    async onSearchCustomer() {
      await this.loadCustomer().then((res) => {
        let textSearch = this.customerModal.inputSearch;
        var filteredList = this.customerModal.customerTblList.filter(function (val) {
          return (
            val.name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.address.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.contact_number.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.customerModal.customerTblList = filteredList;
      });
    },

    async onSearchServiceItems() {
      await this.loadServiceItems().then((res) => {
        let textSearch = this.insertItemModal.inputSearch;
        var filteredList = this.insertItemModal.itemList.filter(function (val) {
          return (
            val.service_name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.unit.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.insertItemModal.itemList = filteredList;
      });
    },

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

    onNewTrans() {
      this.totalAmount = "";
      this.form.serviceNumber = "";
      this.form.serialNum = "";
      this.form.comment = "";
      this.form.customer.customerId = "";
      this.form.customer.customerName = "";

      this.isProcessed = false;
      this.serviceLineList = [];
    },

    async onProcess() {
      this.isBusy = true;
      return await this.$store
        .dispatch("customer/loadCustomerById", {
          customerId: this.form.customer.customerId,
        })
        .then(
          (res) => {
            //TODO Save service transaction
            this.$store.commit("service/SET_SERVICE_LINE", this.serviceLineList);
            this.$store.commit("service/SET_SERVICE_HEADER", {
              serviceNumber: "TEST123",
              serialNumber: this.form.serialNum,
              dateTrans: "TEST_DATE",
              comment: this.form.comment,
            });

            this.isBusy = false;
            this.isProcessed = true;
            this.form.serviceNumber;
            this.alert = {
              showAlert: 3,
              variant: "success",
              message: "Successfully processed!",
            };
          },
          (err) => {
            this.isBusy = false;
          }
        );
    },

    onPrint() {
      window.print();
    },

    openCustomerModal() {
      this.customerModal.customerTblList = this.getCustomerList;
    },

    onClickInsertItem() {
      //load service item from store to modal
      this.insertItemModal.itemList = this.getServiceItems;
    },

    onKeypressInputQty() {
      this.computeTotalAmount();
    },

    computeTotalAmount() {
      let amt = 0;
      this.serviceLineList.forEach(function (val) {
        amt = amt + Number(val.cost) * Number(val.qty);
      });

      this.totalAmount = amt;
    },

    selectCustomer() {
      this.$bvModal.hide("customerModal");
      if (this.customerModal.selected.length > 0) {
        this.form.customer.customerId = this.customerModal.selected[0].customer_id;
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

      this.computeTotalAmount();
    },

    onClickInsertItemModal() {
      let selectedLine = this.insertItemModal.selected[0];
      let isNotExist = true;

      // if exist in list increase qty
      this.serviceLineList.forEach(function (line) {
        if (selectedLine.service_item_id === line.service_item_id) {
          line.qty = Number(line.qty) + 1;
          isNotExist = false;
          return;
        }
      });

      // if not exist push to list
      if (isNotExist) {
        this.serviceLineList.push(this.insertItemModal.selected[0]);
        //add column qty
        this.serviceLineList.forEach(function (val) {
          val.qty = 1;
          val.cost = val.cost;
        });
      }

      //set total amount
      this.computeTotalAmount();
    },

    async loadServiceItems() {
      return await this.$store
        .dispatch("service/loadServiceItemList", {
          token: localStorage.token,
        })
        .then((res) => {
          this.insertItemModal.itemList = this.getServiceItems;
          return res;
        });
    },

    async loadCustomer() {
      return await this.$store
        .dispatch("customer/loadCustomers", { token: localStorage.token })
        .then(
          (res) => {
            this.customerModal.customerTblList = this.getCustomerList;
            return res;
          },
          (err) => {
            this.showAlert(3, "warning", `${err.response.data.error}`);
          }
        );
    },
  },

  mounted() {
    this.loadServiceItems();
    this.loadCustomer();
  },

  computed: {
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

    getService() {
      return this.$store.state.service.serviceList;
    },
  },
};
</script>

<style scoped>
.form-t_service {
  width: 25%;
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
