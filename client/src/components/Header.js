import React from "react";
import { Link } from "react-router-dom";
export default function Header(props) {
  const searchHandler = event => {
    event.preventDefault();
    if (event.target.stockSearch.value !== "") {
      props.getStock(event.target.stockSearch.value);
      props.getNews(event.target.stockSearch.value);
    } else {
      window.alert("please type stock symbol");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link to="/" className="navbar-brand">
        Stock Overflow
      </Link>
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

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {props.loggedIn && (
            <>
              <li className="nav-item active">
                <Link className="nav-link" to="/">
                  Account <span className="sr-only">(current)</span>
                </Link>
              </li>
              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  to="/"
                >
                  Menu
                </Link>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <Link className="dropdown-item" to="/search">
                    News
                  </Link>
                  <Link className="dropdown-item" to="/search">
                    What
                  </Link>
                  <Link className="dropdown-item" to="/search">
                    Else
                  </Link>
                </div>
              </li>
            </>
          )}
          <li className="nav-item active">
            <Link className="nav-link" to="/" onClick={props.logOut}>
              {!props.loggedIn && "Login"}
              {props.loggedIn && "Logout"}
              <span className="sr-only">(current)</span>
            </Link>
          </li>
        </ul>

        {props.loggedIn && (
          <form className="form-inline my-2 my-lg-0" onSubmit={searchHandler}>
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              id="nav-searchInput"
              name="stockSearch"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              id="nav-searchButton"
            >
              Search
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
