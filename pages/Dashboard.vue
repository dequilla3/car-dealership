<template>
    <div>
        <Navbar/>
        <SideBar/>
        <div class="dashboard-content">
            <div class="db-content">test</div>
            <div class="db-content">test</div>
            <div class="db-content">test</div>
            <div class="db-content">test</div>
            <div class="db-content">test</div>
            <div class="db-content">test</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Dashboard"
    }
</script>

<style scoped>
.dashboard-content{
    margin-left: 230px;
    margin-top: 70px;
    margin-right: 10px;
    justify-content: space-evenly;
    display: flex;
}
.db-content{
    height: 100px;
    width: 250px;
    background-color: lightgray;
    display: inline;
}
   


</style>