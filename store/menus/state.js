export default () => ({
  transactionMenus: [
    {
      id: 1,
      title: "Quotation",
      href: "/transaction/quotation",
      active: false,
      key: "t1",
      icon: "fa-comment-dollar",
      access: ["admin", "sales person"]
    },
    {
      id: 2,
      title: "Service",
      href: "/transaction/service",
      active: false,
      key: "t2",
      icon: "fa-cog",
      access: ["admin", "mechanic"]
    },
    {
      id: 3,
      title: "Cashier",
      href: "/transaction/cashier",
      active: false,
      key: "t3",
      icon: "fa-usd",
      access: ["admin", "cashier"]
    },
  ],

  adminMenus: [
    {
      id: 1,
      title: "Manage User",
      href: "/admin/manageAppUser",
      active: false,
      key: "admin1",
      icon: "fa-users-gear",
      access: ["admin"]
    },

    {
      id: 4,
      title: "Manage Customer",
      href: "/admin/manageCustomer",
      active: false,
      key: "admin4",
      icon: "fa-people-arrows",
      access: ["admin"]
    },
    {
      id: 5,
      title: "Manage Goods",
      href: "/admin/manageGoods",
      active: false,
      key: "admin5",
      icon: "fa-parachute-box",
      access: ["admin"]
    },
    {
      id: 6,
      title: "Manage Service Item",
      href: "/admin/manageServiceItem",
      active: false,
      key: "admin6",
      icon: "fa-gears",
      access: ["admin"]
    },
    {
      id: 7,
      title: "Manage User Role",
      href: "/admin/managerole",
      active: false,
      key: "admin7",
      icon: "fa-briefcase",
      access: ["admin"]
    },
  ],
});
