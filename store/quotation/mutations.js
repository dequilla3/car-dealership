export default {
    SET_QUOTE_LINE(state, data) {
        state.quotationLineList = data;
    },

    SET_QUOTE_HEADER(state, data) {
        state.quoteHeader = data;
    },

    SET_QUOTES(state, data) {
        state.quotes = data;
    },

    SET_QUOTES_LINES(state, data) {
        state.quoteLines = data;
    }

};