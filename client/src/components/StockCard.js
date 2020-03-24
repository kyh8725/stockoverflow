import React, { Component } from "react";
import refresh from "../assets/refresh.svg";
import favc from "../assets/favc.svg";
import Modal from "react-responsive-modal";
import NewOrder from "./NewOrder";
import Chart from "chart.js";
import axios from "axios";

export default class StockCard extends Component {
  state = {
    stock: {},
    open: false,
    labels: [],
    data: []
  };

  chartRef = React.createRef();

  componentDidMount() {
    this.setState({ stock: this.props.stock });
    this.processChartData();
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };

  colorChange = () => {
    if (Number(this.props.stock.change) > 0) {
      return "green";
    } else {
      return "red";
    }
  };

  wkColor = () => {
    const diff =
      (Number(this.props.stock.week52High) -
        Number(this.props.stock.week52Low)) /
      2;
    const half = Number(this.props.stock.week52Low) + diff;
    if (Number(this.props.stock.latestPrice) >= half) {
      return "green";
    } else {
      return "red";
    }
  };

  wkRange = () => {
    const diff =
      Number(this.props.stock.week52High) - Number(this.props.stock.week52Low);
    const ratio =
      (Number(this.props.stock.latestPrice) -
        Number(this.props.stock.week52Low)) /
      diff;
    return ratio;
  };

  isMarketOpen = () => {
    if (this.props.stock.isUSMarketOpen) {
      return "Market is open";
    } else {
      return "Market is closed";
    }
  };
  isMarketOpenColor = () => {
    if (this.props.stock.isUSMarketOpen) {
      return "green";
    } else {
      return "red";
    }
  };

  processChartData = () => {
    const responseData = [
      {
        date: "2020-03-17",
        open: 247.51,
        close: 252.86,
        high: 257.61,
        low: 238.4,
        volume: 81013965,
        uOpen: 247.51,
        uClose: 252.86,
        uHigh: 257.61,
        uLow: 238.4,
        uVolume: 81013965,
        change: 0,
        changePercent: 0,
        label: "Mar 17",
        changeOverTime: 0
      },
      {
        date: "2020-03-18",
        open: 239.77,
        close: 246.67,
        high: 250,
        low: 237.12,
        volume: 75058406,
        uOpen: 239.77,
        uClose: 246.67,
        uHigh: 250,
        uLow: 237.12,
        uVolume: 75058406,
        change: -6.19,
        changePercent: -2.448,
        label: "Mar 18",
        changeOverTime: -0.02448
      },
      {
        date: "2020-03-19",
        open: 247.39,
        close: 244.78,
        high: 252.84,
        low: 242.61,
        volume: 67964255,
        uOpen: 247.39,
        uClose: 244.78,
        uHigh: 252.84,
        uLow: 242.61,
        uVolume: 67964255,
        change: -1.89,
        changePercent: -0.7662,
        label: "Mar 19",
        changeOverTime: -0.031954
      },
      {
        date: "2020-03-20",
        open: 247.18,
        close: 229.24,
        high: 251.83,
        low: 228,
        volume: 100423346,
        uOpen: 247.18,
        uClose: 229.24,
        uHigh: 251.83,
        uLow: 228,
        uVolume: 100423346,
        change: -15.54,
        changePercent: -6.3486,
        label: "Mar 20",
        changeOverTime: -0.093411
      },
      {
        date: "2020-03-23",
        open: 228.08,
        close: 224.37,
        high: 228.5,
        low: 212.61,
        volume: 84188208,
        uOpen: 228.08,
        uClose: 224.37,
        uHigh: 228.5,
        uLow: 212.61,
        uVolume: 84188208,
        change: -4.87,
        changePercent: -2.1244,
        label: "Mar 23",
        changeOverTime: -0.112671
      }
    ];

    const chartLabels = [];
    const chartData = [];

    responseData.forEach(data => {
      chartLabels.push(data.label);
      chartData.push(data.close);
      this.setState({ labels: chartLabels, data: chartData }, this.makeChart());
      localStorage.setItem("labels", JSON.stringify(chartLabels));
      localStorage.setItem("data", JSON.stringify(chartData));
    });
    // const iex_token = "?token=pk_64c9963c8e65443b9d72928be93b8178";
    // const iex_url = "https://cloud.iexapis.com/stable/stock/";
    // axios
    //   .get(`${iex_url}${this.props.stock.symbol}/chart/5d${iex_token}`)
    //   .then(response => {

    //   });
  };

  makeChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    new Chart(myChartRef, {
      type: "line",
      data: {
        labels: JSON.parse(localStorage.getItem("labels")),
        datasets: [
          {
            label: "price",
            data: JSON.parse(localStorage.getItem("data"))
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };

  render() {
    console.log(localStorage.getItem("labels"));
    console.log(localStorage.getItem("data"));
    const { open } = this.state;

    return (
      <>
        <section className="scard">
          <div className="scard__top">
            <div className="scard__top-stock">
              <h3 className="scard__top-name">
                {this.props.stock.companyName}
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
          <h3 className="scard__top-symbol">
            {this.props.stock.symbol}&nbsp;&nbsp;&nbsp;&nbsp;
            {this.props.stock.primaryExchange}
          </h3>
          <div className="scard__main">
            <div className="scard__chart">
              <canvas id="myChart" ref={this.chartRef} />
            </div>
            <div className="scard__prices">
              <div className="scard__pricewrap">
                <p>Price: &nbsp;</p>
                <p
                  className="scard__priceCurrent"
                  style={{ color: this.colorChange() }}
                >
                  {this.props.stock.latestPrice.toFixed(2)}
                </p>
              </div>
              <div className="scard__pricewrap">
                <p className="scard__priceChange">Change: </p>
                <p
                  className="scard__priceChange-value"
                  style={{ color: this.colorChange() }}
                >
                  <span> {this.props.stock.changePercent.toFixed(2)} %</span>
                  <span> {this.props.stock.change.toFixed(2)}</span>
                </p>
              </div>
            </div>
            <div className="scard__highlow">
              <div className="scard__highlow-title">
                <p>Open</p>
                <p>Day High</p>
                <p>Day Low</p>
              </div>
              <div className="scard__highlow-value">
                <p>{this.props.stock.open}</p>
                <p>{this.props.stock.high}</p>
                <p>{this.props.stock.low}</p>
              </div>
            </div>
            <div className="scard__52Wk">
              <p>52 wk.Low {this.props.stock.week52Low.toFixed(2)}</p>
              <p>52 wk.High {this.props.stock.week52High.toFixed(2)}</p>
            </div>
            <div className="scard__52Wk-barwrap">
              <span
                className="scard__52Wk-bar1"
                style={{
                  backgroundColor: this.wkColor(),
                  flex: this.wkRange()
                }}
              ></span>
              <span
                className="scard__52Wk-bar2"
                style={{ flex: 1 - this.wkRange() }}
              ></span>
            </div>
          </div>
          <p
            className="scard__marketOpen"
            style={{ color: this.isMarketOpenColor() }}
          >
            {this.isMarketOpen()}
          </p>
          <div className="scard__buttonWrap">
            <button onClick={this.onOpenModal} className="scard__buybtn">
              BUY
            </button>
            <button className="scard__sellbtn">SELL</button>
          </div>
        </section>
        <Modal open={open} onClose={this.onCloseModal}>
          <NewOrder
            closeModal={this.onCloseModal}
            getAccountInfo={this.props.getAccountInfo}
            stock={this.props.stock}
          />
        </Modal>
      </>
    );
  }
}
