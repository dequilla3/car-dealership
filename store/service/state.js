let currentDate = new Date().toJSON().slice(0, 10);

export default () => ({
  serviceList: [],
  serviceLines: [],

  serviceItemsList: [],

  // for reports
  serviceHeader: [],
  serviceTransactionLines: [],
});
