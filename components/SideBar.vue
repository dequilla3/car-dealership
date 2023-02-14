<template>
  <div class="sidenav dontPrint">
    <div
      class="sidebar-menus-parent"
      id="dashboard"
      @click="setMenuActive('dashboard', '/dashboard')"
    >
      <a>
        <font-awesome-icon icon="fa-solid fa-bars" />
        Dashboard</a
      >
    </div>

    <!-- Admin menu parent-->
    <div class="sidebar-menus-parent" v-if="role.toLowerCase() === 'admin'">
      <button @click="dropDownTriggerAdmin()" class="dropdown-btn">
        <font-awesome-icon icon="fa-solid fa-user-tie" /> Admin
        <i :class="dropDownAdminArrowIcon()" />
      </button>

      <!-- Admin dropdown menus -->
      <div class="sidebar-menus">
        <transition name="slide-fade">
          <div v-show="isActiveAdmin">
            <div
              v-for="adminMenu in adminMenus"
              :key="adminMenu.key"
              class="sidebar-menus-list mt-1"
              :class="{ active: adminMenu.active }"
              @click="setMenuActive(adminMenu.key)"
              v-show="showMenu(adminMenu)"
            >
              <font-awesome-icon :icon="['fa-solid', adminMenu.icon]" />
              {{ adminMenu.title }}
            </div>
          </div></transition
        >
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
        <transition name="slide-fade">
          <div v-show="isActiveTransaction">
            <div
              v-for="transactionMenu in transactionMenus"
              :key="transactionMenu.id"
              class="sidebar-menus-list mt-1"
              :class="{ active: transactionMenu.active }"
              @click="setMenuActive(transactionMenu.key)"
              v-show="showMenu(transactionMenu)"
            >
              <font-awesome-icon :icon="['fa-solid', transactionMenu.icon]" />
              {{ transactionMenu.title }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Report menu -->
    <div
      v-show="isAdmin"
      class="sidebar-menus-parent"
      @click="setMenuActive('report', '/report')"
    >
      <a> <font-awesome-icon icon="fa-solid fa-file" /> Reports</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: false,
      role: "",
      isActiveTransaction: true,
      isActiveAdmin: true,
      isDashboardActive: false,
      dashboardKey: "dashboard",
      transactionMenus: [],
      adminMenus: [],
    };
  },

  methods: {
    dropDownTriggerAdmin() {
      this.isActiveAdmin = !this.isActiveAdmin;
    },

    dropDownTriggerTransaction() {
      this.isActiveTransaction = !this.isActiveTransaction;
    },

    dropDownTransactionArrowIcon() {
      return this.isActiveTransaction ? "arrow down" : "arrow right";
    },

    dropDownAdminArrowIcon() {
      return this.isActiveAdmin ? "arrow down" : "arrow right";
    },

    setActiveMenus() {},

    setMenuActive(menuKey, route) {
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

      // if #path is empty then use #route
      this.$router.push({ path: path === "" ? route : path });
    },

    showMenu(menu) {
      try {
        let useRole = localStorage.userRole;
        let access = menu.access.filter(function (val) {
          return val.toLowerCase() === useRole.toLowerCase();
        });
        return access.length > 0;
      } catch (err) {
        return false;
      }
    },
  },

  mounted() {
    var menuKey = localStorage.activeMenuId;
    //init menus
    if (localStorage.userRole !== undefined) {
      this.transactionMenus = this.getTransactionMenus;
      this.adminMenus = this.getAdminMenus;
      this.role = localStorage.userRole;
      this.isAdmin = this.role.toLowerCase() === "admin";
    } else {
      //reload menus every 1
      setInterval(() => {
        this.transactionMenus = this.getTransactionMenus;
        this.adminMenus = this.getAdminMenus;
        this.role = localStorage.userRole;
        this.isAdmin = this.role.toLowerCase() === "admin";
      }, 1000);
    }

    //for admin menus
    this.adminMenus.forEach(function (menu) {
      menu.active = menu.key == menuKey;
    });

    //for transaction menus
    this.transactionMenus.forEach(function (menu) {
      menu.active = menu.key == menuKey;
    });

    this.setMenuActive(menuKey);
  },

  computed: {
    getTransactionMenus() {
      return this.$store.state.menus.transactionMenus;
    },

    getAdminMenus() {
      return this.$store.state.menus.adminMenus;
    },
  },
};
</script>

<style scoped>
/* Fixed sidenav, full height */

.sidenav {
  height: 100%;
  width: 280px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: rgb(231, 231, 231);
  overflow-x: hidden;
  padding-top: 60px;
  padding: 60px 10px 0 10px;
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
  transition-timing-function: ease-out;
}

.dropdown-container-block {
  height: 100%;
  display: block;
  transition-timing-function: ease-out;
}

.btn-icon {
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

.slide-fade-enter-active {
  transition: all 0.1s ease;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(50px);
}
</style>
