let currentDate = new Date().toJSON().slice(0, 10);

export default () => ({
  serviceList: [
    {
      serviceId: 1,
      serviceNumber: "3135664TEST",
      serial_number: "MDJK-52145-561",
      customerName: "Test Customer",
      dateTrans: currentDate,
    },
  ],

  serviceItemsList: [],
  serviceHeader: [],
  serviceTransactionLines: [],

  //mock data (TODO: Update if done backend)
  serviceLines: [
    {
      serviceId: 1,
      service_name: "Test Service Name",
      unit: "per car",
      cost: 500,
      qty: 1,
    }, {
      serviceId: 2,
      service_name: "Change Oil",
      unit: "per car",
      cost: 300,
      qty: 1,
    }
  ]


});
