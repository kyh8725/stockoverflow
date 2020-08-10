import { GET_STOCKSOWNED } from "../actions/types";

const initialState = {
  stocks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_STOCKSOWNED:
      return {
        stocks: action.stocks,
      };
    default:
      return state;
  }
}
