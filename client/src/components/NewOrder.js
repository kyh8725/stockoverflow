import React, { Component } from "react";
import { connect } from "react-redux";
import { getOrders } from "../actions/getOrders";
import axios from "axios";

class NewOrder extends Component {
  state = {
    price: 0,
    quantity: 0,
    cash: 0,
    user: "",
    orders: [],
  };

  async componentDidMount() {
    await this.setState({ user: sessionStorage.getItem("user") });
    await this.props.getOrders();
    this.setState({
      cash: this.props.cash,
    });
  }

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
    let orderTotal = 0;
    this.props.orders.forEach((order) => {
      orderTotal += order.price * order.quantity;
    });
    let tempCash = this.props.cash - orderTotal;
    // --------- tempCash is cash balance - total amount of unsettled orders
    if (tempCash < this.state.price * this.state.quantity) {
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
const mapStateToProps = (state) => ({
  orders: state.orders.orders,
});
export default connect(mapStateToProps, { getOrders })(NewOrder);
