// === Gestion complète du panier MaBoutique ===
// Auteur : toi 😉
// Version : 2.0 (moderne et stable)

// 🧺 Récupérer le panier depuis le stockage local
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// 💾 Sauvegarde du panier
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// 🧮 Mettre à jour l'affichage du nombre d'articles
function updateCartCount() {
  const countEl = document.querySelector('.cart-count');
  if (!countEl) return;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = totalItems;
}

// 🧾 Mettre à jour la liste des produits dans le mini-panier
function renderCart() {
  const cartList = document.querySelector('.cart-list');
  const totalEl = document.querySelector('.cart-total');
  if (!cartList || !totalEl) return;

  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = '<p>Votre panier est vide.</p>';
    totalEl.textContent = '0 €';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('div');
    li.className = 'cart-item';
    li.innerHTML = `
      <span>${item.name}</span>
      <span>${item.price}€ × ${item.quantity}</span>
      <button class="remove-btn" data-name="${item.name}">🗑️</button>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalEl.textContent = total.toFixed(2) + ' €';
}

// ➕ Ajouter un article au panier
function addToCart(name, price) {
  const existing = cart.find(p => p.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartCount();
  renderCart();
  alert(`✅ ${name} a été ajouté au panier.`);
}

// ❌ Supprimer un article du panier
function removeFromCart(name) {
  cart = cart.filter(p => p.name !== name);
  saveCart();
  updateCartCount();
  renderCart();
}

// 🧹 Vider tout le panier
function clearCart() {
  if (confirm("Voulez-vous vraiment vider le panier ?")) {
    cart = [];
    saveCart();
    updateCartCount();
    renderCart();
  }
}

// 🪄 Initialisation des boutons et événements
document.addEventListener('
