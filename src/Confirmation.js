import React from "react";
import { apiFetch } from "./util";
import { formatCurrency } from "./util";
import { withRouter } from "react-router-dom";

class Confirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null
    };
  }

  async componentDidMount() {
    const session_id = new URLSearchParams(this.props.location.search).get(
      "session_id"
    );

    if (session_id) {
      const session = await apiFetch(`/api/session/${session_id}`);
      this.setState(state => ({
        ...state,
        session: session
      }));
    } else {
      // error
    }
  }

  render() {
    return (
      <div className="wrapper">
        {!this.state.session ? (
          <h2>Loading...</h2>
        ) : (
          <div>
            <h1>Thank you, your order has been placed.</h1>
            <h3>
              Order Number:{" "}
              {this.state.session.payment_intent.charges.data[0].id}
            </h3>
            <h3>
              Order Total:{" "}
              {formatCurrency(
                this.state.session.payment_intent.charges.data[0].amount
              )}
            </h3>
            <h3>Order Summary:</h3>
            <ul>
              {this.state.session.display_items.map(item => (
                <li key={item.sku.id}>
                  {item.quantity} x {item.sku.attributes.name} -{" "}
                  {item.sku.attributes.size} • {item.sku.attributes.color}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Confirmation);
