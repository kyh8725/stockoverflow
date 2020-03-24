import React, { Component } from "react";
import axios from "axios";
export default class NewOrder extends Component {
  state = {
    price: 0,
    quantity: 0,
    cash: 0
  };

  componentDidMount() {
    this.setState({ cash: Number(localStorage.getItem("cash")) });
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

  setPrice = event => {
    this.setState({ price: event.target.value });
  };
  setQuantity = event => {
    this.setState({ quantity: event.target.value });
  };

  buyStock = event => {
    event.preventDefault();
    if (this.state.cash < this.state.price * this.state.quantity) {
      window.alert("not enough funds");
    } else {
      axios
        .post("/orders/neworder", {
          symbol: this.props.stock.symbol,
          price: this.state.price,
          quantity: this.state.quantity,
          holder: localStorage.getItem("userLogin")
        })
        .then(response => {
          this.props.getAccountInfo(localStorage.getItem("userLogin"));
        });
    }
    this.props.closeModal();
  };

  render() {
    return (
      <>
        <h2 className="trade__title"> Order </h2>
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
