<template>
  <div class="sidenav">
    <div class="sidebar-menus-parent" id="dashboard">
      <a href="/dashboard">
        <img class="btn-icon" src="@/assets/dashboard.png" /> Dashboard</a
      >
    </div>

    <!-- Admin menu parent-->
    <div class="sidebar-menus-parent">
      <button @click="dropDownTriggerAdmin()" class="dropdown-btn">
        <img class="btn-icon" src="@/assets/user.png" />
        Admin
        <i :class="dropDownAdminIcon()" />
      </button>
      <!-- Admin dropdown menus -->
      <div class="sidebar-menus">
        <div :class="dropDownAdmin()">
          <a v-for="adminMenu in adminMenus" :key="adminMenu.id" :href="adminMenu.href">
            {{ adminMenu.title }}</a
          >
        </div>
      </div>
    </div>

    <!-- Transaction menu parent-->
    <div class="sidebar-menus-parent">
      <button @click="dropDownTriggerTransaction()" class="dropdown-btn">
        <img class="btn-icon" src="@/assets/transaction.png" />
        Transaction
        <i :class="dropDownTransactionIcon()" />
      </button>
      <!-- Transaction dropdown menus -->
      <div class="sidebar-menus">
        <div :class="dropDownTransaction()">
          <a
            v-for="transactionMenu in transactionMenus"
            :key="transactionMenu.id"
            :href="transactionMenu.href"
            >{{ transactionMenu.title }}</a
          >
        </div>
      </div>
    </div>

    <!-- Report menu -->
    <div class="sidebar-menus-parent">
      <a href="#reports"> <img class="btn-icon" src="@/assets/file.png" /> Reports</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActiveTransaction: true,
      isActiveAdmin: true,
      transactionMenus: [
        {
          id: 1,
          title: "Quotation",
          href: "#quotation",
        },
        {
          id: 2,
          title: "Service",
          href: "#service",
        },
        {
          id: 3,
          title: "Cashier",
          href: "#cashier",
        },
      ],

      adminMenus: [
        {
          id: 1,
          title: "Manage User",
          href: "#manageUser",
        },
        {
          id: 2,
          title: "Manage Sales Person",
          href: "#manageSalesPerson",
        },
        {
          id: 3,
          title: "Manage Mechanic",
          href: "#manageMechanic",
        },
        {
          id: 4,
          title: "Manage Customer",
          href: "#manageCustomer",
        },
        {
          id: 5,
          title: "Manage Goods",
          href: "#manageGoods",
        },
        {
          id: 6,
          title: "Manage Services",
          href: "#manageServices",
        },
      ],
    };
  },

  methods: {
    dropDownTriggerAdmin() {
      this.isActiveAdmin = !this.isActiveAdmin;
      this.dropDownAdmin();
    },

    dropDownTriggerTransaction() {
      this.isActiveTransaction = !this.isActiveTransaction;
      this.dropDownTransaction();
    },

    dropDownTransaction() {
      return this.isActiveTransaction
        ? "dropdown-container-block"
        : "dropdown-container-none";
    },

    dropDownTransactionIcon() {
      return this.isActiveTransaction ? "arrow down" : "arrow right";
    },

    dropDownAdmin() {
      return this.isActiveAdmin ? "dropdown-container-block" : "dropdown-container-none";
    },
    dropDownAdminIcon() {
      return this.isActiveAdmin ? "arrow down" : "arrow right";
    },
  },

  created() {},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
/* Fixed sidenav, full height */
.sidenav {
  height: 100%;
  width: 220px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: lightgray;
  overflow-x: hidden;
  padding-top: 60px;
}

@media (max-width: 780px) {
  .sidenav {
    height: 100%;
    width: 200px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    background-color: lightgray;
    overflow-x: hidden;
    padding-top: 60px;
  }
}

/* Style the sidenav links and the dropdown button */
.sidenav a,
.dropdown-btn {
  padding: 6px 8px 6px 16px;
  text-decoration: none;
  color: black;
  display: block;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
}

/* Parent menus */
.sidebar-menus-parent {
  margin-top: 15px;
  font-size: 14px;
}

/* Dropdown menus */
.sidebar-menus {
  font-size: 12.5px;
  padding-left: 30px;
}

/* On mouse-over */
.sidenav a:hover,
.dropdown-btn:hover {
  background: gray;
  color: white;
}

/* Main content */
.main {
  margin-left: 200px; /* Same as the width of the sidenav */
  font-size: 20px; /* Increased text to enable scrolling */
  padding: 0px 10px;
}

/* Add an active class to the active dropdown button */
.active {
  background-color: green;
  color: white;
}

/* Dropdown container (hidden by default). Optional: add a lighter background color and some left padding to change the design of the dropdown content */
.dropdown-container-none {
  display: none;
}

.dropdown-container-block {
  display: block;
  transition: all 0.2s ease-in-out;
}

.btn-icon {
  height: 100%;
  width: 20px;
}

.menus-icon {
  height: 15px;
  width: 15;
}

.arrow {
  border: solid rgb(16, 15, 15);
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 1px;
  margin-left: 5px;
  margin-bottom: 3px;
}

.right {
  transform: rotate(-42deg);
  -webkit-transform: rotate(-42deg);
}

.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}
</style>
