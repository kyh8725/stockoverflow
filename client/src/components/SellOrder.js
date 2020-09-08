import React, { Component } from "react";
import axios from "axios";

export default class SellOrder extends Component {
  state = {
    price: 0,
    stock: {},
  };

  async componentDidMount() {
    await axios
      .get(`/stocks/${this.props.user}/${this.props.id}`)
      .then((response) => {
        this.setState({ stock: response.data[0] });
      });
  }

  isMarketOpen = () => {
    console.log(this.state.stock);
    if (this.state.stock.isUSMarketOpen) {
      return "Market is open";
    } else {
      return "Market is closed";
    }
  };

  isMarketOpenColor = () => {
    if (this.state.stock.isUSMarketOpen) {
      return "green";
    } else {
      return "red";
    }
  };

  setPrice = (event) => {
    this.setState({ price: event.target.value });
  };

  sellStock = (event) => {
    event.preventDefault();
    axios
      .get(`/stocks/${this.state.user}/${this.state.id}`)
      .then((response) => {
        this.setState({ stock: response.data[0] });
        const stock = response.data[0];
        // -------------------- SELL ORDER -------------------------
        axios
          .post("/orders/sellOrder", {
            symbol: stock.symbol,
            quantity: stock.quantity,
            price: this.state.price,
            holder: this.state.user,
            stockId: this.state.id,
          })
          .then((response) => {});
      });
    this.props.closeModal();
  };

  render() {
    return (
      <>
        {this.state.stock !== undefined && (
          <>
            <h2 className="trade__title"> Sell Stock</h2>
            <h4 style={{ color: this.isMarketOpenColor() }}>
              {this.isMarketOpen()}
            </h4>
            <h4> Stock: {this.state.stock.symbol}</h4>
            <h4>Current Price: ${}</h4>
            <form className="trade__form" onSubmit={this.sellStock}>
              <div className="trade__inputs">
                <input
                  name="trade__price"
                  onChange={this.setPrice}
                  className="trade__inputs-price"
                  type="text"
                  placeholder="price"
                />
                <input
                  name="trade__quantity"
                  className="trade__inputs-quantity"
                  type="text"
                  value={this.state.stock.quantity}
                  readOnly
                />
                <div className="trade__estimate">
                  <input
                    type="text"
                    value={`Estimate: $${(
                      this.state.price * this.state.stock.quantity
                    ).toFixed(2)}`}
                    readOnly
                  />
                </div>
              </div>

              <div className="trade__btns">
                <button className="btn btn-outline-danger">Sell</button>
              </div>
            </form>
          </>
        )}
      </>
    );
  }
}
