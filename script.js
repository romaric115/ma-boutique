/* ---------- Données produits (exemples) ---------- */
/* Remplace/ajoute ici tes produits réels (images, prix, vendeur, catégorie) */
const PRODUCTS = [
  { id: "p1", title: "Chaussures rouges", price: 25.00, img: "https://cdn.pixabay.com/photo/2016/11/29/09/08/shoes-1866933_1280.jpg", category: "Chaussures", seller: "VendeurA" },
  { id: "p2", title: "Casque audio", price: 45.00, img: "https://cdn.pixabay.com/photo/2014/12/03/18/29/headphones-556707_1280.jpg", category: "Électronique", seller: "SoundShop" },
  { id: "p3", title: "Montre noire", price: 30.00, img: "https://cdn.pixabay.com/photo/2016/11/29/03/53/black-watch-1869511_1280.jpg", category: "Accessoires", seller: "TimeStore" },
  { id: "p4", title: "T-shirt coton", price: 12.50, img: "https://cdn.pixabay.com/photo/2016/03/31/19/58/t-shirt-1295149_1280.jpg", category: "Vêtements", seller: "TeesCorner" },
  { id: "p5", title: "Sac à dos", price: 39.99, img: "https://cdn.pixabay.com/photo/2016/03/09/09/17/backpack-1245884_1280.jpg", category: "Bagagerie", seller: "BagWorld" }
];

/* ---------- État ---------- */
let state = {
  products: PRODUCTS.slice(),
  filtered: PRODUCTS.slice(),
  cart: JSON.parse(localStorage.getItem("mb_cart") || "[]"),
};

/* ---------- Helpers ---------- */
function formatPrice(n){ return Number(n).toFixed(2) + "€"; }
function saveCart(){ localStorage.setItem("mb_cart", JSON.stringify(state.cart)); updateCartUI(); }

/* ---------- Initialisation UI ---------- */
document.addEventListener("DOMContentLoaded", () => {
  populateCategoryFilters();
  populateSellerFilter();
  renderProducts(state.products);
  wireEvents();
  updateCartUI();
});

/* ---------- Rendu produits ---------- */
function renderProducts(list){
  const container = document.getElementById("products");
  container.innerHTML = "";
  if(!list.length){
    document.getElementById("no-results").classList.remove("hidden");
    return;
  } else {
    document.getElementById("no-results").classList.add("hidden");
  }
  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" loading="lazy" />
      <h3>${escapeHtml(p.title)}</h3>
      <div class="meta">
        <div class="badge">${escapeHtml(p.seller)}</div>
        <div><strong>${formatPrice(p.price)}</strong></div>
      </div>
      <p class="small">${escapeHtml(p.category)}</p>
      <div class="product-actions">
        <button class="btn secondary" onclick="openProductModal('${p.id}')">Voir</button>
        <button class="btn primary" onclick="addToCart('${p.id}')">Ajouter</button>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ---------- Escape HTML simple ---------- */
function escapeHtml(s){ return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;'}[c])); }

/* ---------- Filtrage / Recherche / Tri ---------- */
function populateCategoryFilters(){
  const select = document.getElementById("category-filter");
  const categories = Array.from(new Set(PRODUCTS.map(p=>p.category)));
  categories.forEach(cat => {
    const o = document.createElement("option"); o.value = cat; o.textContent = cat; select.appendChild(o);
  });
  // aussi bar de catégories
  const bar = document.getElementById("categories-bar");
  bar.innerHTML = `<div class="category-chip active" data-cat="all">Toutes</div>`;
  categories.forEach(c=>{
    const chip = document.createElement("div");
    chip.className = "category-chip";
    chip.textContent = c;
    chip.dataset.cat = c;
    chip.onclick = () => {
      document.querySelectorAll(".category-chip").forEach(el=>el.classList.remove("active"));
      chip.classList.add("active");
      document.getElementById("category-filter").value = c;
      applyFilters();
    };
    bar.appendChild(chip);
  });
}

function populateSellerFilter(){
  const sel = document.getElementById("seller-filter");
  const sellers = Array.from(new Set(PRODUCTS.map(p=>p.seller)));
  sellers.forEach(s => {
    const o = document.createElement("option"); o.value = s; o.textContent = s; sel.appendChild(o);
  });
}

function applyFilters(){
  const q = (document.getElementById("search").value || "").trim().toLowerCase();
  const cat = document.getElementById("category-filter").value;
  const seller = document.getElementById("seller-filter").value;
  let list = PRODUCTS.filter(p => {
    const matchesQ = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q);
    const matchesCat = (cat === "all") || (p.category === cat);
    const matchesSeller = (seller === "all") || (p.seller === seller);
    return matchesQ && matchesCat && matchesSeller;
  });

  // tri
  const sort = document.getElementById("sort").value;
  if(sort === "price-asc") list.sort((a,b)=>a.price - b.price);
  else if(sort === "price-desc") list.sort((a,b)=>b.price - a.price);

  state.filtered = list;
  renderProducts(list);
}

/* ---------- Cart ---------- */
function addToCart(productId){
  const p = PRODUCTS.find(x=>x.id === productId);
  if(!p) return alert("Produit introuvable");
  state.cart.push({ id: p.id, title: p.title, price: p.price, qty: 1, seller: p.seller });
  saveCart();
  alert(`${p.title} ajouté au panier`);
}

function updateCartUI(){
  const count = state.cart.reduce((s,i)=>s + (i.qty||1), 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-items-count").textContent = count;

  const itemsDiv = document.getElementById("cart-items");
  itemsDiv.innerHTML = "";
  let total = 0.0;
  state.cart.forEach((it, idx) => {
    total += Number(it.price) * (it.qty || 1);
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div>
        <div><strong>${escapeHtml(it.title)}</strong></div>
        <div class="small">${escapeHtml(it.seller)} • ${escapeHtml(it.qty||1)} × ${formatPrice(it.price)}</div>
      </div>
      <div style="text-align:right">
        <div><strong>${formatPrice((it.price) * (it.qty||1))}</strong></div>
        <div style="margin-top:6px">
          <button onclick="changeQty(${idx}, -1)">-</button>
          <button onclick="changeQty(${idx}, 1)">+</button>
          <button onclick="removeFromCart(${idx})">Suppr</button>
        </div>
      </div>
    `;
    itemsDiv.appendChild(row);
  });

  document.getElementById("cart-total").textContent = formatPrice(total);
  saveCartNoUI();
}

/* helper saves without re-triggering updateCartUI */
function saveCartNoUI(){ localStorage.setItem("mb_cart", JSON.stringify(state.cart)); }

function changeQty(index, delta){
  if(!state.cart[index]) return;
  state.cart[index].qty = Math.max(1, (state.cart[index].qty || 1) + delta);
  saveCart();
}

function removeFromCart(index){
  state.cart.splice(index, 1);
  saveCart();
}

/* ---------- Modal produit ---------- */
function openProductModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById("product-modal");
  const content = document.getElementById("modal-content");
  content.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px">
      <img src="${p.img}" alt="${p.title}" style="width:100%;height:280px;object-fit:cover;border-radius:8px" />
      <h2>${escapeHtml(p.title)}</h2>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div class="badge">${escapeHtml(p.seller)}</div>
        <div style="font-size:1.1rem"><strong>${formatPrice(p.price)}</strong></div>
      </div>
      <p class="small">Catégorie: ${escapeHtml(p.category)}</p>
      <p style="margin-top:10px;color:var(--muted)">Description demo: ceci est une fiche produit. Ajoute ta description réelle ici.</p>
      <div style="display:flex;gap:8px">
        <button class="btn secondary" onclick="closeModal()">Fermer</button>
        <button class="btn primary" onclick="addToCart('${p.id}'); closeModal()">Ajouter au panier</button>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
}
function closeModal(){ document.getElementById("product-modal").classList.add("hidden"); }

/* ---------- Checkout (simulé) ---------- */
function openCheckout(){
  if(!state.cart.length) return alert("Ton panier est vide.");
  // remplissage résumé
  const container = document.getElementById("checkout-items");
  container.innerHTML = "";
  let total=0;
  state.cart.forEach(it=>{
    const div = document.createElement("div");
    div.style.marginBottom="8px";
    div.innerHTML = `<div><strong>${escapeHtml(it.title)}</strong> • ${escapeHtml(it.seller)}</div>
      <div class="small">${escapeHtml(it.qty||1)} × ${formatPrice(it.price)} = <strong>${formatPrice((it.qty||1)*it.price)}</strong></div>`;
    container.appendChild(div);
    total += (it.qty||1)*it.price;
  });
  document.getElementById("checkout-total").textContent = formatPrice(total);
  document.getElementById("checkout-page").classList.remove("hidden");
}

/* simulate payment */
function confirmPayment(){
  // simulation : vider le panier
  state.cart = [];
  saveCart();
  document.getElementById("checkout-page").classList.add("hidden");
  alert("Paiement simulé réussi. Merci pour votre commande !");
}

/* ---------- Événements ---------- */
function wireEvents(){
  document.getElementById("search-btn").onclick = applyFilters;
  document.getElementById("search").onkeydown = (e)=>{ if(e.key === "Enter") applyFilters(); };
  document.getElementById("category-filter").onchange = applyFilters;
  document.getElementById("sort").onchange = applyFilters;
  document.getElementById("seller-filter").onchange = applyFilters;

  document.getElementById("cart-btn").onclick = () => {
    document.getElementById("cart-drawer").classList.toggle("hidden");
  };
  document.getElementById("close-cart").onclick = () => {
    document.getElementById("cart-drawer").classList.add("hidden");
  };
  document.getElementById("close-modal").onclick = closeModal;

  document.getElementById("checkout-btn").onclick = openCheckout;
  document.getElementById("close-checkout").onclick = () => document.getElementById("checkout-page").classList.add("hidden");
  document.getElementById("confirm-payment").onclick = confirmPayment;

  document.getElementById("explore-btn").onclick = ()=> window.scrollTo({top:400,behavior:"smooth"});
}

/* ---------- Utility: change qty and remove from cart from UI ---------- */
/* Exposées globalement to be used from inline onclicks */
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.openProductModal = openProductModal;
window.addToCart = (productId) => { addToCart(productId); };

/* ---------- End ---------- */
