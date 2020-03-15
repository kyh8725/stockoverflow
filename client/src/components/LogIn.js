import React from "react";
import axios from "axios";

export default function LogIn(props) {
  const loginHandler = event => {
    event.preventDefault();
    if (
      event.target.username.value !== "" &&
      event.target.password.value !== ""
    ) {
      if (!props.users.includes(event.target.username.value)) {
        window.alert("user does not exist please sign up");
      } else {
        axios
          .post("/login", {
            username: event.target.username.value,
            password: event.target.password.value
          })
          .then(response => {
            sessionStorage.authToken = response.data.token;
            props.logIn();
            window.alert("you are logged in");
          });
      }
    } else {
      window.alert("please fill both username and password");
    }
    event.target.reset();
  };
  return (
    <>
      {!props.loggedIn && (
        <form onSubmit={loginHandler} className="login">
          <div className="login__inputWrap">
            <input
              type="text"
              className="login__username"
              placeholder="username"
              name="username"
            />
            <input
              type="password"
              className="login__password"
              placeholder="password"
              name="password"
            />
          </div>

          <div className="login__btnWrap">
            <button className="btn btn-outline-primary" id="signupbtn">
              Sign Up
            </button>
            <button className="btn btn-outline-success" id="loginbtn">
              Log in
            </button>
          </div>
        </form>
      )}
    </>
  );
}
