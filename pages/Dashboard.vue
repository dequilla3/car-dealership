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
      isLoggedIn: false,
      dbContents: [
        { id: 1, title: "Daily Sales", value: 999.99 },
        { id: 2, title: "Weekly Sales", value: 10000.99 },
        { id: 3, title: "Monthly Sales", value: 13032.99 },
      ],
    };
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
}

.db-content:hover {
  height: 130px;
  width: 290px;
  transition: all 0.3s ease-in-out;
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
