import "./Product.css";
import React from "react";
import classNames from "classnames";
import { apiFetch } from "./util";
import { formatCurrency } from "./util";
import { withRouter } from "react-router-dom";

function getSkuFromAttributes(skus, attributes) {
  return skus.find(
    s =>
      s.attributes.color === attributes.color &&
      s.attributes.size === attributes.size
  );
}

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      selectedSku: null,
      skus: []
    };
  }

  async componentDidMount() {
    const { product_id } = this.props.match.params;

    const products =
      this.props.products.length === 0
        ? (await apiFetch("/api/products")).data
        : this.props.products;
    const skus = await apiFetch(`/api/skus/${product_id}`);

    this.setState(state => ({
      ...state,
      product: products.find(p => p.id === product_id),
      selectedSku: skus.data.find(s => s.product === product_id),
      skus: skus.data.filter(s => s.product === product_id)
    }));
  }

  setColor(color) {
    this.setState(state => ({
      ...state,
      selectedSku: getSkuFromAttributes(state.skus, {
        ...state.selectedSku.attributes,
        color
      })
    }));
  }

  setSize(size) {
    this.setState(state => ({
      ...state,
      selectedSku: getSkuFromAttributes(state.skus, {
        ...state.selectedSku.attributes,
        size
      })
    }));
  }

  render() {
    const colors =
      this.state.skus &&
      Array.from(new Set(this.state.skus.map(s => s.attributes.color)));
    // TODO: figure out a way to encode this ordering without hardcoding
    const sizes = ["small", "medium", "large", "XL"];

    const { product, selectedSku } = this.state;

    return (
      <div className="wrapper">
        {!selectedSku || !product ? (
          <div>...loading</div>
        ) : (
          <div className="row product-wrapper">
            <div className="column">
              <img src={selectedSku.image} className="product-img" alt="" />
            </div>

            <div className="column">
              <h1>{selectedSku.attributes.name}</h1>
              <h2>{formatCurrency(selectedSku.price)}</h2>
              <p>{product.description}</p>
              <hr />
              <strong>Color:</strong>
              <ul>
                {colors.map(c => {
                  return (
                    <li key={c}>
                      <button
                        className={classNames("capitalize", {
                          selected: selectedSku.attributes.color === c
                        })}
                        onClick={() => this.setColor(c)}
                      >
                        {c}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <hr />
              <strong>Sizes:</strong>
              <ul>
                {sizes.map(s => {
                  return (
                    <li key={s}>
                      <button
                        className={classNames("capitalize", {
                          selected: selectedSku.attributes.size === s
                        })}
                        onClick={() => this.setSize(s)}
                      >
                        {s}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button
                className="primary-button"
                onClick={() => {
                  this.props.addItem({
                    id: selectedSku.id,
                    name: selectedSku.attributes.name,
                    description: `${selectedSku.attributes.size} • ${selectedSku.attributes.color}`,
                    price: selectedSku.price,
                    image: selectedSku.image
                  });
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Product);
