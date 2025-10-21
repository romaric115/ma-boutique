// === Gestion du panier (version sans pop-up) ===

// Charger le panier depuis le stockage local
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
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
}

// === Liaison des boutons ===
document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.add-to-cart');

  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart(name, price);
      alert(`${name} a été ajouté au panier !`);
    });
  });

  updateCartDisplay();
});
