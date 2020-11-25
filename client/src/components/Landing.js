import React, { Component } from "react";
import Modal from "react-responsive-modal";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getUsers } from "../actions/getOrders";
import PropTypes from "prop-types";

class Landing extends Component {
  state = {
    open: false,
    openS: false,
  };

  async componentDidMount() {
    await this.props.getUsers();
  }

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
                <p>
                  FOR DEMO PURPOSES USE username:{" "}
                  <strong style={{ color: "Green", backgroundColor: "white" }}>
                    Daniel
                  </strong>{" "}
                  Password:{" "}
                  <strong style={{ color: "Green", backgroundColor: "white" }}>
                    1234
                  </strong>
                </p>
              </article>
            </div>
          )}
          {this.props.loggedIn && (
            <div className="landing__content">
              <div className="landing__header">
                Welcome {sessionStorage.getItem("user")}
              </div>
              <article className="landing__text">
                Comments
                <br />
                <br />
                This app was built in 3 weeks initially for the final project
                for BrainStation Web development program 2020.
                <br />
                <br />
                Due to Covid-19, it was built at home with minimal help of the
                educators.
                <br />
                <br />
                Tech used: HTML5, CSS3, SASS, React.js, Node.js, Express.js,
                JWT, Bootstrap, MySQL, Knex, Bookshelf.
                <br />
                <br />
                Deployed on Heroku using JAWSDB.
                <br />
                <br />
                It was a great project to practice everything I learned in the
                past 3 months from HTML to MYSQL.
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
                    Account
                  </button>
                </Link>
                <Link to="/orders">
                  <button className="btn btn-secondary btn-lg" id="orderBtn">
                    Orders
                  </button>
                </Link>
              </>
            )}
          </div>
        </main>
        <Modal open={open} onClose={this.onCloseModal}>
          <LogIn
            users={this.props.users}
            closeModal={this.onCloseModal}
            logIn={this.props.logIn}
            loggedIn={this.props.loggedIn}
          />
        </Modal>
        <Modal open={openS} onClose={this.onCloseModal}>
          <SignUp
            users={this.props.users}
            closeModal={this.onCloseModal}
            logIn={this.props.logIn}
            loggedIn={this.props.loggedIn}
          />
        </Modal>
      </>
    );
  }
}

Landing.propTypes = {
  getUsers: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  users: state.users.users,
});

export default connect(mapStateToProps, { getUsers })(Landing);
