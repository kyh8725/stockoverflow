import React from "react";
import refresh from "../assets/refresh.svg";
import favc from "../assets/favc.svg";
import favu from "../assets/favu.svg";

export default function StockCard({ stock }) {
  const colorChange = () => {
    if (Number(stock.change) > 0) {
      return "green";
    } else {
      return "red";
    }
  };

  const wkColor = () => {
    const diff = (Number(stock.week52High) - Number(stock.week52Low)) / 2;
    const half = Number(stock.week52Low) + diff;
    if (Number(stock.latestPrice) >= half) {
      return "green";
    } else {
      return "red";
    }
  };

  const wkRange = () => {
    const diff = Number(stock.week52High) - Number(stock.week52Low);
    const ratio = (Number(stock.latestPrice) - Number(stock.week52Low)) / diff;
    return ratio;
  };

  const isMarketOpen = () => {
    if (stock.isUSMarketOpen) {
      return "Market is open";
    } else {
      return "Market is closed";
    }
  };
  return (
    <section className="scard">
      <div className="scard__top">
        <div className="scard__top-stock">
          <h3 className="scard__top-name">{stock.companyName}</h3>
          <h3 className="scard__top-symbol">
            {stock.symbol}&nbsp;&nbsp;&nbsp;&nbsp;{stock.primaryExchange}
          </h3>
        </div>
        <div className="scard__top-img">
          <div className="scard__top-imgwrapper">
            <img src={favc} alt="fav" />
          </div>
          <div className="scard__top-imgwrapper">
            <img src={refresh} alt="refresh" />
          </div>
        </div>
      </div>
      <div className="scard__main">
        <div className="scard__graph"> CHART</div>
        <div className="scard__prices">
          <p className="scard__priceCurrent" style={{ color: colorChange() }}>
            <span style={{ color: "black" }}>Price: </span>
            {stock.latestPrice.toFixed(2)}&nbsp;&nbsp;&nbsp;
            <span style={{ color: "black" }}>Change: </span>
            {stock.change.toFixed(2)}&nbsp;&nbsp;&nbsp;
            {stock.changePercent.toFixed(2)} %
          </p>
        </div>
        <div className="scard_prices">
          <p className="scard__priceDay">Open DayHigh DayLow</p>
        </div>
        <div className="scard__52Wk">
          <p>52 wk.Low {stock.week52Low.toFixed(2)}</p>
          <p>52 wk.High {stock.week52High.toFixed(2)}</p>
        </div>
        <div className="scard__52Wk-barwrap">
          <span
            className="scard__52Wk-bar1"
            style={{ backgroundColor: wkColor(), flex: wkRange() }}
          ></span>
          <span
            className="scard__52Wk-bar2"
            style={{ flex: 1 - wkRange() }}
          ></span>
        </div>
      </div>
      <p className="scard__marketOpen">{isMarketOpen()}</p>
      <div className="scard__buttonWrap">
        <button className="scard__buybtn"> BUY </button>
        <button className="scard__sellbtn"> SELL </button>
      </div>
    </section>
  );
}
