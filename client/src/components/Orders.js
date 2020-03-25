import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default class Account extends Component {
  state = {
    orders: [],
    user: "",
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
      "Dec"
    ]
  };

  componentDidMount() {
    this.setState({
      user: this.props.user,
      orders: this.props.orders
    });
  }

  getDate = time => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  };

  cancelHandler = event => {
    axios.put(`/orders/settle/${event.target.id}`).then(response => {
      axios.get(`/orders/${this.state.user}`).then(response => {
        this.setState({ orders: response.data });
      });
    });
  };

  processOrders = () => {
    console.log("processOrder ran");
    this.state.orders.forEach(order => {
      const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
      const iex_url = "https://cloud.iexapis.com/stable/stock/";
      axios
        .get(`${iex_url}${order.symbol}/quote${iex_token}`)
        .then(response => {
          if (
            // response.data.isUSMarketOpen &&
            Number(response.data.latestPrice) <= Number(order.price) &&
            order.buy === 1
          ) {
            axios
              .post("/stocks/buy", {
                symbol: order.symbol,
                quantity: order.quantity,
                price: response.data.latestPrice,
                holder: this.state.user
              })
              .then(response => {
                axios.put(`/orders/settle/${order.id}`).then(response => {
                  axios.get(`/orders/${this.state.user}`).then(response => {
                    const activeOrder = response.data.filter(
                      order => order.buy !== 0
                    );
                    this.setState({ orders: activeOrder });
                  });
                });
              });
          }
        });
    });
    this.props.getAccountInfo(this.state.user);
  };

  renderOrders = () => {
    const order = this.state.orders.map(order => {
      let net = 0;
      if (order.buy === 1) {
        net += order.price * order.quantity;
        return (
          <div className="account__single" key={uuidv4()}>
            <h3 className="account__single-date">
              {this.getDate(order.orderDate)}
            </h3>
            <h3 className="account__single-stock">
              {order.symbol.toLowerCase()}
            </h3>
            <h3 className="account__single-price">${order.price.toFixed(2)}</h3>
            <h3 className="account__single-quantity">{order.quantity}</h3>
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
    return (
      <>
        <section className="account">
          <h2>Orders</h2>
          <div className="account__title">
            <h3 className="account__date">Order Date</h3>
            <h3 className="account__stock"> Stock </h3>
            <h3 className="account__price"> Price </h3>
            <h3 className="account__quantity"> Qty </h3>
            <h3 className="account__net"> Net</h3>
            <h3 className="account__buttonPlace">{}</h3>
          </div>
          <div className="account__financialInfo">{this.renderOrders()}</div>
          <div className="account__processbtn">
            <button
              onClick={this.processOrders}
              className="btn btn-outline-success"
            >
              Process Order
            </button>
          </div>
        </section>
      </>
    );
  }
}
