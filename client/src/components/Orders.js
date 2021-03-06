import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import { connect } from "react-redux";
import { getOrders, getCash } from "../actions/getOrders";
import PropTypes from "prop-types";
import axios from "axios";

class Orders extends Component {
  state = {
    cash: 0,
    orders: [],
    user: "",
    processing: false,
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  async componentDidMount() {
    await this.setState({ user: sessionStorage.getItem("user") });
    await this.props.getOrders();
    await this.props.getCash();
  }

  getDate = (time) => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  };

  cancelHandler = (event) => {
    axios.put(`/orders/settle/${event.target.id}`).then((response) => {
      this.props.getOrders();
    });
  };

  processOrders = () => {
    this.props.orders.forEach((orderF) => {
      const iex_url = process.env.REACT_APP_iex_url;
      const iex_token = process.env.REACT_APP_iex_token;
      axios
        .get(`${iex_url}${orderF.symbol}/quote${iex_token}`)
        .then((response) => {
          let currentPrice = response.data.latestPrice;

          //-------------------------------PROCESSING BUY STOCK ------------------------------

          if (
            response.data.isUSMarketOpen &&
            response.data.latestPrice <= orderF.price &&
            orderF.buy &&
            !orderF.sell
          ) {
            //-------------- NEW STOCK -----------when asking price is higher than current market price
            //------------------------------------and order status 'buy' = true
            axios
              .post("/stocks/buy", {
                symbol: orderF.symbol,
                quantity: orderF.quantity,
                price: response.data.latestPrice,
                holder: this.state.user,
                orderId: Number(orderF.id),
              })
              .then((response) => {
                // set the status buy = false.
                axios.put(`/orders/settle/${orderF.id}`).then((response) => {
                  // update the order db after buy stock compeletion
                  this.props.getOrders();
                  // update the cash balance of the user
                  axios
                    .put("/users/trade/sell", {
                      username: this.state.user,
                      cash: this.props.cash - orderF.quantity * currentPrice,
                    })
                    .then((response) => {});
                });
              });
            //-------------------------------PROCESSING SELL STOCK ------------------------------
          } else if (
            response.data.isUSMarketOpen &&
            response.data.latestPrice >= orderF.price &&
            !orderF.buy &&
            orderF.sell
          ) {
            // settle order
            axios.put(`/orders/settle/${orderF.id}`).then((response) => {
              //get updated order from db
              this.props.getOrders();
              // delete the stock sold from db
              axios
                .delete(`/stocks/sell/${orderF.stockId}`)
                .then((response) => {
                  // update cash balance
                  axios
                    .put(`/users/trade/sell`, {
                      username: this.state.user,
                      cash: this.props.cash + orderF.quantity * currentPrice,
                    })
                    .then((response) => {});
                });
            });
          }
        });
    });
  };

  renderOrders = () => {
    // eslint-disable-next-line
    const order = this.props.orders.map((order) => {
      let net = 0;
      if (order.buy === 1 || order.sell === 1) {
        net += order.price * order.quantity;
        return (
          <div className="account__single" key={uuidv4()}>
            <h3 className="account__single-date">
              {this.getDate(order.orderDate)}
            </h3>
            <h3 className="account__single-stock">
              {order.symbol.toLowerCase()}
            </h3>
            <h3 className="account__single-price">${order.price}</h3>
            <h3 className="account__single-quantity">{order.quantity}</h3>
            <h3 className="account__single-status">
              {order.buy ? "Buy" : "Sell"}
            </h3>
            <h3 className="account__single-net">${net.toFixed(2)}</h3>
            <button
              className="btn btn-danger"
              id={order.id}
              onClick={this.cancelHandler}
            >
              Cancel
            </button>
          </div>
        );
      }
    });
    return order;
  };

  render() {
    console.log(this.props.cash);
    console.log(this.props.orders);
    return (
      <>
        <div className="account__wrapper">
          <div className="account">
            <h2>Orders</h2>
            <div className="account__title">
              <h3 className="account__date">Order Date</h3>
              <h3 className="account__stock"> Stock </h3>
              <h3 className="account__price"> Price </h3>
              <h3 className="account__quantity"> Qty </h3>
              <h3 className="account__status">B/S</h3>
              <h3 className="account__net"> Net</h3>
              <h3 className="account__buttonPlace">{}</h3>
            </div>
            <div className="account__financialInfo">{this.renderOrders()}</div>
            <div className="account__processbtn">
              <button
                onClick={this.processOrders}
                className="btn btn-outline-success"
              >
                Process Orders
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Orders.propTypes = {
  getOrders: PropTypes.func.isRequired,
  getStocks: PropTypes.func.isRequired,
  getCash: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  stocks: PropTypes.array.isRequired,
  cash: PropTypes.number.isRequired,
};

Orders.propTypes = {
  getOrders: PropTypes.func.isRequired,
  getCash: PropTypes.func.isRequired,
  orders: PropTypes.array.isRequired,
  cash: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  orders: state.orders.orders,
  cash: state.cash.cash,
});

export default connect(mapStateToProps, { getOrders, getCash })(Orders);
