import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

export default class Header extends Component {
  state = {
    users: [],
  };

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <NavLink to="/" className="navbar-brand">
          StockOverflow
        </NavLink>

        {!this.props.loggedIn && (
          <div className="navbar navbar-expand-lg navbar-dark bg-dark">
            <NavLink
              to="/demo"
              className="navbar-brand"
              activeClassName="active"
            >
              Demo
            </NavLink>
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
                <li>
                  <NavLink to="/account" activeClassName="active">
                    Account
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/orders" activeClassName="active">
                    Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/stocks" activeClassName="active">
                    Buy Stock
                  </NavLink>
                </li>

                <li>
                  <Link to="/" onClick={this.props.logOut}>
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
