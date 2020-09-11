import { GET_ORDERS, GET_STOCKS, GET_CASH, GET_USERS } from "./types";
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

export const getStocks = () => (dispatch) => {
  axios.get(`/stocks/${sessionStorage.getItem("user")}`).then((response) => {
    dispatch({ type: GET_STOCKS, payload: response.data });
  });
};

export const getCash = () => (dispatch) => {
  axios.get(`/users/${sessionStorage.getItem("user")}`).then((response) => {
    dispatch({ type: GET_CASH, payload: response.data[0].cash });
  });
};

export const getUsers = () => (dispatch) => {
  axios.get("/users").then((response) => {
    const users = response.data.map((user) => user.username);
    dispatch({
      type: GET_USERS,
      payload: users,
    });
  });
};
