let currentDate = new Date().toJSON().slice(0, 10);

export default () => ({
  serviceList: [
    {
      serviceId: 1,
      serviceNumber: "T021390-89412j-2143213",
      serial_number: "",
      dateTrans: currentDate,
    },
  ],

  serviceItemsList: [],
  serviceHeader: [],
  serviceTransactionLines: []


});
