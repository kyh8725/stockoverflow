import React, { Component } from "react";
import Modal from "react-responsive-modal";
import SellOrder from "./SellOrder";
import { v4 as uuidv4 } from "uuid";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getBalance } from "../actions/balanceActions";
import { getStocksOwned } from "../actions/stockActions";
import axios from "axios";

class Account extends Component {
  state = {
    update: false,
    symbol: "",
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

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
    this.props.getStocksOwned(this.props.user);
    this.props.getBalance(this.props.user);
  }

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

  renderStocks = () => {
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    let stockArray = [];
    const stock = this.props.stocks.map((stock) => {
      axios
        .get(`${iex_url}${stock.symbol}/quote${iex_token}`)
        .then((response) => {
          let obj = { [stock.symbol]: response.data.latestPrice };
          stockArray.push(obj);
        });
      const change = stock.price * stock.quantity;

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

    return (
      <>
        <section className="account">
          <h2 className="account__holder">Account: {this.state.user}</h2>
          <h2 className="account__balance">Cash: $ {this.props.cash}</h2>
          <h2 className="account__balance">
            Investment: $ {(bookCost + changeTotal).toFixed(2)}
          </h2>
          <h2 className="account__balance">
            Balance: $ {(this.props.cash + bookCost + changeTotal).toFixed(2)}
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
              stocks={this.props.stocks}
              id={this.state.id}
              cash={this.props.cash}
              closeModal={this.onCloseModal}
              getAccountInfo={this.props.getAccountInfo}
            />
          </Modal>
        )}
      </>
    );
  }
}

Account.propTypes = {
  getStocksOwned: PropTypes.func.isRequired,
  stocks: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  cash: state.cash.cash,
  stocks: state.stocks.stocks,
});
export default connect(mapStateToProps, { getBalance, getStocksOwned })(
  Account
);
