export async function apiFetch(endpoint) {
  const response = await fetch(`${rootURL}${endpoint}`);
  const json = await response.json();
  return json;
}

export function formatCurrency(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(price / 100);
}

export const rootURL =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://stripe-swag-store.herokuapp.com";
