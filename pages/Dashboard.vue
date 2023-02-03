<template>
  <div>
    <Navbar />
    <SideBar />
    <div class="mainContainer">
      <div><h6>Analytical view</h6></div>
      <hr />
      <div class="dashboard-content-container">
        <div class="db-content" v-for="dbContent in dbContents" :key="dbContent.id">
          <p>{{ dbContent.title }}</p>
          <h1>
            <small class="text-muted">
              <font-awesome-icon icon="fa-solid fa-peso-sign" /></small
            >{{ dbContent.value.toLocaleString("en-US"), }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Dashboard",
  data() {
    return {
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
        this.dbContents[0].value = res.data.daily_sales;
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
        this.dbContents[1].value = res.data.weekly_sales;
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
        this.dbContents[2].value = res.data.monthly_sales;
        return res;
      });
    },
  },

  mounted() {
    this.loadDailySales();
    this.loadMonthlySales();
    this.loadWeeklySales();

    this.interval = setInterval(() => {
      this.loadDailySales();
      this.loadMonthlySales();
      this.loadWeeklySales();
    }, 1500);
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
  background-color: whitesmoke;
  padding: 10px;
}

.db-content,
p {
  font-size: 13px;
  cursor: pointer;
  transition: 0.5s;
}

.db-content:hover {
  height: 130px;
  width: 290px;
  transition-timing-function: ease-out;
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
