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
          <b-tabs
            card
            active-nav-item-class="font-weight-bold text-uppercase text-default"
            class="font-12"
          >
            <b-tab title="Spare Parts" active>
              <ManageGoodsTabParts />
            </b-tab>
            <b-tab title="Cars">
              <ManageGoodsTabCar />
            </b-tab>
          </b-tabs>
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

<style scoped></style>
