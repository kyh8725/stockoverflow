import React from "react";

export default function LogIn() {
  const loginHandler = event => {
    event.preventDefault();
    if (
      event.target.username.value !== "" &&
      event.target.password.value !== ""
    ) {
      console.log(event.target.username.value, event.target.password.value);
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
          <button type="button" class="btn btn-outline-success">
            Log in
          </button>
        </div>
      </form>
    </>
  );
}
