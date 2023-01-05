<template>
  <div>
    <Navbar />
    <SideBar />
    <div class="dashboard">
      <div><h6>Analytical view</h6></div>
      <hr />
      <div class="dashboard-content">
        <div class="db-content" v-for="dbContent in dbContents" :key="dbContent.id">
          <p>{{ dbContent.title }}</p>
          <h1>
            <small class="text-muted">$</small
            >{{ dbContent.value.toLocaleString("en-US"), }}
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      dbContents: [
        {
          id: 1,
          title: "Daily Sales",
          value: 999.99,
        },
        {
          id: 2,
          title: "Weekly Sales",
          value: 10000.99,
        },
        {
          id: 3,
          title: "Monthly Sales",
          value: 13032.99,
        },
      ],
    };
  },
  mounted() {
    if (localStorage.token == undefined) {
      this.$router.push({ path: "./" }); // LOG OUT IF NOT
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.dashboard {
  margin: 70px 10px 0 230px;
}
.dashboard-content {
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
}

.db-content:hover {
  height: 130px;
  width: 290px;
  transition: all 0.3s ease-in-out;
}

@media (max-width: 1800px) {
  .dashboard-content {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1500px) {
  .dashboard-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 780px) {
  .dashboard-content {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
