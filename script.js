// --- Liste de produits (exemple, à personnaliser plus tard) ---
const products = [
  {
    id: 1,
    name: "Écouteurs Bluetooth",
    price: 29.99,
    image: "https://via.placeholder.com/200x200?text=Écouteurs"
  },
  {
    id: 2,
    name: "Montre connectée",
    price: 59.99,
    image: "https://via.placeholder.com/200x200?text=Montre"
  },
  {
    id: 3,
    name: "Smartphone X200",
    price: 499.99,
    image: "https://via.placeholder.com/200x200?text=Smartphone"
  },
  {
    id: 4,
    name: "Casque Gamer",
    price: 89.99,
    image: "https://via.placeholder.com/200x200?text=Casque"
  }
];

// --- Panier (stocké localement dans le navigateur) ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// --- Affiche les produits sur la page ---
function displayProducts() {
  const container = document.querySelector(".products-container");
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price.toFixed(2)} €</p>
      <button onclick="addToCart(${product.id})">Ajouter au panier</button>
    `;

    container.appendChild(card);
  });
}

// --- Ajouter un produit au panier ---
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartIcon();
  alert(`${product.name} a été ajouté au panier 🛒`);
}

// --- Sauvegarder le panier dans le navigateur ---
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Met à jour le nombre d'articles affiché dans l'icône panier ---
function updateCartIcon() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badge = document.querySelector(".cart-count");
  if (badge) badge.textContent = count;
}

// --- Affiche le panier dans une petite section (au lieu d'une popup) ---
function displayCart() {
  const cartContainer = document.querySelector(".cart-container");
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Votre panier est vide.</p>";
    return;
  }

  cart.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name}</span>
      <span>${item.quantity} × ${item.price.toFixed(2)} €</span>
      <button onclick="removeFromCart(${item.id})">❌</button>
    `;
    cartContainer.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("cart-total");
  totalDiv.innerHTML = `<strong>Total : ${total.toFixed(2)} €</strong>`;
  cartContainer.appendChild(totalDiv);
}

// --- Supprime un produit du panier ---
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  displayCart();
  updateCartIcon();
}

// --- Quand la page se charge ---
document.addEventListener("DOMContentLoaded", () => {
  displayProducts();
  displayCart();
  updateCartIcon();
});
