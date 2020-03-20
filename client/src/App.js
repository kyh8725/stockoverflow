import React, { Component } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import StockCard from "./components/StockCard";
import NewsCard from "./components/NewsCard";
import Landing from "./components/Landing";
import Account from "./components/Account";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

export default class App extends Component {
  state = {
    user: "",
    cash: 0,
    loggedIn: false,
    users: [],
    stocks: [],
    news: [],
    stock: {}
  };

  componentDidMount() {
    axios.get("/users").then(response => {
      this.setState({ users: response.data.map(user => user.username) });
    });
    sessionStorage.getItem("authToken")
      ? this.setState({
          loggedIn: true
        })
      : this.setState({
          loggedIn: false
        });
  }

  logIn = username => {
    localStorage.setItem("userLogin", username);
    this.setState(
      { loggedIn: true, user: username },
      this.getAccountInfo(username)
    );
  };

  logOut = () => {
    this.setState({ loggedIn: false });
    sessionStorage.removeItem("authToken");
  };

  getNews = symbol => {
    //const iex_token = process.env.iex_token;
    //const iex_url = process.env.iex_rul;
    const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    const iex_url = "https://cloud.iexapis.com/stable/stock/";
    axios.get(`${iex_url}${symbol}/news/last/1${iex_token}`).then(response => {
      this.setState({ news: response.data });
      localStorage.setItem("news", JSON.stringify(response.data));
    });
  };

  getStock = symbol => {
    //const iex_token = process.env.iex_token;
    //const iex_url = process.env.iex_rul;
    const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    const iex_url = "https://cloud.iexapis.com/stable/stock/";
    axios.get(`${iex_url}${symbol}/quote${iex_token}`).then(response => {
      this.setState({ stock: response.data });
      localStorage.setItem("stock", JSON.stringify(response.data));
    });
  };

  getBalance = username => {
    axios.get(`/users/${username}`).then(response => {
      this.setState({ cash: response.data[0].cash });
      localStorage.setItem("cash", response.data[0].cash);
    });
  };

  getStockOwned = username => {
    axios.get(`/stocks/${username}`).then(response => {
      this.setState({ stocks: response.data });
      response.data.forEach(stock => {
        const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
        const iex_url = "https://cloud.iexapis.com/stable/stock/";
        axios
          .get(`${iex_url}${stock.symbol}/quote${iex_token}`)
          .then(response => {
            localStorage.setItem(
              `currentPrice${stock.symbol}`,
              response.data.latestPrice
            );
          });
      });
      localStorage.setItem("stocks", JSON.stringify(response.data));
    });
  };

  getAccountInfo = username => {
    this.getStockOwned(username);
    this.getBalance(username);
  };

  render() {
    return (
      <>
        <Router>
          <Header
            getStock={this.getStock}
            getNews={this.getNews}
            loggedIn={this.state.loggedIn}
            logOut={this.logOut}
          />
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return (
                  <>
                    <Landing
                      logIn={this.logIn}
                      users={this.state.users}
                      loggedIn={this.state.loggedIn}
                    />
                  </>
                );
              }}
            />
            <Route
              path="/account"
              render={() => {
                return (
                  <>
                    <Account
                      user={this.state.user}
                      cash={this.state.cash}
                      stocks={this.state.stocks}
                    />
                  </>
                );
              }}
            />
            {/* <Route
              path="/search"
              render={() => {
                return (
                  <>
                    <StockCard
                      stock={this.state.stock}
                      getStock={this.getStock}
                    />
                    <NewsCard news={this.state.news} />
                  </>
                );
              }}
            /> */}
          </Switch>
          <Footer />
        </Router>
      </>
    );
  }
}
