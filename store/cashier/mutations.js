export default {
    SET_BILLINGS(state, data) {
        state.billings = data;
    },

    SET_HEADER(state, data) {
        state.header = data;
    },

    SET_SERVICE_LINE(state, data) {
        state.serviceLine = data;
    },

    SET_QUOTE_LINE(state, data) {
        state.quoteLine = data;
    }
};