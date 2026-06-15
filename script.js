const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

const menuItems = [
  {
    id: 1,
    name: "Greg's Classic Burger",
    description: "Angus beef, cheddar, lettuce, tomato, onion, house sauce.",
    price: 14.99
  },
  {
    id: 2,
    name: "Chicken Alfredo",
    description: "Fettuccine, grilled chicken, parmesan cream sauce.",
    price: 17.99
  },
  {
    id: 3,
    name: "Garden Salad",
    description: "Mixed greens, cucumber, tomato, carrots, balsamic dressing.",
    price: 10.99
  },
  {
    id: 4,
    name: "Margherita Pizza",
    description: "Fresh mozzarella, basil, tomato sauce, olive oil.",
    price: 15.99
  },
  {
    id: 5,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with vanilla ice cream.",
    price: 8.99
  },
  {
    id: 6,
    name: "Fresh Lemonade",
    description: "Fresh-squeezed lemonade served over ice.",
    price: 3.99
  }
];

// Replace this with your real Square, Stripe, Toast, Clover, or Shopify checkout link.
const REAL_CHECKOUT_LINK = "https://example.com/replace-with-your-real-payment-link";

let cart = [];

const orderItems = document.getElementById("orderItems");
const cartItems = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutButton = document.getElementById("checkoutButton");

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderOrderItems() {
  orderItems.innerHTML = menuItems.map(item => `
    <article class="order-card">
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <div class="order-card-footer">
        <strong>${formatMoney(item.price)}</strong>
        <button class="btn primary" onclick="addToCart(${item.id})">Add</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const item = menuItems.find(menuItem => menuItem.id === id);
  const cartItem = cart.find(existingItem => existingItem.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="muted">Your cart is empty.</p>`;
  } else {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br />
          <span>${item.quantity} × ${formatMoney(item.price)}</span>
        </div>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `).join("");
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.06;
  const total = subtotal + tax;

  subtotalEl.textContent = formatMoney(subtotal);
  taxEl.textContent = formatMoney(tax);
  totalEl.textContent = formatMoney(total);

  if (cart.length > 0) {
    checkoutButton.classList.remove("disabled");
    checkoutButton.setAttribute("aria-disabled", "false");
    checkoutButton.href = REAL_CHECKOUT_LINK;
  } else {
    checkoutButton.classList.add("disabled");
    checkoutButton.setAttribute("aria-disabled", "true");
    checkoutButton.href = "#";
  }
}

const reservationForm = document.getElementById("reservationForm");
const reservationMessage = document.getElementById("reservationMessage");

reservationForm.addEventListener("submit", event => {
  event.preventDefault();

  const reservation = {
    id: Date.now(),
    name: document.getElementById("resName").value,
    email: document.getElementById("resEmail").value,
    date: document.getElementById("resDate").value,
    time: document.getElementById("resTime").value,
    partySize: document.getElementById("partySize").value,
    status: "New",
    createdAt: new Date().toLocaleString()
  };

  const reservations = JSON.parse(localStorage.getItem("gregsReservations")) || [];
  reservations.push(reservation);
  localStorage.setItem("gregsReservations", JSON.stringify(reservations));

  reservationMessage.innerHTML =
    `Thanks, ${reservation.name}! Your reservation request for ${reservation.partySize} on ${reservation.date} at ${reservation.time} was saved. <a href="reservations.html">View reservations</a>.`;

  reservationForm.reset();

  // Important:
  // This saves reservations in this browser only.
  // For a real public restaurant site, connect this form to a backend service
  // like Formspree, Airtable, Supabase, Firebase, Google Sheets, OpenTable, Resy, or Tock.
});

renderOrderItems();
renderCart();
