let currentDate = new Date().toJSON().slice(0, 10);

export const state = () => ({
  serviceList: [
    {
      serviceId: 1,
      serviceNumber: "T021390-89412j-2143213",
      dateTrans: currentDate,
    },
  ],

  serviceItemsList: [
    {
      serviceId: 1,
      serviceName: "Change Oil",
      unit: "2hr",
      cost: 50,
      qty: 1,
    },
    {
      serviceId: 2,
      serviceName: "FI Cleaning",
      unit: "3hr",
      cost: 500,
      qty: 1,
    },
    {
      serviceId: 3,
      serviceName: "Overhaul",
      unit: "1Day",
      cost: 1000,
      qty: 1,
    },
  ],
});

export const getters = () => ({});

export const mutations = () => ({});

export const actions = () => ({});
