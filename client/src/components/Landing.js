import React, { Component } from "react";
import Modal from "react-responsive-modal";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";

export default class Landing extends Component {
  state = {
    open: false,
    openS: false,
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };
  onOpenModal2 = () => {
    this.setState({ openS: true });
  };
  onCloseModal = () => {
    this.setState({ open: false, openS: false });
  };

  render() {
    const { open, openS } = this.state;
    return (
      <>
        <main className="landing">
          {!this.props.loggedIn && (
            <div className="landing__content">
              <div className="landing__header">Start Trading Risk-Free</div>
              <article className="landing__text">
                Join now to get $100,000 virtual cash to start trading. Compete
                with other traders, and put your trading skills to the test. We
                provide near real-time stock quotes to simulate real-world stock
                market. All stocks in NYSE and NASDAQ are available for trading.
                <br />
                <br />
                Tech used: HTML5, CSS3, SASS, React.js, Node.js, Express.js,
                Bootstrap, MySQL, Knex, Bookshelf.
              </article>
            </div>
          )}
          {this.props.loggedIn && (
            <div className="landing__content">
              <div className="landing__header">
                Welcome {localStorage.getItem("userLogin")}
              </div>
              <article className="landing__text">
                Comments
                <br />
                <br /> Orders are processed only when the market is open. For
                testing purposes, the condition is commented out for now in
                Orders.js -processOrders function. If the price is right orders
                will get processed.
                <br />
                <br />
                Overall, It was a great project to practice everything I learned
                in the past 3 months from HTML to MYSQL.
                <br />
                <br />
                <a
                  href="https://ncov2019.live/data"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  CHECK GLOBAL COVID-19 STATUS
                </a>
              </article>
            </div>
          )}
          <div className="landing__btnWrap">
            {!this.props.loggedIn && (
              <>
                <button
                  onClick={this.onOpenModal2}
                  className="btn btn-primary btn-lg"
                  id="signupbtn"
                >
                  Sign Up
                </button>
                <button
                  onClick={this.onOpenModal}
                  className="btn btn-success btn-lg"
                  id="loginbtn"
                >
                  Log in
                </button>
              </>
            )}
            {this.props.loggedIn && (
              <>
                <Link to="/account">
                  <button className="btn btn-secondary btn-lg" id="accountBtn">
                    Go to your Account
                  </button>
                </Link>
                <Link to="/orders">
                  <button className="btn btn-secondary btn-lg" id="orderBtn">
                    Check Orders
                  </button>
                </Link>
              </>
            )}
          </div>
        </main>
        <Modal open={open} onClose={this.onCloseModal}>
          <LogIn
            closeModal={this.onCloseModal}
            logIn={this.props.logIn}
            users={this.props.users}
            loggedIn={this.props.loggedIn}
          />
        </Modal>
        <Modal open={openS} onClose={this.onCloseModal}>
          <SignUp
            closeModal={this.onCloseModal}
            logIn={this.props.logIn}
            users={this.props.users}
            loggedIn={this.props.loggedIn}
          />
        </Modal>
      </>
    );
  }
}
