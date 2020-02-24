import "./Home.css";
import React from "react";
import { Link } from "react-router-dom";

export default function Home(props) {
  return (
    <div className="hero">
      <h1 className="title">Stripe Swag Store</h1>
      <p className="description">
        Shop apparel for the best platform for running an Internet business!
      </p>

      <div className="card-row">
        {props.products.map(p => (
          <Link to={`/products/${p.id}`} key={p.id} className="card">
            <h3>{p.name}</h3>
            <img src={p.images[0]} alt="" />
            <p>{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
