import React from "react";
import axios from "axios";

export default function SignUp(props) {
  console.log(props);
  const signUpHandler = (event) => {
    const username = event.target.username.value;
    const password = event.target.password.value;
    event.preventDefault();
    if (username !== "" && password !== "") {
      if (props.users.includes(username)) {
        window.alert("username already exists");
      } else {
        sessionStorage.setItem("user", username);
        axios
          .post("/users/new", {
            username: username,
            password: password,
          })
          .then((response) => {
            sessionStorage.authToken = response.data.token;
          });
        props.logIn(username);
        window.alert("Thank you for siging up!  \n You can start trading now!");
        props.closeModal();
      }
    } else {
      window.alert("please fill both username and password");
    }
    event.target.reset();
  };
  return (
    <>
      <h2> Create Account </h2>
      {!props.loggedIn && (
        <form onSubmit={signUpHandler} className="login">
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
            <button className="btn btn-outline-success" id="loginbtn">
              Sign Up
            </button>
          </div>
        </form>
      )}
    </>
  );
}
