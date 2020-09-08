import React, { Component } from "react";
import Modal from "react-responsive-modal";
import SellOrder from "./SellOrder";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

class Account extends Component {
  state = {
    cash: 0,
    currentPrices: [],
    stocks: [],
    changes: [],
    symbols: "",
    open: false,
    id: "",
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
      "Dec",
    ],
  };

  async componentDidMount() {
    await this.setState({ user: sessionStorage.getItem("user") });
    await this.getStocksOwned(this.state.user);
    this.getCash(this.state.user);
  }

  getCash = (username) => {
    axios.get(`/users/${username}`).then((response) => {
      if (username === response.data[0].username) {
        this.setState({ cash: response.data[0].cash });
      }
    });
  };

  getStocksOwned = (username) => {
    axios.get(`/stocks/${username}`).then((response) => {
      this.setState(
        { stocks: response.data },
        response.data.forEach((stock) => {
          this.getCurrentPrice(stock.symbol);
        })
      );
    });
  };

  getCurrentPrice = (symbol) => {
    let tempPrices = this.state.currentPrices;
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    axios.get(`${iex_url}${symbol}/quote${iex_token}`).then((response) => {
      tempPrices.push(response.data);
      this.setState({ currentPrices: tempPrices });
    });
  };

  getPrice = (symbol) => {
    return this.state.currentPrices.filter(
      (stock) => stock.symbol.toLowerCase() === symbol.toLowerCase()
    );
  };

  getOrders = (username) => {
    axios.get(`/orders/${username}`).then((response) => {
      const activeOrder = response.data.filter(
        (order) => order.sell !== 0 || order.buy !== 0
      );
      this.setState({ orders: activeOrder });
      localStorage.setItem("orders", JSON.stringify(activeOrder));
    });
  };

  onOpenModal = (event) => {
    this.setState(
      { id: event.target.id, symbol: event.target.value },
      this.setState({ open: true })
    );
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getDate = (time) => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  };

  renderStocks = (stock) => {
    let current = this.getPrice(stock.symbol);
    let price = 0;
    let change = 0;
    if (current !== undefined && current[0] !== undefined) {
      price = current[0].latestPrice;
      change = price - stock.price;
    }

    return (
      <div className="account__single" key={uuidv4()}>
        <h3 className="account__single-date">
          {this.getDate(stock.tradeDate)}
        </h3>
        <h3 className="account__single-stock">{stock.symbol}</h3>
        <h3 className="account__single-price">${price.toFixed(2)}</h3>
        <h3 className="account__single-cost">${stock.price.toFixed(2)}</h3>
        <h3 className="account__single-quantity">{stock.quantity}</h3>
        <h3 className="account__single-net">
          ${(stock.quantity * stock.price).toFixed(2)}
        </h3>
        <h3
          className="account__single-gainLose"
          style={change < 0 ? { color: "red" } : { color: "green" }}
        >
          $ {(stock.quantity * change).toFixed(2)}
        </h3>
        <div className="account__sellbtn">
          <button
            onClick={this.onOpenModal}
            className="btn btn-danger"
            id={stock.id}
            value={stock.symbol}
          >
            Sell
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { open } = this.state;
    let changeTotal = 0;
    let investment = 0;
    this.state.stocks.forEach((stock) => {
      let current = this.getPrice(stock.symbol);
      let price = 0;
      let change = 0;
      if (current !== undefined && current[0] !== undefined) {
        price = current[0].latestPrice;
        change = (price - stock.price) * stock.quantity;
        investment += price * stock.quantity;
      }
      changeTotal += change;
    });
    return (
      <>
        <section className="account">
          <h2 className="account__holder">Account: {this.state.user}</h2>
          <h2 className="account__balance">
            Cash: $ {this.state.cash.toFixed(2)}
          </h2>
          <h2 className="account__balance">
            Investment: $ {investment.toFixed(2)}
          </h2>
          <h2 className="account__balance">
            Balance: $ {(this.state.cash + investment).toFixed(2)}
          </h2>
          <div className="account__title">
            <h3 className="account__date">Trade Date</h3>
            <h3 className="account__stock"> Stock </h3>
            <h3 className="account__price"> Price </h3>
            <h3 className="account__cost"> Cost </h3>
            <h3 className="account__quantity"> Qty </h3>
            <h3 className="account__net"> Net</h3>
            <h3 className="account__gainLose"> Gain/Lose</h3>
            <h3 className="account__sellbtn">{}</h3>
          </div>
          <div className="account__financialInfo">
            {this.state.stocks.map((stock) => {
              return this.renderStocks(stock);
            })}
          </div>
          <div className="account__total">
            <h4
              className="acccount__total-change"
              style={changeTotal < 0 ? { color: "red" } : { color: "green" }}
            >
              Change: $ {changeTotal.toFixed(2)}
            </h4>
          </div>
          <div className="account__updateAccount">
            <button
              onClick={this.updateAccount}
              className="btn btn-outline-success"
            >
              Update Account
            </button>
          </div>
        </section>
        {this.state.id !== "" && this.state.symbol !== "" && (
          <Modal open={open} onClose={this.onCloseModal}>
            <SellOrder
              user={this.state.user}
              stocks={this.state.stocks}
              id={this.state.id}
              cash={this.state.cash}
              closeModal={this.onCloseModal}
            />
          </Modal>
        )}
      </>
    );
  }
}
export default Account;
