import { GET_ORDERS, GET_STOCKS, GET_CASH, GET_USERS } from "../actions/types";

const initialState = {
  orders: [],
  stocks: [],
  cash: 0,
  users: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ORDERS:
      return { ...state, orders: action.payload };
    case GET_STOCKS:
      return { ...state, stocks: action.payload };
    case GET_CASH:
      return { ...state, cash: action.payload };
    case GET_USERS:
      return { ...state, users: action.payload };
    default:
      return state;
  }
}
