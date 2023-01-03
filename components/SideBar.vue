<template>
    <div>
        <aside class="sidebar-main">
            <!-- <Navbar/> -->
            <ul>
                <li><a href="#">Manage Sales Person</a></li>
                <li><a href="#">Manage Mechanic</a></li>
                <li><a href="#">Manage Customer</a></li>
            </ul>
        </aside>
    </div>
</template>

<script>
    export default {
        name: "SideBar"
    }
</script>

<style scoped>
.sidebar-main{
	position: fixed;
	left: 0;
	bottom: 0;
	width: 200px;
	height: calc(100vh - 60px);
	padding: 0 5px;
	background: lightgray;
	z-index: 1000;
}
</style>