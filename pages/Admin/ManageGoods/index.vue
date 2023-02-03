<template>
  <div class="mainContainer">
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
.manage_goods-card {
  padding-bottom: 100px;
}

.manage_goods-card-tabs {
  font-size: 13px;
}
.pagination {
  font-size: 12px;
}
</style>
