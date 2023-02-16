<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <transition name="slide-fade">
      <div v-show="showDelay">
        <div><h6>Analytical view</h6></div>
        <hr />
        <div class="dashboard-content-container">
          <div class="db-content" v-for="dbContent in dbContents" :key="dbContent.id">
            <div class="mt-2 mb-2 ml-4">
              {{ dbContent.title }}
            </div>

            <h2 class="ml-5">
              <small class="text-muted">
                <font-awesome-icon icon="fa-solid fa-peso-sign" /></small
              >{{ dbContent.value.toLocaleString("en-US"), }}
            </h2>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
      showDelay: false,
      isLoggedIn: false,
      dbContents: [
        { title: "Daily Sales", value: "" },
        { title: "Weekly Sales", value: "" },
        { title: "Monthly Sales", value: "" },
      ],
    };
  },

  methods: {
    async loadDailySales() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/daily-sales`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => {
        this.dbContents[0].value =
          res.data.daily_sales === null ? 0.0 : res.data.daily_sales;
        return res;
      });
    },

    async loadWeeklySales() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/weekly-sales`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => {
        this.dbContents[1].value =
          res.data.weekly_sales === null ? 0.0 : res.data.weekly_sales;
        return res;
      });
    },

    async loadMonthlySales() {
      return await axios({
        method: "GET",
        url: `${this.$axios.defaults.baseURL}/monthly-sales`,
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => {
        this.dbContents[2].value =
          res.data.monthly_sales === null ? 0.0 : res.data.monthly_sales;
        return res;
      });
    },
  },

  computed: {
    validateLogin() {
      return (
        localStorage.userId === undefined ||
        localStorage.userName === undefined ||
        localStorage.token === undefined
      );
    },
  },

  mounted() {
    setTimeout(() => {
      this.showDelay = true;
    }, 1);

    if (!this.validateLogin) {
      this.loadDailySales();
      this.loadMonthlySales();
      this.loadWeeklySales();

      this.interval = setInterval(() => {
        this.loadDailySales();
        this.loadMonthlySales();
        this.loadWeeklySales();
      }, 1500);
    }
  },

  beforeDestroy() {
    clearTimeout(this.interval);
  },
};
</script>

<style scoped>
.dashboard-content-container {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1rem;
  float: left;
}
.db-content {
  height: 120px;
  width: 280px;
  color: black;
  background-color: hsl(0, 0%, 96%);
  padding: 10px;
  background-image: linear-gradient(to top, #f5f5f5, #e8e8e8, #dbdbdb, #cfcfcf, #c2c2c2);
  clip-path: polygon(0 0, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 0 100%, 0% 80%, 0% 20%);
  transition: 0.5s;
}

.db-content,
p {
  font-size: 13px;
  cursor: pointer;
}

.db-content:hover {
  padding: 20px;
}

@media (max-width: 1800px) {
  .dashboard-content-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1500px) {
  .dashboard-content-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 780px) {
  .dashboard-content-container {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
