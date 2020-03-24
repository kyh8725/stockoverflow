import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";

export default class Account extends Component {
  state = {
    stocks: [],
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

  getDate = time => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
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
          <h3 className="account__single-stock">{stock.symbol}</h3>
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
        </div>
      );
    });
    return stock;
  };

  render() {
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
        </section>
      </>
    );
  }
}
