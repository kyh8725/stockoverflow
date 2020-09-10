import React, { Component } from "react";
import refresh from "../assets/refresh.svg";
import favc from "../assets/favc.svg";
import Modal from "react-responsive-modal";
import NewOrder from "./NewOrder";
import Chart from "chart.js";

export default class StockCard extends Component {
  state = {
    cash: 0,
    stock: {},
    open: false,
    labels: [],
    data: [],
    load: false,
  };

  chartRef = React.createRef();

  async componentDidMount() {
    await this.setState(
      {
        labels: this.props.labels,
        data: this.props.data,
        stock: this.props.stock,
        cash: this.props.cash,
      },
      this.makeChart()
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      this.makeChart();
    }
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

  makeChart = () => {
    const myChartRef = this.chartRef.current.getContext("2d");
    new Chart(myChartRef, {
      type: "line",
      data: {
        labels: this.props.labels,
        datasets: [
          {
            label: "price",
            data: this.props.data,
            borderColor: "#c45850",
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  render() {
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
              {this.state.labels && <canvas id="myChart" ref={this.chartRef} />}
            </div>
            <div className="scard__prices">
              <div className="scard__pricewrap">
                <p>Price: $</p>
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
                  <span>
                    {this.props.stock.changePercent.toFixed(2)}%&nbsp;&nbsp;
                  </span>
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
                  flex: this.wkRange(),
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
          </div>
        </section>
        <Modal open={open} onClose={this.onCloseModal}>
          <NewOrder
            cash={this.props.cash}
            closeModal={this.onCloseModal}
            stock={this.props.stock}
          />
        </Modal>
      </>
    );
  }
}
