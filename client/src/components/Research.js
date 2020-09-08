import React, { Component } from "react";
import StockCard from "./StockCard";
import NewsCard from "./NewsCard";
import axios from "axios";

export default class Research extends Component {
  state = {
    stock: {},
    news: [],
    orders: [],
    cash: 0,
    labels: [],
    data: [],
    symbol: "",
  };

  componentDidMount() {
    this.setState({
      cash: this.props.cash,
      orders: this.props.orders,
    });
    this.searchStock("googl");
  }

  getNews = (symbol) => {
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    axios
      .get(`${iex_url}${symbol}/news/last/1${iex_token}`)
      .then((response) => {
        this.setState({ news: response.data });
      });
  };

  getStock = (symbol) => {
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    axios.get(`${iex_url}${symbol}/quote${iex_token}`).then((response) => {
      this.setState({ stock: response.data });
    });
  };

  searchHandler = (event) => {
    event.preventDefault();
    if (event.target.stockSearch.value !== "") {
      this.searchStock(event.target.stockSearch.value);
    } else {
      window.alert("please type stock symbol");
    }
  };

  processChartData = (symbol) => {
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    axios.get(`${iex_url}${symbol}/chart/5d${iex_token}`).then((response) => {
      const chartLabels = [];
      const chartData = [];
      response.data.forEach((data) => {
        chartLabels.push(data.label);
        chartData.push(data.close);
      });
      this.setState({ labels: chartLabels, data: chartData });
      localStorage.setItem("labels", JSON.stringify(chartLabels));
      localStorage.setItem("data", JSON.stringify(chartData));
    });
  };

  searchStock = (symbol) => {
    this.getStock(symbol);
    this.getNews(symbol);
    this.processChartData(symbol);
  };

  setSymbol = (event) => {
    this.setState({ symbol: event.target.value });
  };

  render() {
    return (
      <>
        <div className="research">
          <div className="research__form-wrap">
            <form
              className="form-inline my-2 my-lg-0"
              onSubmit={this.searchHandler}
            >
              <input
                className="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                id="nav-searchInput"
                name="stockSearch"
              />

              <button
                className="btn btn-outline-success my-2 my-sm-0"
                type="submit"
                id="nav-searchButton"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        {Object.keys(this.state.stock).length !== 0 &&
          this.state.news.length !== 0 &&
          this.state.data.length !== 0 &&
          this.state.labels.length !== 0 && (
            <>
              <StockCard
                symbol={this.state.symbol}
                data={this.state.data}
                labels={this.state.labels}
                cash={this.state.cash}
                orders={this.state.orders}
                stock={this.state.stock}
                getAccountInfo={this.props.getAccountInfo}
              />
              <NewsCard news={this.state.news} />
            </>
          )}
      </>
    );
  }
}
