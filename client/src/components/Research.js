import React, { Component } from "react";
import StockCard from "./StockCard";
import NewsCard from "./NewsCard";
import axios from "axios";

export default class Research extends Component {
  state = {
    stock: {},
    news: [],
    cash: 0,
    labels: [],
    data: [],
    symbol: "",
  };

  async componentDidMount() {
    await this.searchStock("googl");
    await this.setState({ user: sessionStorage.getItem("user") });
    this.getCash(this.state.user);
  }

  getNews = (symbol) => {
    const iex_url = process.env.REACT_APP_iex_url;
    const iex_token = process.env.REACT_APP_iex_token;
    axios
      .get(`${iex_url}${symbol}/news/last/6${iex_token}`)
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

  getCash = (username) => {
    axios.get(`/users/${username}`).then((response) => {
      if (username === response.data[0].username) {
        this.setState({ cash: response.data[0].cash });
      }
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
                stock={this.state.stock}
              />
              <NewsCard news={this.state.news} />
            </>
          )}
      </>
    );
  }
}
