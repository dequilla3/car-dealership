<template>
  <div class="mainContainer">
    <b-overlay no-wrap :show="isBusy" opacity="0.40" />
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <div><h6>Quotation</h6></div>
      <hr />
      <div>
        <b-form @submit="onSubmit" class="form-60">
          <b-alert
            :show="alert.showAlert"
            :variant="alert.variant"
            @dismissed="alert.showAlert = null"
          >
            {{ alert.message }}
          </b-alert>
          <b-button
            variant="primary"
            class="form-t_quotation-btn t-btn-primary-margin-bottom"
            v-if="isProcessed"
            @click="onClickedNewTrans"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
            New Transaction
          </b-button>

          <b-form-checkbox
            id="checkbox-1"
            v-model="isService"
            name="checkbox-1"
            size="sm"
            :disabled="isProcessed"
          >
            Leave check if transaction has service
          </b-form-checkbox>
          <br />

          <div class="grid-container-3">
            <div class="grid-item">
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
                      v-b-modal.modal-lg="'customerModalQtn'"
                      variant="secondary"
                      class="form-t_quotation-btn"
                      @click="openCustomerModal"
                      :disabled="isProcessed"
                      >Select</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>

            <div class="grid-item">
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
                      variant="secondary"
                      class="form-t_quotation-btn"
                      @click="onClickServiceBtnModal"
                      :disabled="isProcessed"
                      >Select</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </div>
        </b-form>
        <br />
        <div>
          <b-button
            v-b-modal.modal-lg="'insertItemModalQuote'"
            variant="info"
            class="form-t_quotation-btn t-btn-secondary-margin-bottom"
            @click="openItemListModalDialog"
            :disabled="isProcessed"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-down" />
            Insert Product
          </b-button>

          <b-button
            variant="danger"
            class="form-t_quotation-btn t-btn-secondary-margin-bottom"
            @click="removeItem"
            :disabled="isProcessed"
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
              {{ quotationLineList[data.index].qty * quotationLineList[data.index].cost }}
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
              variant="primary"
              class="form-t_quotation-btn btn-transaction"
              @click="onClickProcess"
              :disabled="isProcessed"
            >
              <font-awesome-icon icon="fa-solid fa-cogs" /> Process Transaction
            </b-button>

            <b-button
              @click="onPrint"
              variant="info"
              class="form-t_quotation-btn btn-transaction"
              :disabled="!isProcessed"
            >
              <font-awesome-icon icon="fa-solid fa-file" />
              Print Receipt
            </b-button>
          </div>
        </div>

        <!-- Customer Modals -->
        <b-modal
          id="customerModalQtn"
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
                @click="$bvModal.hide('customerModalQtn')"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
              </b-button>
            </div>
          </div>
        </b-modal>

        <!-- Service Modals -->
        <b-modal
          id="serviceModal"
          size="lg"
          hide-footer
          hide-header
          title="Select Service"
        >
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
                @keyup.enter="onSearchServices"
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
              <template #cell(date_transaction)="data">
                {{ new Date(data.value).toJSON().slice(0, 10) }}
              </template>
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
          id="insertItemModalQuote"
          size="xl"
          hide-footer
          hide-header
          title="Insert Customer"
        >
          <div class="modal-container">
            <h6>Insert Item</h6>
            <hr />

            <b-container class="bv-example-row">
              <b-row
                ><b-col>
                  <b-form-group
                    id="inputSearchInsertItemModal"
                    label="Search:"
                    label-for="input-search"
                  >
                    <b-input-group id="b-input-group-service">
                      <b-form-input
                        id="input-search"
                        v-model="insertItemModal.inputSearch"
                        placeholder="Search . . ."
                        class="globalInputSize"
                        @keyup.enter="loadPropductByCategory"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button
                          class="form-t_quotation-btn"
                          @click="loadPropductByCategory"
                        >
                          <font-awesome-icon icon="fa-solid fa-filter" /> Filter
                        </b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group></b-col
                >
                <b-col col lg="2">
                  <b-form-group
                    id="radioBtn"
                    label="Filter by Category:"
                    label-for="radio-btn"
                  >
                    <b-form-radio-group
                      id="radio-btn"
                      v-model="insertItemModal.selectedCategory"
                      :options="insertItemModal.options"
                      class="pt-2"
                      value-field="item"
                      text-field="name"
                      disabled-field="notEnabled"
                      @change="loadPropductByCategory"
                    ></b-form-radio-group></b-form-group
                ></b-col>
                ></b-row
              >
            </b-container>

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
                @click="$bvModal.hide('insertItemModalQuote')"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" /> Cancel
              </b-button>
            </div>
          </div>
        </b-modal>
      </div>
    </div>

    <div class="print">
      <QuotationReceipt />
    </div>
  </div>
</template>

<script>
import QuotationReceipt from "../../components/Reports/QuotationReceipt.vue";
import axios from "axios";
export default {
  components: {
    QuotationReceipt,
  },
  data() {
    return {
      isBusy: false,
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
        customerTblList: [],
        customerTblFields: ["name", "contact_number", "address", "date_created"],
      },

      serviceModal: {
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        serviceTblList: [],
        serviceTblFields: [
          { key: "serviceNumber", label: "Service Reference Number" },
          "name",
          "date_transaction",
        ],
      },

      insertItemModal: {
        selectedCategory: "CAR",
        options: [
          { item: "CAR", name: "CARS" },
          { item: "PARTS", name: "PARTS" },
        ],
        inputSearch: "",
        perPage: 5,
        currentPage: 1,
        selected: [],
        itemList: [],
        itemTblFields: [
          { key: "productCode", label: "Product Code" },
          { key: "productName", label: "Product Name" },
          { key: "unit", label: "Unit" },
          { key: "cost", label: "Cost" },
        ],
      },
    };
  },

  methods: {
    async onSearchCustomer() {
      await this.loadCustomer().then((res) => {
        let textSearch = this.customerModal.inputSearch;
        let filteredList = this.customerModal.customerTblList.filter(function (val) {
          return (
            val.name.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.address.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.contact_number.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        this.customerModal.customerTblList = filteredList;
      });
    },

    async onSearchServices() {
      await this.loadServices().then((res) => {
        let textSearch = this.serviceModal.inputSearch;
        let filteredList = this.serviceModal.serviceTblList.filter(function (val) {
          return (
            val.serviceNumber.toLowerCase().includes(textSearch.toLowerCase()) ||
            val.name.toLowerCase().includes(textSearch.toLowerCase())
          );
        });
        filteredList.sort();
        filteredList.reverse();
        this.serviceModal.serviceTblList = filteredList;
      });
    },

    onPrint() {
      window.print();
    },
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
    },

    openCustomerModal() {
      this.loadCustomer();
    },

    async onClickServiceBtnModal() {
      if (this.form.customer.customerId === "") {
        this.$bvModal.hide("serviceModal");
        this.showAlert(3, "warning", "Please select customer!");
        return;
      }
      this.$bvModal.show("serviceModal");

      await this.loadQuotes().then(
        (res) => {
          this.loadServices();
        },
        (err) => {
          console.log(err);
        }
      );
    },

    onKeypressInputQty() {
      this.computeTotalAmount();
    },

    computeTotalAmount() {
      let amt = 0;
      this.quotationLineList.forEach(function (val) {
        amt = amt + Number(val.cost) * Number(val.qty);
      });

      this.totalAmount = amt.toLocaleString("en-US");
    },

    openItemListModalDialog() {
      this.loadPropductByCategory();
    },

    loadPropductByCategory() {
      this.loadAllProducts().then((res) => {
        let filteredList = this.insertItemModal.itemList.filter(
          function (val) {
            return val.category === this.insertItemModal.selectedCategory;
          }.bind(this)
        );

        this.insertItemModal.itemList = filteredList;
      });
    },

    onClickedNewTrans() {
      this.totalAmount = "";

      this.isProcessed = false;
      this.quotationLineList = [];

      this.form.customer.customerId = "";
      this.form.customer.customerName = "";

      this.form.service.serviceId = "";
      this.form.service.serviceNumber = "";

      this.form.quotationNumber = "";
    },

    async onClickProcess() {
      if (this.quotationLineList.length < 1) {
        this.showAlert(3, "warning", "Please select Item!");
        return;
      }

      if (this.form.customer.customerId === "") {
        this.showAlert(3, "warning", "Please select customer!");
        return;
      }

      this.isBusy = true;
      return await this.$store
        .dispatch("customer/loadCustomerById", {
          customerId: this.form.customer.customerId,
        })
        .then(
          (res) => {
            //POST quote
            this.postQuote();
          },
          (err) => {
            this.isBusy = false;
          }
        );
    },

    async postQuote() {
      await axios({
        method: "POST",
        url: `${this.$axios.defaults.baseURL}/quotation/create`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
        data: {
          customer_id: this.form.customer.customerId,
          user_id: localStorage.userId,
          service_id:
            this.form.service.serviceId === "" ? null : this.form.service.serviceId,
          products: this.productsToPost,
        },
      }).then(
        (res) => {
          console.log(res);
          //SET Docno
          this.form.quotationNumber = `${this.getDocQuote}-${res.data.quotation_id}`;

          this.$store.commit("quotation/SET_QUOTE_LINE", this.quotationLineList);
          this.$store.commit("quotation/SET_QUOTE_HEADER", {
            quoteNum: this.form.quotationNumber,
            serviceNum: this.form.service.serviceNumber,
            userName: localStorage.userName,
          });

          this.isProcessed = true;
          this.isBusy = false;
          this.showAlert(3, "success", "Successfully processed!");

          return res;
        },
        (err) => {
          this.isBusy = false;
          console.log(err);
        }
      );
    },

    //select btn on customerModal
    selectCustomer() {
      this.$bvModal.hide("customerModalQtn");
      if (this.customerModal.selected.length > 0) {
        this.form.customer.customerId = this.customerModal.selected[0].customer_id;
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
        this.form.service.serviceId = this.serviceModal.selected[0].service_id;
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

      //IF empty selection
      if (selectedLine !== undefined) {
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
        this.computeTotalAmount();
      }
    },

    onSelectCategory() {
      console.log("test");
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

    showAlert(showAlert, variant, message) {
      this.alert.showAlert = showAlert;
      this.alert.variant = variant;
      this.alert.message = message;
      this.isBusy = false;
    },

    async loadCustomer() {
      return await this.$store
        .dispatch("customer/loadCustomers", { token: localStorage.token })
        .then(
          (res) => {
            this.customerModal.customerTblList = this.getCustomerList;
          },
          (err) => {}
        );
    },

    async loadAllProducts() {
      return await this.$store.dispatch("item/loadAllProducts").then(
        (res) => {
          this.insertItemModal.selected = [];
          this.setAllProducts();
          return res;
        },
        (err) => {
          console.log(err);
        }
      );
    },

    async loadQuotes() {
      return await this.$store.dispatch("quotation/loadQuotes");
    },

    async loadServices() {
      return await this.$store.dispatch("service/loadServices").then((res) => {
        this.serviceModal.serviceTblList = [];
        let custId = this.form.customer.customerId;
        let serviceByCustomerNotOnQtn = [];
        let serviceIdFromQtn = [];

        //filter serviced base on selected customer
        let serviceByCustomer = this.getServiceList.filter(function (val) {
          return val.customerId === custId;
        });

        //select all service_id from qtn where service id !== null
        this.getQuotes.forEach(function (val) {
          if (val.service_id !== null) {
            serviceIdFromQtn.push(val.service_id);
          }
        });

        // fetch services not yet tagged in quotation
        serviceByCustomer.forEach(
          function (val) {
            let tmpList = serviceIdFromQtn.filter(function (svcId) {
              return val.service_id === svcId;
            });
            if (tmpList.length < 1) {
              serviceByCustomerNotOnQtn.push(val);
            }
          }.bind(this)
        );

        //return final filtered list
        this.serviceModal.serviceTblList = serviceByCustomerNotOnQtn;
      });
    },

    //set all products from $store to local list with customized columns
    setAllProducts() {
      let list = [];
      let tempList = [];
      let textSearch = this.serviceModal.inputSearch;

      this.getItemList.forEach(function (val) {
        //reset temporary list every iteration
        tempList = [];
        // set customized column
        tempList.skuId = val.sku_id;
        tempList.productCode = val.barcode == null ? val.serial_number : val.barcode;
        tempList.productName =
          val.printname == null ? `${val.brand_name} ${val.model}` : val.printname;
        tempList.unit = val.unit;
        tempList.cost = Number(val.cost);
        tempList.qty = 1;
        tempList.category = val.barcode === null ? "CAR" : "PARTS";

        // push temp list to actual list
        list.push(tempList);
      });

      let filteredList = list.filter(function (val) {
        return (
          val.productCode.toLowerCase().includes(textSearch.toLowerCase()) ||
          val.productName.toLowerCase().includes(textSearch.toLowerCase()) ||
          val.unit.toLowerCase().includes(textSearch.toLowerCase())
        );
      });

      this.insertItemModal.itemList = filteredList;
    },
  },

  mounted() {
    this.loadCustomer();
    this.loadQuotes();
  },

  computed: {
    getDocQuote() {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === "QUOTATION";
      });
      return doc[0].code;
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
      return this.insertItemModal.itemList.length;
    },

    getCustomerList() {
      return this.$store.state.customer.customerList;
    },

    //get union products from store
    getItemList() {
      return this.$store.state.item.itemList;
    },

    getServiceList() {
      let doc = this.getDocService;
      let servicesList = this.$store.state.service.serviceList;
      let tempList = [];
      let curList = [];

      servicesList.forEach(function (val) {
        // set temp list to empty
        tempList = [];
        tempList.service_id = val.service_id;
        tempList.serviceNumber = `${doc}-${val.service_id}`;
        tempList.name = val.name;
        tempList.date_transaction = val.date_transaction;
        tempList.customerId = val.customer_id;
        curList.push(tempList);
      });
      curList.sort();
      curList.reverse();
      return curList;
    },

    productsToPost() {
      let products = [];
      this.quotationLineList.forEach(function (val) {
        let tempObj = {};
        tempObj.sku_id = val.skuId;
        tempObj.qty = val.qty;
        tempObj.amount = val.qty * val.cost;
        products.push(tempObj);
      });
      return products;
    },

    getDocService() {
      let doc = this.$store.state.doc.docModules.filter(function (val) {
        return val.module === undefined ? "" : val.module === "SERVICE";
      });
      return doc[0].code;
    },

    getQuotes() {
      return this.$store.state.quotation.quotes;
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
