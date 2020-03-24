import React, { Component } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default class Account extends Component {
  state = {
    orders: [],
    user: "",
    months: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]
  };

  componentDidMount() {
    this.setState({
      user: this.props.user,
      orders: this.props.orders
    });
  }

  getDate = time => {
    const date = new Date(time);
    return `${
      this.state.months[date.getMonth()]
    } ${date.getDate()} ${date.getFullYear()}`;
  };

  cancelHandler = event => {
    axios.put(`/orders/settle/${event.target.id}`).then(response => {
      axios.get(`/orders/${this.state.user}`).then(response => {
        this.setState({ orders: response.data });
      });
    });
  };
  // processOrders = () =>{
  //   const order = this.state.order.map(order =>{
  //     if(order.)
  //   })
  // }
  renderOrders = () => {
    let net = 0;
    const order = this.state.orders.map(order => {
      if (order.buy) {
        net += order.price * order.quantity;
        return (
          <div className="account__single" key={uuidv4()}>
            <h3 className="account__single-date">
              {this.getDate(order.orderDate)}
            </h3>
            <h3 className="account__single-stock">
              {order.symbol.toLowerCase()}
            </h3>
            <h3 className="account__single-price">${order.price.toFixed(2)}</h3>
            <h3 className="account__single-quantity">{order.quantity}</h3>
            <h3 className="account__single-net">${net.toFixed(2)}</h3>
            <button
              className="btn btn-danger"
              id={order.id}
              onClick={this.cancelHandler}
            >
              Cancel
            </button>
          </div>
        );
      }
    });
    return order;
  };

  render() {
    return (
      <>
        <section className="account">
          <h2>Orders</h2>
          <div className="account__title">
            <h3 className="account__date">Order Date</h3>
            <h3 className="account__stock"> Stock </h3>
            <h3 className="account__price"> Price </h3>
            <h3 className="account__quantity"> Qty </h3>
            <h3 className="account__net"> Net</h3>
            <h3 className="account__buttonPlace">{}</h3>
          </div>
          <div className="account__financialInfo">{this.renderOrders()}</div>
        </section>
      </>
    );
  }
}
