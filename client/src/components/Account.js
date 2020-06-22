import React, { Component } from "react";
import Modal from "react-responsive-modal";
import SellOrder from "./SellOrder";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default class Account extends Component {
  state = {
    update: false,
    symbol: "",
    open: false,
    id: "",
    stocks: [],
    orders: [],
    user: "",
    cash: 0,
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
      stocks: this.props.stocks,
      cash: this.props.cash
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.stocks !== this.props.stocks) {
      this.renderStocks();
    }
  }

  onOpenModal = event => {
    this.setState(
      { id: event.target.id, symbol: event.target.value },
      this.setState({ open: true })
    );
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  getDate = time => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  };

  updateAccount = () => {
    this.props.getAccountInfo(this.state.user);
    this.setState({ stocks: this.props.stocks, cash: this.props.cash });
  };

  getStockOwned = username => {
    axios.get(`/stocks/${username}`).then(response => {
      this.setState({ stocks: response.data });
      response.data.forEach(stock => {
        const iex_url = process.env.REACT_APP_iex_url;
        const iex_token = process.env.REACT_APP_iex_token;
        axios
          .get(`${iex_url}${stock.symbol}/quote${iex_token}`)
          .then(response => {
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

  renderStocks = () => {
    const stock = this.state.stocks.map(stock => {
      const change =
        (Number(localStorage.getItem(`currentPrice${stock.symbol}`)) -
          stock.price) *
        stock.quantity;
      return (
        <div className="account__single" key={uuidv4()}>
          <h3 className="account__single-date">
            {this.getDate(stock.tradeDate)}
          </h3>
          <h3 className="account__single-stock">
            {stock.symbol.toLowerCase()}
          </h3>
          <h3 className="account__single-price">
            ${JSON.parse(localStorage.getItem(`currentPrice${stock.symbol}`))}
          </h3>
          <h3 className="account__single-cost">$ {stock.price.toFixed(2)}</h3>
          <h3 className="account__single-quantity">{stock.quantity}</h3>
          <h3 className="account__single-net">
            $
            {(
              stock.quantity *
              JSON.parse(localStorage.getItem(`currentPrice${stock.symbol}`))
            ).toFixed(2)}
          </h3>
          <h3
            className="account__single-gainLose"
            style={change < 0 ? { color: "red" } : { color: "green" }}
          >
            $ {change.toFixed(2)}
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
    });
    return stock;
  };

  render() {
    const { open } = this.state;
    let changeTotal = 0;
    let bookCost = 0;
    this.state.stocks.forEach(stock => {
      const change =
        (Number(localStorage.getItem(`currentPrice${stock.symbol}`)) -
          stock.price) *
        stock.quantity;
      const cost = stock.price * stock.quantity;
      changeTotal += change;
      bookCost += cost;
    });

    return (
      <>
        <section className="account">
          <h2 className="account__holder">Account: {this.state.user}</h2>
          <h2 className="account__balance">Cash: $ {this.state.cash}</h2>
          <h2 className="account__balance">
            Investment: $ {(bookCost + changeTotal).toFixed(2)}
          </h2>
          <h2 className="account__balance">
            Balance: $ {(this.state.cash + bookCost + changeTotal).toFixed(2)}
          </h2>
          <div className="account__title">
            <h3 className="account__date">Trade Date</h3>
            <h3 className="account__stock"> Stock </h3>
            <h3 className="account__price"> Price </h3>
            <h3 className="account__cost"> Cost </h3>
            <h3 className="account__quantity"> Qty </h3>
            <h3 className="account__net"> Net</h3>
            <h3 className="account__gainLose"> Gain/Lose</h3>
            <h3 className="account__sellbtn"> {}</h3>
          </div>
          <div className="account__financialInfo">{this.renderStocks()}</div>
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
              symbol={this.state.symbol}
              user={this.state.user}
              stocks={this.state.stocks}
              id={this.state.id}
              cash={this.state.cash}
              closeModal={this.onCloseModal}
              getAccountInfo={this.props.getAccountInfo}
            />
          </Modal>
        )}
      </>
    );
  }
}
