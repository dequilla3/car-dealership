<template>
    <div class="sidenav">

        <!-- Admin menu parent-->
        <div class="sidebar-menus-parent">
            <button @click="dropDownTriggerAdmin()" class="dropdown-btn"> 
                <img class="btn-icon" src="../assets/user.png" /> 
                ADMIN
            </button>
            <!-- Admin dropdown menus -->
            <div class="sidebar-menus">
                <div :class="dropDownAdmin()">
                    <a href="#">Manage User</a>
                    <a href="#">Manage Sales Person</a>
                    <a href="#">Manage Mechanic</a>
                    <a href="#">Manage Customer</a>
                    <a href="#">Manage Goods</a>
                    <a href="#">Manage Services</a>
                </div>
            </div>
        </div>



        <!-- Transaction menu parent-->
        <div class="sidebar-menus-parent">
            <button @click="dropDownTriggerTransaction()" class="dropdown-btn"> 
                <img class="btn-icon" src="../assets/transaction.png" /> TRANSCATION
            </button>
            <!-- Transaction dropdown menus -->
            <div class="sidebar-menus">
                <div :class="dropDownTransaction()">
                    <a href="#">Quotation</a>
                    <a href="#">Service</a>
                    <a href="#">Cashier</a>
                </div>
            </div>
        </div>


        <!-- Report menu -->
        <div class="sidebar-menus-parent">
            <a href="#services"> <img class="btn-icon" src="../assets/file.png" /> REPORTS</a>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                isActiveTransaction: true,
                isActiveAdmin: true
            }
        },

        methods:{
            dropDownTriggerAdmin(){
                this.isActiveAdmin = !this.isActiveAdmin;
                this.dropDownAdmin();
            },
            dropDownTriggerTransaction(){
                this.isActiveTransaction = !this.isActiveTransaction;
                this.dropDownTransaction();
            },
            dropDownTransaction(){
                return this.isActiveTransaction ? "dropdown-container-block" : "dropdown-container-none" 
            },
            dropDownAdmin(){
                return this.isActiveAdmin ? "dropdown-container-block" : "dropdown-container-none" 
            },
            getIcon(icon){
                console.log("../assets/"+icon);
                return "../assets/"+icon;
            }
        },

        computed:{}
    }
    
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Poppins');
* {
font-family: 'Poppins';
}
/* Fixed sidenav, full height */
.sidenav {
height: 100%;
width: 220px;
position: fixed;
z-index: 1;
top: 0;
left: 0;
background-color: lightgray;
overflow-x: hidden;
padding-top: 60px;
}


/* Style the sidenav links and the dropdown button */
.sidenav a, .dropdown-btn {
padding: 6px 8px 6px 16px;
text-decoration: none;
color: black;
display: block;
border: none;
background: none;
width:100%;
text-align: left;
cursor: pointer;
outline: none;
}

/* Parent menus */
.sidebar-menus-parent{
    margin-top: 15px;
    font-size: 14px;
}

/* Dropdown menus */
.sidebar-menus{
    font-size: 12.5px;
    padding-left: 30px;
}

/* On mouse-over */
.sidenav a:hover, .dropdown-btn:hover {
background: gray;
color: white;
}

/* Main content */
.main {
margin-left: 200px; /* Same as the width of the sidenav */
font-size: 20px; /* Increased text to enable scrolling */
padding: 0px 10px;
}

/* Add an active class to the active dropdown button */
.active {
background-color: green;
color: white;
}

/* Dropdown container (hidden by default). Optional: add a lighter background color and some left padding to change the design of the dropdown content */
.dropdown-container-none {
display: none;
}

.dropdown-container-block {
display: block;
}

.btn-icon {
    height: 100%;
    width: 25px;
}

.menus-icon {
    height: 15px;
    width: 15;
}


</style>