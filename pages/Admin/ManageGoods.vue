<template>
  <div class="manage_goods-container">
    <Navbar />
    <SideBar />
    <div><h6>Manage Goods</h6></div>
    <hr />
    <!-- TABS -->
    <div>
      <b-card no-body class="manage_goods-card">
        <b-tabs
          card
          class="manage_goods-card-tabs"
          active-nav-item-class="font-weight-bold text-uppercase text-default"
        >
          <b-tab title="Spare Parts" active>
            <ManageGoodsTabParts />
          </b-tab>
          <b-tab title="Cars">
            <ManageGoodsTabCar />
          </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Poppins");
* {
  font-family: "Poppins";
}
.manage_goods-container {
  margin: 80px 10px 0 280px;
}

.manage_goods-card {
  padding-bottom: 100px;
}

.manage_goods-card-tabs {
  font-size: 13px;
}
</style>
