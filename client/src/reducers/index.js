import { combineReducers } from "redux";
import balanceReducer from "./balanceReducer";
import stockReducer from "./stockReducer";

const allReducers = combineReducers({
  stocks: stockReducer,
  cash: balanceReducer,
});

export default allReducers;
