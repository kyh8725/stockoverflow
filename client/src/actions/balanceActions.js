import { GET_BALANCE } from "./types";
import axios from "axios";

export const getBalance = (username) => (dispatch) => {
  axios.get(`/users/${username}`).then((response) => {
    dispatch({ type: GET_BALANCE, payload: response.data[0].cash });
  });
};
