import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Header extends Component {
  state = {
    open: false,
    news: [],
    stock: {},
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link to="/" className="navbar-brand">
          StockOverflow
        </Link>

        {!this.props.loggedIn && (
          <div className="navbar navbar-expand-lg navbar-dark bg-dark">
            <Link to="/demo" className="navbar-brand">
              Demo
            </Link>
          </div>
        )}
        {this.props.loggedIn && (
          <>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/account">
                    Account<span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link" to="/orders">
                    Orders
                  </Link>
                </li>
                <li className="nav-item active">
                  <Link className="nav-link" to="/stocks">
                    Research
                  </Link>
                </li>

                <li className="nav-item active">
                  <Link className="nav-link" to="/" onClick={this.props.logOut}>
                    {this.props.loggedIn && "Logout"}
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
      </nav>
    );
  }
}
