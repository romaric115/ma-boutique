// === Gestion du panier simple sans fenêtre bloquante ===

// Charger le panier sauvegardé (s’il existe)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Sauvegarder le panier dans le stockage local
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Mettre à jour l’affichage du panier
function updateCartDisplay() {
  const cartCount = document.querySelector('#cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
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
  alert(`${name} a été ajouté au panier 🛒`);
}

// Supprimer un produit du panier (si jamais tu veux l’ajouter plus tard)
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  updateCartDisplay();
}

// Initialisation après chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  // Lier les boutons “Ajouter au panier”
  const addButtons = document.querySelectorAll('.add-to-cart');
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = parseFloat(button.getAttribute('data-price'));
      addToCart(name, price);
    });
  });

  updateCartDisplay();
});
