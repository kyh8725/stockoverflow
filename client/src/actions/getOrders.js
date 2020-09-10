import { GET_ORDERS } from "./types";
import axios from "axios";

export const getOrders = () => (dispatch) => {
  axios.get(`/orders/${sessionStorage.getItem("user")}`).then((response) => {
    const activeOrders = response.data.filter(
      (order) => order.sell !== 0 || order.buy !== 0
    );
    dispatch({
      type: GET_ORDERS,
      payload: activeOrders,
    });
  });
};
