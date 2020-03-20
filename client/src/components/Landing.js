import React, { Component } from "react";
import Modal from "react-responsive-modal";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";

export default class Landing extends Component {
  state = {
    open: false,
    open2: false
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };
  onOpenModal2 = () => {
    this.setState({ open2: true });
  };
  onCloseModal = () => {
    this.setState({ open: false, open2: false });
  };

  render() {
    const { open, open2 } = this.state;
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
              </article>
            </div>
          )}
          {this.props.loggedIn && (
            <div className="landing__content">
              <div className="landing__header">
                Welcome {localStorage.getItem("userLogin")}
              </div>
              <article className="landing__text">
                <a href="https://ncov2019.live/data">COVID-19 Status</a>
              </article>
            </div>
          )}
          <div className="landing__btnWrap">
            {!this.props.loggedIn && (
              <>
                <button
                  onClick={this.onOpenModal2}
                  className="btn btn-primary"
                  id="signupbtn"
                >
                  Sign Up
                </button>
                <button
                  onClick={this.onOpenModal}
                  className="btn btn-success"
                  id="loginbtn"
                >
                  Log in
                </button>
              </>
            )}
            {this.props.loggedIn && (
              <>
                <Link to="/account">
                  <button className="btn btn-primary">
                    Go to your Account
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
        <Modal open={open2} onClose={this.onCloseModal}>
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
