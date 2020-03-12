import React, { Component } from "react";
import Header from "./components/Header";
import StockCard from "./components/StockCard";
import NewsCard from "./components/NewsCard";
import LogIn from "./components/LogIn";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

export default class App extends Component {
  state = {
    news: [
      {
        datetime: 1583952974000,
        headline: "E3 and NAB Events Canceled Due to Coronavirus",
        source: "Mac Rumors",
        url:
          "https://cloud.iexapis.com/v1/news/article/c82db944-b282-4d0a-ae94-41fd4ba786e1",
        summary:
          'Two more major events in the United States have been called off today as the coronavirus continues to spread, with organizers for both E3 and NAB announcing cancelations. E3, a major gaming convention that draws more than 65,000 people, was set to be held on June 9 to June 11 in Los Angeles, California. E3 event organizers this morning said that canceling was the "best way to proceed" amid "increased and overwhelming concerns about COVID-19." The E3 team is devastated to share this news. This decision was not reached lightly, but it is the right one for the health and safety of all involved. Read our statement here: https://t.co/1uOWxTerN9 pic.twitter.com/gD2IxNACLX — E3 (@E3) March 11, 2020 NAB is an annual trade show produced by the National Association of Broadcasters, and it typically draws somewhere around 100,000 people. This year\'s event was set to take place at the Las Vegas Convention Center from April 18 to April 22. NAB event organizers have decided not to hold the event in the "interest of addressing the health and safety concerns" of stakeholders and in consultation with partners throughout the media and entertainment industry.',
        related: "AAPL",
        image:
          "https://cloud.iexapis.com/v1/news/image/c82db944-b282-4d0a-ae94-41fd4ba786e1",
        lang: "en",
        hasPaywall: false
      },
      {
        datetime: 1583952901000,
        headline:
          'Apple says it will close all of its 17 retail stores in Italy from March 12 "until further notice" amid the COVID-19 outbreak (Mark Gurman/Bloomberg)',
        source: "Techmeme",
        url:
          "https://cloud.iexapis.com/v1/news/article/9d4cbf0e-7ef6-4ce0-8512-4f91f27926d0",
        summary:
          "Mark Gurman / Bloomberg : Apple says it will close all of its 17 retail stores in Italy from March 12 “until further notice” amid the COVID-19 outbreak — Apple Inc. said it is closing all 17 of its retail stores in Italy “until further notice” as the coronavirus pandemic limits activity in the country.",
        related: "AAPL",
        image:
          "https://cloud.iexapis.com/v1/news/image/9d4cbf0e-7ef6-4ce0-8512-4f91f27926d0",
        lang: "en",
        hasPaywall: false
      },
      {
        datetime: 1583951886000,
        headline:
          "Apple is working on a new iPhone app with workout videos, code-named 'Seymour'",
        source: "CNBC",
        url:
          "https://cloud.iexapis.com/v1/news/article/79e7acf8-008f-45f6-8fbf-2d3d13b287a0",
        summary:
          "Apple is building an iPhone and Apple Watch app, codenamed Seymour, that will offer guided workout videos. It could be useful for folks who don't have access to personal trainers and further shows Apple's commitment to health and fitness.",
        related: "AAPL",
        image:
          "https://cloud.iexapis.com/v1/news/image/79e7acf8-008f-45f6-8fbf-2d3d13b287a0",
        lang: "en",
        hasPaywall: false
      }
    ],
    stock: {
      symbol: "AAPL",
      companyName: "Apple, Inc.",
      primaryExchange: "NASDAQ",
      calculationPrice: "tops",
      open: null,
      openTime: null,
      close: null,
      closeTime: null,
      high: null,
      low: null,
      latestPrice: 275.64,
      latestSource: "IEX real time price",
      latestTime: "3:50:18 PM",
      latestUpdate: 1583956218070,
      latestVolume: null,
      iexRealtimePrice: 275.64,
      iexRealtimeSize: 200,
      iexLastUpdated: 1583956218070,
      delayedPrice: null,
      delayedPriceTime: null,
      oddLotDelayedPrice: null,
      oddLotDelayedPriceTime: null,
      extendedPrice: null,
      extendedChange: null,
      extendedChangePercent: null,
      extendedPriceTime: null,
      previousClose: 285.34,
      previousVolume: 71322520,
      change: -9.7,
      changePercent: -0.03399,
      volume: null,
      iexMarketPercent: 0.01091762034974206,
      iexVolume: 598464,
      avgTotalVolume: 46599117,
      iexBidPrice: 270,
      iexBidSize: 200,
      iexAskPrice: 276.46,
      iexAskSize: 100,
      marketCap: 1206057307200,
      peRatio: 21.61,
      week52High: 327.85,
      week52Low: 170.27,
      ytdChange: -0.083965,
      lastTradeTime: 1583956218070,
      isUSMarketOpen: true
    }
  };

  componentDidMount() {}

  getNews = symbol => {
    const { iex_url, iex_token } = process.env;
    axios.get(`${iex_url}${symbol}/news/last/3${iex_token}`).then(response => {
      console.log(response.data);
      this.setState({ news: response.data });
    });
  };

  getStock = symbol => {
    const { iex_url, iex_token } = process.env;
    axios.get(`${iex_url}${symbol}/quote${iex_token}`).then(response => {
      this.setState({ stock: response.data });
    });
  };

  render() {
    return (
      <>
        <Router>
          <Header />
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return (
                  <>
                    <LogIn />
                  </>
                );
              }}
            />
            <Route
              path="/holdings"
              exact
              render={() => {
                return (
                  <>
                    <StockCard stock={this.state.stock} />
                    <NewsCard news={this.state.news} />
                  </>
                );
              }}
            />
          </Switch>
        </Router>
      </>
    );
  }
}

// axios
//   .get(
//     `${this.state.url_intraday}${this.state.symbol}${this.state.interval}${this.state.api_key}`
//   )
//   .then(response => {
//     const key = Object.keys(response.data["Time Series (1min)"])[0];
//     const latestPrice = response.data["Time Series (1min)"][key];
//     this.setState({ price: latestPrice });
//     console.log(response.data);
//   });
// axios
//   .get(
//     `${this.state.url_globalquote}${this.state.symbol}${this.state.api_key}`
//   )
//   .then(response => {
//     console.log(response.data);
//   });
// axios
//   .get(
//     `https://cloud.iexapis.com/stable/stock/${this.state.symbol}/quote?token=pk_64c9963c8e65443b9d72928be93b8178`
//   )
//   .then(response => {
//     console.log(response.data);
//   });
//https://cloud.iexapis.com/stable/stock/XOM/quote?token=YOUR_TOKEN_HERE
