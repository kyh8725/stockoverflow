import axios from "axios";

export const getOrders = () => {
  axios.get(`/orders/${sessionStorage.getItem("user")}`).then((response) => {
    const activeOrder = response.data.filter(
      (order) => order.sell !== 0 || order.buy !== 0
    );
    this.setState({ orders: activeOrder });
  });
};
