import { GET_STOCKSOWNED } from "./types";
import axios from "axios";

export const getStocksOwned = (username) => (dispatch) => {
  axios.get(`/stocks/${username}`).then((response) => {
    dispatch({ type: GET_STOCKSOWNED, stocks: response.data });
  });
};
