import React, { Component } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Orders from "./components/Orders";
import Landing from "./components/Landing";
import Account from "./components/Account";
import Research from "./components/Research";
import Demo from "./components/Demo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { getUsers } from "./actions/getOrders";
import PropTypes from "prop-types";

class App extends Component {
  state = {
    user: "",
    loggedIn: false,
  };

  async componentDidMount() {
    await this.props.getUsers();

    if (
      sessionStorage.getItem("user") !== null &&
      sessionStorage.getItem("user").length !== 0
    ) {
      this.setState(
        { user: sessionStorage.getItem("user") },
        this.setState({ loggedIn: true })
      );
    }
  }

  logIn = (username) => {
    this.setState({ loggedIn: true, user: username });
  };

  logOut = () => {
    this.setState({ loggedIn: false });
    sessionStorage.clear();
  };

  render() {
    return (
      <>
        <Router>
          <Header loggedIn={this.state.loggedIn} logOut={this.logOut} />
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return (
                  <>
                    <Landing
                      logIn={this.logIn}
                      users={this.props.users}
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
                    <Account user={this.state.user} />
                  </>
                );
              }}
            />
            <Route
              path="/orders"
              render={() => {
                return (
                  <>
                    <Orders user={this.state.user} />
                  </>
                );
              }}
            />
            <Route
              path="/stocks"
              render={() => {
                return (
                  <>
                    <Research />
                  </>
                );
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

App.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users.users,
});

export default connect(mapStateToProps, { getUsers })(App);
