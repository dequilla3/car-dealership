<template>
  <div class="mainContainer">
    <div class="dontPrint">
      <Navbar />
      <SideBar />
      <div><h6>Report</h6></div>
      <hr />

      <b-card no-body>
        <b-tabs
          class="standardFontSize"
          card
          active-nav-item-class="font-weight-bold text-uppercase text-default"
        >
          <b-tab title="Customers" active> </b-tab>
          <b-tab title="Cars"> </b-tab>
          <b-tab title="Spare Parts"> </b-tab>
          <b-tab title="Roles"> </b-tab>
          <b-tab title="Service Items"> </b-tab>
          <b-tab title="Quotations"> </b-tab>
          <b-tab title="Services"> </b-tab>
          <b-tab title="Invoices"> </b-tab>
        </b-tabs>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Report",
};
</script>

<style scoped></style>
