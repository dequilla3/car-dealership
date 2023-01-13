<template>
  <div class="sidenav">
    <div class="sidebar-menus-parent" id="dashboard" @click="setMenuActive(dashboardKey)">
      <a href="/dashboard">
        <font-awesome-icon icon="fa-solid fa-bars" />
        Dashboard</a
      >
    </div>

    <!-- Admin menu parent-->
    <div class="sidebar-menus-parent">
      <button @click="dropDownTriggerAdmin()" class="dropdown-btn">
        <font-awesome-icon icon="fa-solid fa-users" /> Admin
        <i :class="dropDownAdminArrowIcon()" />
      </button>

      <!-- Admin dropdown menus -->
      <div class="sidebar-menus">
        <div :class="dropDownAdmin()">
          <div
            v-for="adminMenu in adminMenus"
            :key="adminMenu.key"
            class="sidebar-menus-list"
            :class="{ active: adminMenu.active }"
            @click="setMenuActive(adminMenu.key)"
          >
            <font-awesome-icon :icon="['fa-solid', adminMenu.icon]" />
            {{ adminMenu.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction menu parent-->
    <div class="sidebar-menus-parent">
      <button @click="dropDownTriggerTransaction()" class="dropdown-btn">
        <font-awesome-icon icon="fa-solid fa-exchange" /> Transaction
        <i :class="dropDownTransactionArrowIcon()" />
      </button>
      <!-- Transaction dropdown menus -->
      <div class="sidebar-menus">
        <div :class="dropDownTransaction()">
          <div
            v-for="transactionMenu in transactionMenus"
            :key="transactionMenu.id"
            class="sidebar-menus-list"
            :class="{ active: transactionMenu.active }"
            @click="setMenuActive(transactionMenu.key)"
          >
            <font-awesome-icon :icon="['fa-solid', transactionMenu.icon]" />
            {{ transactionMenu.title }}
          </div>
        </div>
      </div>
    </div>

    <!-- Report menu -->
    <div class="sidebar-menus-parent">
      <a href="#reports"> <font-awesome-icon icon="fa-solid fa-file" /> Reports</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isActiveTransaction: true,
      isActiveAdmin: true,
      isDashboardActive: false,
      dashboardKey: "dashboard",
      tMenuIcons: [],
      transactionMenus: [
        {
          id: 1,
          title: "Quotation",
          href: "/transaction/quotation",
          active: false,
          key: "t1",
          icon: "fa-quote-right",
        },
        {
          id: 2,
          title: "Service",
          href: "/transaction/service",
          active: false,
          key: "t2",
          icon: "fa-cog",
        },
        {
          id: 3,
          title: "Cashier",
          href: "#cashier",
          active: false,
          key: "t3",
          icon: "fa-usd",
        },
      ],

      adminMenus: [
        {
          id: 1,
          title: "Manage User",
          href: "/admin/manageUser",
          active: false,
          key: "admin1",
          icon: "fa-user",
        },
        {
          id: 2,
          title: "Manage Sales Person",
          href: "/admin/manageSalesPerson",
          active: false,
          key: "admin2",
          icon: "fa-money-bill",
        },
        {
          id: 3,
          title: "Manage Mechanic",
          href: "/admin/manageMechanic",
          active: false,
          key: "admin3",
          icon: "fa-wrench",
        },
        {
          id: 4,
          title: "Manage Customer",
          href: "/admin/manageCustomer",
          active: false,
          key: "admin4",
          icon: "fa-people-arrows",
        },
        {
          id: 5,
          title: "Manage Goods",
          href: "/admin/manageGoods",
          active: false,
          key: "admin5",
          icon: "fa-parachute-box",
        },
        {
          id: 6,
          title: "Manage Service Item",
          href: "/admin/manageServiceItem",
          active: false,
          key: "admin6",
          icon: "fa-gears",
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

    dropDownTransactionArrowIcon() {
      return this.isActiveTransaction ? "arrow down" : "arrow right";
    },

    dropDownAdmin() {
      return this.isActiveAdmin ? "dropdown-container-block" : "dropdown-container-none";
    },
    dropDownAdminArrowIcon() {
      return this.isActiveAdmin ? "arrow down" : "arrow right";
    },

    setActiveMenus() {},

    setMenuActive(menuKey) {
      localStorage.activeMenuId = menuKey;
      var path = "";

      //update selected menu status to true
      this.adminMenus.forEach(function (menu) {
        if (menu.key == menuKey) {
          menu.active = true;
          path = menu.href;
        } else {
          menu.active = false;
        }
      });

      this.transactionMenus.forEach(function (menu) {
        if (menu.key == menuKey) {
          menu.active = true;
          path = menu.href;
        } else {
          menu.active = false;
        }
      });

      this.$router.push({ path: path });
    },
  },

  mounted() {
    var menuKey = localStorage.activeMenuId;
    //for admin menus
    this.adminMenus.forEach(function (menu) {
      menu.active = menu.key == menuKey;
    });

    //for transaction menus
    this.transactionMenus.forEach(function (menu) {
      menu.active = menu.key == menuKey;
    });
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
  width: 260px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: rgb(246, 246, 246);
  overflow-x: hidden;
  padding-top: 60px;
  padding: 60px 10px 0 10px;
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
.sidebar-menus-list {
  padding: 6px 8px 6px 40px;
  color: black;
  display: block;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
}

.sidebar-menus-list:hover {
  background: gray;
  color: white;
}

/* On mouse-over */
.sidenav a:hover {
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
  background: gray;
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
  width: 18px;
  margin-right: 10px;
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
