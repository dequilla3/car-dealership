import axios from "axios";

export default {
    async loadQuotes({ commit }) {
        return await axios({
            method: "GET",
            url: `${this.$axios.defaults.baseURL}/quotations`,
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then(res => {

            let quotesList = res.data;
            let curList = [];

            quotesList.forEach(function (val) {
                //filter duplicates
                let duplicates = curList.filter(function (filteredVal) {
                    //get duplicates using id
                    return val.quotation_id === filteredVal.quotation_id;
                });

                // if no duplicates push to currlist
                if (duplicates.length < 1) {
                    curList.push(val);
                }
            });

            commit("SET_QUOTES", curList);
            return res;
        });
    },


    async loadQuoteLineByID({ commit }, { quoteId }) {
        return await axios({
            method: "GET",
            url: `${this.$axios.defaults.baseURL}/quotation/view/${quoteId}`,
            headers: {
                Authorization: `Bearer ${localStorage.token}`,
            },
        }).then(res => {
            commit("SET_QUOTES_LINES", res.data);
            return res;
        });
    }
};