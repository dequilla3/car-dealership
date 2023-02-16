<template>
  <div class="sidenav dontPrint">
    <b-navbar-brand @click="this.$router.push('./dashboard')" class="mybrand text-space"
      ><font-awesome-icon icon="fa-solid fa-car" class="mr-2" /> LOU GEH DMS
    </b-navbar-brand>

    <hr />

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

    <div class="sidebar-menus-parent font-13" v-for="menu in menus" :key="menu.id">
      <button @click="dropDownTrigger(menu)" class="dropdown-btn">
        <font-awesome-icon :icon="['fa-solid', menu.icn]" /> {{ menu.parentTitle }}
        <i :class="dropDownArrow(menu)" />
      </button>

      <transition name="slide-fade">
        <div v-show="menu.isActive">
          <div
            v-for="childMenu in menu.childMenus"
            :key="childMenu.key"
            :class="{ baseMenuActive: childMenu.active }"
            @click="setMenuActive(childMenu.key)"
            v-show="showMenu(childMenu)"
          >
            <div class="baseChildMenu font-12" :class="{ activeMenu: childMenu.active }">
              <font-awesome-icon :icon="['fa-solid', childMenu.icon]" />
              {{ childMenu.title }}
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Report menu -->
    <div class="sidebar-menus-parent" @click="setMenuActive('report', '/report')">
      <a> <font-awesome-icon icon="fa-solid fa-file" /> Reports</a>
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
      menus: [],
    };
  },

  methods: {
    setMenuActive(menuKey, route) {
      localStorage.activeMenuId = menuKey;
      var path = "";

      this.menus.forEach(function (menu) {
        menu.childMenus.forEach(function (chimdMenu) {
          if (chimdMenu.key == menuKey) {
            chimdMenu.active = true;
            path = chimdMenu.href;
          } else {
            chimdMenu.active = false;
          }
        });
      });

      // if #path is empty then use #route
      this.$router.push({ path: path === "" ? route : path });
    },

    showMenu(childMenu) {
      try {
        let userRole =
          localStorage.userRole === undefined
            ? ""
            : localStorage.userRole.toUpperCase().replace(/ +/g, "");

        let hasAccess = childMenu.access.filter(function (val) {
          return userRole === val;
        });

        return hasAccess.length > 0;
      } catch (err) {
        console.log(err);
        return false;
      }
    },

    dropDownTrigger(menu) {
      menu.isActive = !menu.isActive;
    },

    dropDownArrow(menu) {
      return menu.isActive ? "arrow down" : "arrow right";
    },

    setSidebarState() {
      this.menus = this.getMenus;
      this.setMenuActive(localStorage.activeMenuId);
    },

    async initCreds() {
      await this.loadRoles().then((res) => {
        this.loadUser();
      });
    },

    async loadUser() {
      await await this.$store.dispatch("login/getUserById").then((res) => {
        setTimeout(() => {
          localStorage.userRole = this.getUserRole;
          this.setSidebarState();
        }, 1000);
      });
    },

    async loadRoles() {
      return await this.$store
        .dispatch("role/loadRoles", { token: localStorage.token })
        .then((res) => {});
    },
  },

  mounted() {
    try {
      if (!this.validateLogin) {
        if (localStorage.userRole === undefined) {
          this.initCreds();
          return;
        }
        this.setSidebarState();
      }
    } catch (err) {
      console.log(err);
    }
  },

  computed: {
    validateLogin() {
      return (
        localStorage.userId === undefined ||
        localStorage.userName === undefined ||
        localStorage.token === undefined
      );
    },
    getMenus() {
      return this.$store.state.menus.menus;
    },
    getUser() {
      return this.$store.state.login.user;
    },

    getRoles() {
      return this.$store.state.role.roles;
    },
    getUserRole() {
      let users = this.getUser;
      let roles = this.getRoles;
      let role = "";
      users.forEach(function (valUser) {
        roles.forEach(function (valRole) {
          if (valUser.user_role_id === valRole.user_role_id) {
            role = valRole.role;
          }
        });
      });
      return role;
    },
  },
};
</script>
