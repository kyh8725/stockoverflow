import React, { Component } from "react";
import axios from "axios";

export default class SellOrder extends Component {
  state = {
    symbol: "",
    price: 0,
    stock: {},
    id: "",
    stocks: [],
    user: ""
  };

  componentDidMount() {
    this.setState({
      symbol: this.props.symbol,
      user: this.props.user,
      stocks: this.props.stocks,
      id: this.props.id
    });
    axios.get(`/stocks/${this.props.user}/${this.props.id}`).then(response => {
      this.setState({ stock: response.data[0] });
    });
  }

  isMarketOpen = () => {
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

  setPrice = event => {
    this.setState({ price: event.target.value });
  };

  sellStock = event => {
    event.preventDefault();
    axios.get(`/stocks/${this.state.user}/${this.state.id}`).then(response => {
      this.setState({ stock: response.data[0] });
      const stock = response.data[0];
      // -------------------- SELL ORDER -------------------------
      axios
        .post("/orders/sellOrder", {
          symbol: stock.symbol,
          quantity: stock.quantity,
          price: this.state.price,
          holder: this.state.user,
          stockId: this.state.id
        })
        .then(response => {
          this.props.getAccountInfo(this.state.user);
        });
    });
    this.props.closeModal();
  };

  render() {
    const stock = JSON.parse(
      localStorage.getItem(`currentStock${this.props.symbol}`)
    );

    return (
      <>
        {Object.keys(this.state.stock).length !== 0 && (
          <>
            <h2 className="trade__title"> Sell Stock</h2>
            <h4 style={{ color: this.isMarketOpenColor() }}>
              {this.isMarketOpen()}
            </h4>
            <h4> Stock: {stock.symbol.toLowerCase()}</h4>
            <h4> Current Price: $ {stock.latestPrice}</h4>
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
