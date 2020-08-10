import { GET_BALANCE } from "../actions/types";

export default function (state = 0, action) {
  switch (action.type) {
    case GET_BALANCE:
      return {
        cash: action.payload,
      };
    default:
      return state;
  }
}
