// === Gestion simple du panier (version stable sans pop-up) ===

// Charger le panier depuis le stockage local
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mettre à jour l'affichage du nombre d'articles
function updateCartDisplay() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

// Sauvegarder le panier dans le stockage local
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Ajouter un produit au panier
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  saveCart();
  updateCartDisplay();
  alert(`${name} a été ajouté au panier !`);
}

// Supprimer un produit du panier
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  updateCartDisplay();
}

// Vider le panier
function clearCart() {
  cart = [];
  saveCart();
  updateCartDisplay();
  alert("Le panier a été vidé.");
}

// === Initialisation ===
document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();

  // Exemple de boutons à connecter :
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      addToCart(name, price);
    });
  });
});
