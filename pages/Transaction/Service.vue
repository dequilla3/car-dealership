<template>
  <div class="mainContainer">
    <b-overlay no-wrap :show="isBusy" opacity="0.40" />
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <transition name="slide-fade">
        <div v-show="showDelay">
          <div><h6>Service</h6></div>
          <hr />
          <b-form class="form-60">
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
              class="font-12 mb-3"
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
                        class="font-12"
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
                    class="font-12"
                    @keyup.enter="onSearchCustomer"
                  ></b-form-input>
                </b-form-group>

                <!-- customer modal table -->
                <b-table
                  class="standardTable"
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
                  <template #cell(date_created)="data">
                    {{ new Date(data.value).toJSON().slice(0, 10) }}
                  </template>
                </b-table>

                <!-- tbl pages -->
                <b-pagination
                  v-model="customerModal.currentPage"
                  :total-rows="totalRowsCustomerModal"
                  :per-page="customerModal.perPage"
                  aria-controls="my-table"
                  class="paginationSmall"
                ></b-pagination>

                <hr />

                <!-- customer modal action btn -->
                <div class="div-content-left">
                  <b-button
                    variant="success"
                    class="font-12 h-3 ml-2"
                    @click="selectCustomer"
                  >
                    <font-awesome-icon icon="fa-solid fa-check" /> Select
                  </b-button>

                  <b-button
                    variant="danger"
                    class="font-12 h-3 ml-2"
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
            class="font-12 t-btn-secondary-margin-bottom"
            @click="onClickInsertItem"
            :disabled="isProcessed"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-down" />
            Insert Item
          </b-button>

          <!-- Remove item button -->
          <b-button
            variant="danger"
            class="font-12 t-btn-secondary-margin-bottom"
            @click="removeItem"
            :disabled="isProcessed"
          >
            <font-awesome-icon icon="fa-solid fa-close" />
            Remove Item
          </b-button>

          <!--transaction table -->
          <b-table
            class="standardTable"
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
                class="font-9 w-1"
                type="number"
                v-model="serviceLineList[data.index].qty"
                :value="data.value"
                @keyup="onKeypressInputQty"
                :disabled="isProcessed"
              ></b-form-input>
            </template>

            <template #cell(amount)="data">
              {{ serviceLineList[data.index].qty * serviceLineList[data.index].cost }}
            </template>
          </b-table>

          <hr />

          <!-- Total amount section -->

          <div class="d-flex flex-row-reverse">
            <div class="p-2">
              <b-input-group class="font-13" size="sm" prepend="Total:">
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
              variant="primary"
              class="font-12 ml-2"
              :disabled="isProcessed"
            >
              <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
            </b-button>

            <b-button
              @click="onPrint"
              variant="info"
              class="font-12 ml-2"
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
                  class="font-12"
                  @keyup.enter="onSearchServiceItems"
                ></b-form-input>
              </b-form-group>

              <!-- item modal table -->
              <b-table
                class="standardTable"
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
                class="paginationSmall"
              ></b-pagination>

              <hr />

              <!-- item modal action btn -->
              <div class="div-content-left">
                <b-button
                  variant="success"
                  class="font-12 h-3 ml-2"
                  @click="onClickInsertItemModal"
                >
                  <font-awesome-icon icon="fa-solid fa-check" /> Insert
                </b-button>

                <b-button
                  variant="danger"
                  class="font-12 h-3 ml-2"
                  @click="$bvModal.hide('insertItemModal')"
                >
                  <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
                </b-button>
              </div>
            </div>
          </b-modal>
        </div>
      </transition>
    </div>

    <div class="print">
      <ServiceTicket />
    </div>
  </div>
</template>

<script>
import ServiceTicket from "../../components/Reports/ServiceTicket.vue";
import axios from "axios";

export default {
  components: {
    ServiceTicket,
  },
  data() {
    return {
      showDelay: false,
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
    showAlert(showAlert, variant, message) {
      this.alert.showAlert = showAlert;
      this.alert.variant = variant;
      this.alert.message = message;
      this.isBusy = false;
    },

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

      if (this.form.customer.customerId === "") {
        this.showAlert(3, "warning", "Please select customer!");
        return;
      }

      if (this.form.serialNum === "") {
        this.showAlert(3, "warning", "Please encode serial number!");
        return;
      }

      if (this.form.comment === "") {
        this.showAlert(3, "warning", "Please encode comment!");
        return;
      }

      if (this.serviceLineList.length < 1) {
        this.showAlert(3, "warning", "Please select services!");
        return;
      }

      return await this.$store
        .dispatch("customer/loadCustomerById", {
          customerId: this.form.customer.customerId,
        })
        .then(
          (res) => {
            //POST SERVICE
            this.postService();
          },
          (err) => {
            this.isBusy = false;
          }
        );
    },

    async postService() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/service/create`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
        data: {
          customer_id: this.form.customer.customerId,
          user_id: localStorage.userId,
          serial_number: this.form.serialNum,
          comment: this.form.comment,
          services: this.services,
        },
      }).then(
        (res) => {
          //SET DOC NUMBER
          this.form.serviceNumber = `${this.getDoc}-${res.data.service_id}`;

          // SET Service STATE
          this.$store.commit("service/SET_SERVICE_LINE", this.serviceLineList);
          this.$store.commit("service/SET_SERVICE_HEADER", {
            serviceNumber: this.form.serviceNumber,
            serialNumber: this.form.serialNum,
            dateTrans: new Date(res.data.date_transaction).toJSON().slice(0, 10),
            comment: this.form.comment,
            userName: localStorage.userName,
          });

          this.isProcessed = true;
          this.showAlert(3, "success", "Successfully processed!");
          this.isBusy = false;
        },
        (err) => {
          if (err.response.status === 400) {
            this.showAlert(3, "warning", err.response.data.error);
          }
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
          if (selectedLine.service_item_id === line.service_item_id) {
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
          val.qty = val.qty === undefined ? 1 : val.qty;
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
    this.isProcessed = this.getDoc === "";

    if (this.getDoc === "") {
      this.$router.push({ path: "/dashboard" });
      return;
    }
    this.loadServiceItems();
    this.loadCustomer();

    setTimeout(() => {
      this.showDelay = true;
    }, 1);
  },

  computed: {
    getDoc() {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === "SERVICE";
      });
      return doc[0].code;
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

    getService() {
      return this.$store.state.service.serviceList;
    },

    //convert serviceLineList[] columns based to res body
    services() {
      let services = [];
      this.serviceLineList.forEach(function (val) {
        let tempObj = {};
        tempObj.service_item_id = val.service_item_id;
        tempObj.qty = val.qty;
        tempObj.amount = Number(val.qty) * Number(val.cost);
        services.push(tempObj);
      });
      return services;
    },
  },
};
</script>

<style scoped></style>
