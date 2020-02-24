import "./Cart.css";
import React from "react";
import classNames from "classnames";
import { formatCurrency, rootURL } from "./util";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
);

export default class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCartVisible: false,
      items: []
    };
    this.toggleShoppingCart = this.toggleShoppingCart.bind(this);
    this.updateQuantity = this.updateQuantity.bind(this);
    this.addItem = this.addItem.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  toggleShoppingCart() {
    this.setState(state => ({
      ...state,
      shoppingCartVisible: !this.state.shoppingCartVisible
    }));
  }

  updateQuantity(item, quantity) {
    const itemIndex = this.state.items.findIndex(i => i.id === item.id);
    const items = this.state.items.slice(0);
    items[itemIndex].quantity = quantity;
    this.setState(state => ({ ...state, items: items }));
  }

  addItem(item) {
    const existingItem = this.state.items.find(i => i.id === item.id);

    if (existingItem) {
      this.updateQuantity(item, existingItem.quantity + 1);
    } else {
      this.setState(state => ({
        ...state,
        items: [...state.items, { ...item, quantity: 1 }]
      }));
    }

    this.toggleShoppingCart();
  }

  quantitySelection(item) {
    return (
      <select
        onChange={e => this.updateQuantity(item, parseInt(e.target.value))}
        value={item.quantity}
      >
        {[1, 2, 3, 4, 5].map(i => (
          <option key={i}>{i}</option>
        ))}
      </select>
    );
  }

  async checkout() {
    const stripe = await stripePromise;

    const items = this.state.items.map(i => ({
      sku: i.id,
      quantity: i.quantity
    }));

    const { error } = await stripe.redirectToCheckout({
      items: items,
      successUrl: `${rootURL}/checkout-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${rootURL}/`
    });
    // TODO: If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
  }

  render() {
    const shoppingCartVisibility = this.state.shoppingCartVisible
      ? "shown"
      : "hidden";

    const total = this.state.items.reduce(
      (total, curr) => (total += curr.price * curr.quantity),
      0
    );

    return (
      <div>
        {this.props.children(this.toggleShoppingCart, this.addItem)}

        <div className={classNames("cart", shoppingCartVisibility)}>
          <div className="row cart-heading">
            <div className="column">
              <h2>Shopping Cart</h2>
            </div>
            <div className="column">
              <button
                onClick={this.toggleShoppingCart}
                className="close-button"
              >
                X
              </button>
            </div>
          </div>

          <hr />

          {this.state.items.length === 0 ? (
            <h3>No items. Add something to your cart.</h3>
          ) : (
            <div>
              {this.state.items.map(item => (
                <div
                  className="row cart-item"
                  key={`${item.name}-${item.description}`}
                >
                  <div className="column cart-item-thumbnail">
                    <img src={item.image} alt="" />
                  </div>
                  <div className="column cart-item-details">
                    <h4>{item.name}</h4>
                    <h4>{item.description}</h4>
                    <h4>{this.quantitySelection(item)}</h4>
                  </div>
                  <div className="column cart-item-total">
                    <h3>{formatCurrency(item.price * item.quantity)}</h3>
                  </div>
                </div>
              ))}

              <div className="cart-bottom">
                <hr />
                <div className="row">
                  <h3 className="column cart-subtotal">
                    Subtotal: {formatCurrency(total)}
                  </h3>
                </div>
                <div className="row">
                  <div className="column cart-checkout">
                    <button onClick={this.checkout} className="primary-button">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={classNames("cart-overlay", shoppingCartVisibility)}
          onClick={this.toggleShoppingCart}
        />
      </div>
    );
  }
}
