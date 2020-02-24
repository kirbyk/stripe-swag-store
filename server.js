require("dotenv").config();
const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET);

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  app.use(cors());
}

app.use("/", express.static("build"));

app.get("/api/products", (req, res) => {
  stripe.products.list({ limit: 3 }, (err, products) => {
    if (err) {
      return res.json(err);
    }

    return res.json(products);
  });
});

app.get("/api/skus/:product_id", (req, res) => {
  stripe.skus.list(
    { product: req.params.product_id, limit: 10 },
    (err, skus) => {
      if (err) {
        return res.json(err);
      }

      return res.json(skus);
    }
  );
});

app.get("/api/session/:session_id", (req, res) => {
  stripe.checkout.sessions.retrieve(
    req.params.session_id,
    { expand: ["payment_intent"] },
    (err, session) => {
      if (err) {
        return res.json(err);
      }

      return res.json(session);
    }
  );
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
