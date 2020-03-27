import React, { Component } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Orders from "./components/Orders";
import Landing from "./components/Landing";
import Account from "./components/Account";
import Research from "./components/Research";
import Demo from "./components/Demo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

export default class App extends Component {
  state = {
    user: "",
    cash: 0,
    loggedIn: false,
    users: [],
    stocks: [],
    orders: []
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
    this.setState({ loggedIn: true, user: username });
    this.getAccountInfo(username);
  };

  logOut = () => {
    this.setState({ loggedIn: false });
    sessionStorage.removeItem("authToken");
    localStorage.clear();
  };

  getOrders = username => {
    axios.get(`/orders/${username}`).then(response => {
      const activeOrder = response.data.filter(
        order => order.sell !== 0 || order.buy !== 0
      );
      this.setState({ orders: activeOrder });
      localStorage.setItem("orders", JSON.stringify(activeOrder));
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

        // for testing sandbox api
        // const iex_url = "https://sandbox.iexapis.com/stable/stock/";
        //const iex_token = "?token=Tsk_cbf0ed0fd04041a3906c8317da2bfe12";
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

  getAccountInfo = username => {
    this.getStockOwned(username);
    this.getBalance(username);
    this.getOrders(username);
  };

  render() {
    return (
      <>
        <Router>
          <Header
            searchStock={this.searchStock}
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
                      getAccountInfo={this.getAccountInfo}
                      user={this.state.user}
                      cash={this.state.cash}
                      stocks={this.state.stocks}
                    />
                  </>
                );
              }}
            />
            <Route
              path="/orders"
              render={() => {
                return (
                  <>
                    <Orders
                      getAccountInfo={this.getAccountInfo}
                      stocks={this.state.stocks}
                      user={this.state.user}
                      orders={this.state.orders}
                    />
                  </>
                );
              }}
            />
            <Route
              path="/stocks"
              render={() => {
                if (this.state.cash !== 0) {
                  return (
                    <>
                      <Research
                        cash={this.state.cash}
                        getAccountInfo={this.getAccountInfo}
                        orders={this.state.orders}
                      />
                    </>
                  );
                }
              }}
            />
            <Route path="/demo" component={Demo} />
          </Switch>
          <Footer />
        </Router>
      </>
    );
  }
}
