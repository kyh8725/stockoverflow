import React, { Component } from "react";
import StockCard from "./StockCard";
import NewsCard from "./NewsCard";
import axios from "axios";

export default class Research extends Component {
  state = {
    stock: {},
    news: []
  };

  componentDidMount() {}

  getNews = symbol => {
    //const iex_token = process.env.iex_token;
    //const iex_url = process.env.iex_rul;
    const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    const iex_url = "https://cloud.iexapis.com/stable/stock/";
    axios.get(`${iex_url}${symbol}/news/last/1${iex_token}`).then(response => {
      this.setState(
        { news: response.data },
        localStorage.setItem("news", JSON.stringify(response.data))
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
        { stock: response.data },
        localStorage.setItem("stock", JSON.stringify(response.data))
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
          this.state.news.length !== 0 && (
            <>
              <StockCard stock={this.state.stock} />
              <NewsCard news={this.state.news} />
            </>
          )}
      </div>
    );
  }
}
