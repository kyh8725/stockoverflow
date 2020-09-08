import React from "react";
import axios from "axios";

export default function LogIn(props) {
  const loginHandler = (event) => {
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.preventDefault();
    if (username !== "" && password !== "") {
      if (!props.users.includes(username)) {
        window.alert("user does not exist please sign up");
      } else {
        axios
          .post("/users/login", {
            username: username,
            password: password,
          })
          .then((response) => {
            sessionStorage.setItem("user", username);
            props.logIn(username);
            props.closeModal();
          });
      }
    } else {
      window.alert("please fill both username and password");
    }
    event.target.reset();
  };
  return (
    <>
      <h2> Log In </h2>
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
            <button
              className="btn btn-outline-success"
              value="logIn"
              id="loginbtn"
            >
              Log in
            </button>
          </div>
        </form>
      )}
    </>
  );
}
