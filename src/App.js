import "./App.css";
import Cart from "./Cart";
import Confirmation from "./Confirmation";
import Home from "./Home";
import Product from "./Product";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { apiFetch } from "./util";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  async componentDidMount() {
    const products = await apiFetch("/api/products");
    this.setState(state => ({
      ...state,
      products: products.data
    }));
  }

  render() {
    return (
      <Router>
        <Cart>
          {(toggleCart, addItem) => (
            <div className="body">
              <div className="wrapper">
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <button onClick={toggleCart}>Cart</button>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="content">
                <Switch>
                  <Route path="/products/:product_id">
                    <Product addItem={addItem} products={this.state.products} />
                  </Route>
                  <Route path="/checkout-confirmation">
                    <Confirmation />
                  </Route>
                  <Route path="/">
                    <Home products={this.state.products} />
                  </Route>
                </Switch>
              </div>
            </div>
          )}
        </Cart>
      </Router>
    );
  }
}
