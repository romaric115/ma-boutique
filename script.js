// === Gestion du panier ===

// Charger le panier sauvegardé (si présent)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Fonction pour mettre à jour l'affichage du panier
function updateCartDisplay() {
  const cartContainer = document.querySelector('#cart-items');
  const cartTotal = document.querySelector('#cart-total');

  if (!cartContainer || !cartTotal) return;

  cartContainer.innerHTML = '';

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Votre panier est vide.</p>';
    cartTotal.textContent = '0.00 €';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const productRow = document.createElement('div');
    productRow.classList.add('cart-item');
    productRow.innerHTML = `
      <div>
        <strong>${item.name}</strong><br>
        Prix : ${item.price.toFixed(2)} €<br>
        Quantité : ${item.quantity}
      </div>
      <button class="remove-btn" data-index="${index}">Supprimer</button>
    `;
    cartContainer.appendChild(productRow);
  });

  cartTotal.textContent = total.toFixed(2) + ' €';

  // Gérer la suppression d'articles
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      cart.splice(index, 1);
      saveCart();
      updateCartDisplay();
    });
  });
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

// === Lier les boutons "Ajouter au panier" ===
document.addEventListener('DOMContentLoaded', () => {
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
