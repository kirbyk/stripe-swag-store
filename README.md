# Stripe Swag Store

**Audience:** A technical Stripe employee who is familiar with the assignment
given to me.

### An overview of your application in 1 page or less: how does it work? What does it do? Which Stripe APIs does it use?

This application demonstrates how a simple e-commerce store can use Stripe
Checkout to accept payments. The application’s backend is supported by
[Express.js](https://github.com/expressjs/express) and the frontend is rendered
with [React](https://reactjs.org/).

The application’s [homepage](https://stripe-swag-store.herokuapp.com/) displays
a list of products available for purchase. These products are defined in
Stripe. When the homepage loads, the app [makes an API request to the
application’s
backend](https://github.com/kirbyk/stripe-swag-store/blob/master/src/App.js#L19),
which in turn [makes a request to the Stripe Products
API](https://github.com/kirbyk/stripe-swag-store/blob/master/server.js#L19).
The products returned by Stripe are then passed back to the frontend and [React
renders them on the
page](https://github.com/kirbyk/stripe-swag-store/blob/master/src/Home.js#L14-L20).
This means that products displayed in the application can be managed directly
from the Stripe Dashboard.

From the homepage, users can either click one of the products or open their
shopping cart. The shopping cart lives at the highest level of the application
(and in the React Component hierarchy) so that users can navigate around the
site and add various items to their cart. To add an item to their cart, users
must first navigate to a product page by clicking on one of the images/cards on
the homepage.

On [a product
page](https://stripe-swag-store.herokuapp.com/products/prod_Gn3Q8pnBA3xld4),
users can view information about the product and specify attributes such as
color and size. They can also add the product to their shopping cart or view
items they already have in their cart. The SKUs associated with a product
displayed on this page are also stored in Stripe. When a product page loads,
the app makes [a request to the application’s backend asking for all of the
variations of that
product](https://github.com/kirbyk/stripe-swag-store/blob/master/src/Product.js#L33).
That request is then [forwarded to the Stripe SKUs
API](https://github.com/kirbyk/stripe-swag-store/blob/master/server.js#L29-L30)
and returned back to the app’s frontend with info about each variation of the
product. By default, the app presents the first SKU in the list to users. Users
are able to select a particular SKU by adjusting product attributes (e.g.,
selecting the color of a t-shirt) and the product page instantly updates to
display that SKU’s image, price, and description.

After specifying which product variation they’d like, users can add that item
to their cart. Their cart then slides out from the right side of the page. From
there users can navigate away and add other items to their cart, adjust the
number of products in their cart, or check out.

When a user decides to check out (by clicking “checkout” at the bottom of their
cart) they’re redirected to a Stripe-hosted Checkout page. Since the products
are defined in Stripe, the application is able to use Stripe’s client-side
JavaScript library to initiate this redirect. After completing the transaction,
Stripe redirects the user to a confirmation page in the application. The URL
for this page includes the Checkout Session ID. The frontend [parses out this
ID](https://github.com/kirbyk/stripe-swag-store/blob/master/src/Confirmation.js#L15-L17)
and [sends it to the
backend](https://github.com/kirbyk/stripe-swag-store/blob/master/src/Confirmation.js#L20)
which [retrieves the Checkout Session object via the Stripe Sessions
API](https://github.com/kirbyk/stripe-swag-store/blob/master/server.js#L42-L44).
The frontend uses this information to display the amount they were charged
and the charge’s Charge ID on the confirmation page.

### A paragraph or two about how you approached this problem.

I haven’t used Stripe in a few years, so before I began any coding I took some
time to look over the Stripe Documentation. I browsed around the Payments
section of the docs and discovered that I could utilize a pre-built checkout
page with Stripe Checkout. In addition to handling the complexity of the
checkout flow, this sounded like a great solution because Stripe offloads the
work of handling product/SKU data. I explored the API reference and determined
that I could use the Products, SKUs, and Checkout Sessions APIs to display
product and charge data in the app.

I began to wonder if I could use Checkout’s client library to build an entirely
client-side application. The API reference made it clear that the Checkout
Session includes a Payment Intent object that I could use to access all the
information I needed about the charge. However, requests to the Stripe
Endpoints require a Secret Key, so I realized I would also need to build a
backend server to support my application. With this information, I was
confident that I could proceed with building my application.

### A paragraph about why you picked the language/framework you did.

I chose React and Express as the frameworks for my application because I’ve
built applications with them in the past. I knew that it wouldn’t take me long
to get an application up and running using these tools. I could have built the
frontend for the application without React, but I wanted to go the extra mile
and have a UI that allowed users to view different SKUs for a given product, so
I knew managing that state and updating the UI would be better handled with a
framework.

### A paragraph or two about how you might extend this if you were building a more robust instance of the same application.

The application doesn’t currently have any error handling in the frontend or
backend. On the frontend, the application could benefit by having some error
pages to handle the various errors that could be returned from the backend. The
backend needs to forward some errors to the frontend to be displayed on these
pages. It also would be a good idea to set up logging for all of these errors.
Fortunately, since the application backend isn’t making any POST requests to
Stripe (a great benefit of the client-side Checkout flow) I don’t need to worry
about making my requests idempotent.

Beyond technical robustness, the application could be extended from a product
perspective in several ways. Adding a database to the application would be
useful for storing Customer objects created in Stripe so that the application
could save payment methods for faster check out in the future. The Checkout
Session could also be configured to send receipts via email to users upon
placing an order. Also, as the product and catalog expand for this application
changes adding support for pagination and more advanced product
filtering/search will become necessary.
