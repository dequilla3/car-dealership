export default {
    LOAD_SERVICE_ITEM(state, data) {
        state.serviceItemsList = data;
    },

    SET_SERVICE_LINE(state, data) {
        state.serviceTransactionLines = data;
    },

    SET_SERVICE_HEADER(state, data) {
        state.serviceHeader = data;
    },

    SET_SERVICES(state, data) {
        state.serviceList = data;
    }

};
