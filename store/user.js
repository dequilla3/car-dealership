let currentDate = new Date().toJSON().slice(0, 10);

export const state = () => ({
  userList: [
    {
      id: 1,
      name: "Test Data",
      contactNumber: "09123456789",
      address: "Surallah 3232323",
      dateCreated: currentDate,
      // _rowVariant: "info",
    },
    {
      id: 2,
      name: "Test Data II",
      contactNumber: "09123456789",
      address: "Koronadal",
      dateCreated: currentDate,
    },
    {
      id: 3,
      name: "Test Data II",
      contactNumber: "09123456789",
      address: "Koronadal",
      dateCreated: currentDate,
    },
  ],
});

export const getters = () => ({});

export const mutations = () => ({});

export const actions = () => ({});