import React from "react";
import axios from "axios";

export default function LogIn(props) {
  const loginHandler = event => {
    event.preventDefault();
    if (
      event.target.username.value !== "" &&
      event.target.password.value !== ""
    ) {
      axios
        .post("/login", {
          username: event.target.username.value,
          password: event.target.password.value
        })
        .then(response => {
          sessionStorage.authToken = response.data.token;
          props.logIn();
        });
    } else {
      window.alert("please fill both username and password");
    }
    event.target.reset();
  };
  return (
    <>
      <form className="login" onSubmit={loginHandler}>
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
        <div>
          <button type="button" className="btn btn-outline-success">
            Log in
          </button>
        </div>
      </form>
    </>
  );
}
