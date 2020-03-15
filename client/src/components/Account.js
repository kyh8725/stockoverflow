import React from "react";

export default function Account() {
  return (
    <section className="account">
      <div className="account__userInfo">
        <h1>Username: </h1>
      </div>
      <div className="account__financialInfo">
        <h1>Balance:</h1>
        <h1>Cash:</h1>
        <h1>Investment:</h1>
        <h1>Holdings:</h1>
      </div>
    </section>
  );
}
