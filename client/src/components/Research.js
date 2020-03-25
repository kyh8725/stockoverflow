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
    data: []
  };

  componentDidMount() {
    this.setState({ cash: this.props.cash, orders: this.props.orders });
    this.searchStock("googl");
  }

  getNews = symbol => {
    //const iex_token = process.env.iex_token;
    //const iex_url = process.env.iex_rul;
    const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    const iex_url = "https://cloud.iexapis.com/stable/stock/";
    axios.get(`${iex_url}${symbol}/news/last/1${iex_token}`).then(response => {
      this.setState(
        { news: response.data }
        // localStorage.setItem("news", JSON.stringify(response.data))
      );
    });
  };

  getStock = symbol => {
    //const iex_token = process.env.iex_token;
    //const iex_url = process.env.iex_rul;
    const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    const iex_url = "https://cloud.iexapis.com/stable/stock/";
    axios.get(`${iex_url}${symbol}/quote${iex_token}`).then(response => {
      this.setState(
        { stock: response.data }
        // localStorage.setItem("stock", JSON.stringify(response.data))
      );
    });
  };

  searchHandler = event => {
    event.preventDefault();
    if (event.target.stockSearch.value !== "") {
      this.searchStock(event.target.stockSearch.value);
    } else {
      window.alert("please type stock symbol");
    }
  };

  searchStock = symbol => {
    this.getStock(symbol);
    this.getNews(symbol);
    this.processChartData();
  };

  processChartData = () => {
    const responseData = [
      {
        date: "2020-03-17",
        open: 247.51,
        close: 252.86,
        high: 257.61,
        low: 238.4,
        volume: 81013965,
        uOpen: 247.51,
        uClose: 252.86,
        uHigh: 257.61,
        uLow: 238.4,
        uVolume: 81013965,
        change: 0,
        changePercent: 0,
        label: "Mar 17",
        changeOverTime: 0
      },
      {
        date: "2020-03-18",
        open: 239.77,
        close: 246.67,
        high: 250,
        low: 237.12,
        volume: 75058406,
        uOpen: 239.77,
        uClose: 246.67,
        uHigh: 250,
        uLow: 237.12,
        uVolume: 75058406,
        change: -6.19,
        changePercent: -2.448,
        label: "Mar 18",
        changeOverTime: -0.02448
      },
      {
        date: "2020-03-19",
        open: 247.39,
        close: 244.78,
        high: 252.84,
        low: 242.61,
        volume: 67964255,
        uOpen: 247.39,
        uClose: 244.78,
        uHigh: 252.84,
        uLow: 242.61,
        uVolume: 67964255,
        change: -1.89,
        changePercent: -0.7662,
        label: "Mar 19",
        changeOverTime: -0.031954
      },
      {
        date: "2020-03-20",
        open: 247.18,
        close: 229.24,
        high: 251.83,
        low: 228,
        volume: 100423346,
        uOpen: 247.18,
        uClose: 229.24,
        uHigh: 251.83,
        uLow: 228,
        uVolume: 100423346,
        change: -15.54,
        changePercent: -6.3486,
        label: "Mar 20",
        changeOverTime: -0.093411
      },
      {
        date: "2020-03-23",
        open: 228.08,
        close: 224.37,
        high: 228.5,
        low: 212.61,
        volume: 84188208,
        uOpen: 228.08,
        uClose: 224.37,
        uHigh: 228.5,
        uLow: 212.61,
        uVolume: 84188208,
        change: -4.87,
        changePercent: -2.1244,
        label: "Mar 23",
        changeOverTime: -0.112671
      }
    ];

    const chartLabels = [];
    const chartData = [];

    responseData.forEach(data => {
      chartLabels.push(data.label);
      chartData.push(data.close);
    });
    this.setState({ labels: chartLabels, data: chartData });
    localStorage.setItem("labels", JSON.stringify(chartLabels));
    localStorage.setItem("data", JSON.stringify(chartData));
    // const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    // const iex_url = "https://cloud.iexapis.com/stable/stock/";
    // axios
    //   .get(`${iex_url}${this.props.stock.symbol}/chart/5d${iex_token}`)
    //   .then(response => {

    //   });
  };

  render() {
    return (
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

        {Object.keys(this.state.stock).length !== 0 &&
          this.state.news.length !== 0 &&
          this.state.data.length !== 0 &&
          this.state.labels.length !== 0 && (
            <>
              <StockCard
                data={this.state.data}
                labels={this.state.labels}
                cash={this.state.cash}
                orders={this.state.orders}
                stock={this.state.stock}
                processChartData={this.processChartData}
                getAccountInfo={this.props.getAccountInfo}
              />
              <NewsCard news={this.state.news} />
            </>
          )}
      </div>
    );
  }
}
