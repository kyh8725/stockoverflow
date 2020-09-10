import React, { Component } from "react";
import axios from "axios";
export default class NewOrder extends Component {
  state = {
    price: 0,
    quantity: 0,
    cash: 0,
    tempCash: 0,
    user: "",
    orders: [],
  };

  async componentDidMount() {
    await this.setState({ user: sessionStorage.getItem("user") });
    await this.getOrders(this.state.user);
    this.setState({
      cash: this.props.cash,
      tempCash: this.getCashTemp(),
    });
  }

  getOrders = (username) => {
    axios.get(`/orders/${username}`).then((response) => {
      this.setState({ orders: response.data });
    });
  };
  isMarketOpen = () => {
    if (this.props.stock.isUSMarketOpen) {
      return "Market is open";
    } else {
      return "Market is closed";
    }
  };
  isMarketOpenColor = () => {
    if (this.props.stock.isUSMarketOpen) {
      return "green";
    } else {
      return "red";
    }
  };

  setPrice = (event) => {
    this.setState({ price: event.target.value });
  };
  setQuantity = (event) => {
    this.setState({ quantity: event.target.value });
  };

  buyStock = (event) => {
    event.preventDefault();
    if (
      // --------- tempCash is cash balance - total amount of unsettled orders
      this.state.tempCash <= this.state.price * this.state.quantity ||
      this.state.tempCash === 0
    ) {
      window.alert("not enough funds");
    } else {
      // -------------------- BUY ORDER -------------------------
      axios
        .post("/orders/buyOrder", {
          symbol: this.props.stock.symbol,
          price: this.state.price,
          quantity: this.state.quantity,
          holder: this.state.user,
        })
        .then((response) => {});
      window.alert(
        `Order successfully placed. 
           You can go to Orders to process your orders`
      );
    }
    this.props.closeModal();
  };

  getCashTemp = () => {
    let orderTotal = 0;
    this.state.orders.forEach((order) => {
      orderTotal += order.price * order.quantity;
    });
    return this.props.cash - orderTotal;
  };

  render() {
    return (
      <>
        <h2 className="trade__title"> Buy Stock </h2>
        <h4 style={{ color: this.isMarketOpenColor() }}>
          {this.isMarketOpen()}
        </h4>
        <h4> Stock: {this.props.stock.symbol}</h4>
        <h4> Current Price: $ {this.props.stock.latestPrice}</h4>
        <form className="trade__form">
          <div className="trade__inputs">
            <input
              onChange={this.setPrice}
              className="trade__inputs-price"
              type="text"
              placeholder="price"
            />
            <input
              onChange={this.setQuantity}
              className="trade__inputs-quantity"
              type="text"
              placeholder="quantity"
            />
            <div className="trade__estimate">
              <input
                type="text"
                value={`Estimate: $${(
                  this.state.price * this.state.quantity
                ).toFixed(2)}`}
                readOnly
              />
            </div>
          </div>

          <div className="trade__btns">
            <button onClick={this.buyStock} className="btn btn-outline-success">
              BUY
            </button>
          </div>
        </form>
      </>
    );
  }
}
