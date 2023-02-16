export default () => ({



  menus: [

    {
      id: 2,
      isActive: true,
      canAccess: true,
      hasChild: true,
      parentTitle: "Admin",
      icn: "fa-user-tie",
      childMenus: [
        {
          id: 1,
          title: "Manage User",
          href: "/admin/manageAppUser",
          active: false,
          key: "admin1",
          icon: "fa-users-gear",
          access: ["ADMIN"]
        },

        {
          id: 2,
          title: "Manage Customer",
          href: "/admin/manageCustomer",
          active: false,
          key: "admin2",
          icon: "fa-people-arrows",
          access: ["ADMIN"]
        },
        {
          id: 3,
          title: "Manage Goods",
          href: "/admin/manageGoods",
          active: false,
          key: "admin3",
          icon: "fa-parachute-box",
          access: ["ADMIN"]
        },
        {
          id: 4,
          title: "Manage Service Item",
          href: "/admin/manageServiceItem",
          active: false,
          key: "admin4",
          icon: "fa-gears",
          access: ["ADMIN"]
        },
        {
          id: 5,
          title: "Manage User Role",
          href: "/admin/managerole",
          active: false,
          key: "admin5",
          icon: "fa-briefcase",
          access: ["ADMIN"]
        },
      ],
    },
    {
      id: 3,
      isActive: true,
      canAccess: true,
      hasChild: true,
      parentTitle: "Transaction",
      icn: "fa-exchange",
      childMenus: [
        {
          id: 1,
          title: "Quotation",
          href: "/transaction/quotation",
          active: false,
          key: "t1",
          icon: "fa-comment-dollar",
          access: ["ADMIN", "SALESPERSON"]
        },
        {
          id: 2,
          title: "Service",
          href: "/transaction/service",
          active: false,
          key: "t2",
          icon: "fa-cog",
          access: ["ADMIN", "MECHANIC"]
        },
        {
          id: 3,
          title: "Cashier",
          href: "/transaction/cashier",
          active: false,
          key: "t3",
          icon: "fa-usd",
          access: ["ADMIN", "CASHIER"]
        },
      ],
    }

  ],

});
