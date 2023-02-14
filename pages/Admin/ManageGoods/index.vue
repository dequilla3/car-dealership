<template>
  <div class="mainContainer">
    <Navbar />
    <SideBar />
    <transition name="slide-fade">
      <div v-show="showDelay">
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
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDelay: false,
    };
  },

  mounted() {
    setTimeout(() => {
      this.showDelay = true;
    }, 1);
  },
};
</script>

<style scoped>
.manage_goods-card {
  padding-bottom: 100px;
}

.manage_goods-card-tabs {
  font-size: 13px;
}
</style>
