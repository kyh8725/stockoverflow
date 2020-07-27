import axios from "axios";

const getOrders = (username) => {
  axios.get(`/orders/${username}`).then((response) => {
    const activeOrder = response.data.filter(
      (order) => order.sell !== 0 || order.buy !== 0
    );
    localStorage.setItem("orders", JSON.stringify(activeOrder));
  });
};

const getBalance = (username) => {
  axios.get(`/users/${username}`).then((response) => {
    localStorage.setItem("cash", response.data[0].cash);
  });
};

const getStockOwned = (username) => {
  axios.get(`/stocks/${username}`).then((response) => {
    response.data.forEach((stock) => {
      const iex_url = process.env.REACT_APP_iex_url;
      const iex_token = process.env.REACT_APP_iex_token;
      const URL = `${iex_url}${stock.symbol}/quote${iex_token}`;
      axios.get(URL).then((response) => {
        localStorage.setItem(
          `currentStock${stock.symbol}`,
          JSON.stringify(response.data)
        );
        localStorage.setItem(
          `currentPrice${stock.symbol}`,
          response.data.latestPrice
        );
      });
    });
    localStorage.setItem("stocks", JSON.stringify(response.data));
  });
};

export { getStockOwned, getBalance, getOrders };
