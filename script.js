/* script.js - AlimentationShop
   - produit simple SPA
   - stockage local : users et cart
   - paiement : instructions Orange Money / Moov Money (simulation)
*/

/* ---------- Données produits (exemples variés) ---------- */
const PRODUCTS = [
  { id: "p1", title: "Riz 5kg", price: 4200, img: "https://images.unsplash.com/photo-1585238342029-3b56b8b2b6c7?w=800&q=60&auto=format&fit=crop", category: "Alimentation" },
  { id: "p2", title: "Sucre 2kg", price: 1200, img: "https://images.unsplash.com/photo-1603383288810-24b1f4f9aa3f?w=800&q=60&auto=format&fit=crop", category: "Alimentation" },
  { id: "p3", title: "Savon liquide 1L", price: 2500, img: "https://images.unsplash.com/photo-1581579182979-d2ff3f822b59?w=800&q=60&auto=format&fit=crop", category: "Hygiène" },
  { id: "p4", title: "Shampoing 400ml", price: 3100, img: "https://images.unsplash.com/photo-1592878849126-f1d3b5bea0b9?w=800&q=60&auto=format&fit=crop", category: "Hygiène" },
  { id: "p5", title: "T-shirt coton", price: 4500, img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=60&auto=format&fit=crop", category: "Vêtements" },
  { id: "p6", title: "Biscuit pack", price: 900, img: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=60&auto=format&fit=crop", category: "Snacks" },
  { id: "p7", title: "Lampe USB", price: 5200, img: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=60&auto=format&fit=crop", category: "Maison" },
  { id: "p8", title: "Cahier 100p", price: 600, img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=60&auto=format&fit=crop", category: "Papeterie" },
  { id: "p9", title: "Café moulu 250g", price: 1500, img: "https://images.unsplash.com/photo-1512207844294-4d28d8b9b2a3?w=800&q=60&auto=format&fit=crop", category: "Boissons" },
  { id: "p10", title: "Couches bébé", price: 9800, img: "https://images.unsplash.com/photo-1581561399991-9d3f8d2a3e4b?w=800&q=60&auto=format&fit=crop", category: "Bébé" }
];

/* ---------- Categories (liste complète) ---------- */
const CATEGORIES = ["Alimentation","Boissons","Snacks","Hygiène","Maison","Vêtements","Papeterie","Électronique","Bébé","Accessoires","Santé","Jardin"];

/* ---------- State & stockage ---------- */
let state = {
  view: 'home', // home, products, signup, login, contact, checkout
  user: JSON.parse(localStorage.getItem('as_user')) || null,
  users: JSON.parse(localStorage.getItem('as_users') || '[]'),
  cart: JSON.parse(localStorage.getItem('as_cart') || '[]'),
  history: []
};

/* ---------- Helpers ---------- */
function $id(id){ return document.getElementById(id); }
function q(sel){ return document.querySelector(sel); }
function qAll(sel){ return Array.from(document.querySelectorAll(sel)); }
function formatPrice(n){ return Number(n).toFixed(0) + ' FCFA'; }

/* ---------- NAVIGATION (vues) ---------- */
function showView(name){
  // push prev
  if(state.view !== name) state.history.push(state.view);
  state.view = name;
  // hide all views
  qAll('.view').forEach(el => el.classList.add('hidden'));
  // show requested
  const viewEl = $id(name + '-view') || $id(name + '-view'); // fallback
  if(viewEl) viewEl.classList.remove('hidden');
  // special: products
  if(name === 'products') { renderProductsList(PRODUCTS); }
  // special: home render featured
  if(name === 'home') { renderFeatured(); }
}

/* back */
function goBack(){
  const prev = state.history.pop();
  if(prev) showView(prev);
  else showView('home');
}

/* ---------- MENU & DRAWER ---------- */
function openMenu(){ $id('menu-drawer').classList.remove('hidden'); $id('backdrop').classList.remove('hidden'); }
function closeMenu(){ $id('menu-drawer').classList.add('hidden'); $id('backdrop').classList.add('hidden'); }

/* ---------- RENDER HOME / FEATURED ---------- */
function renderCategories(){
  const list = $id('categories-list');
  list.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'category';
    div.textContent = '📦 ' + cat;
    div.onclick = () => { applyCategoryFilter(cat); showView('products'); };
    list.appendChild(div);
  });
  // populate category filter select
  const sel = $id('category-filter');
  if(sel){
    sel.innerHTML = '<option value="all">Toutes catégories</option>';
    CATEGORIES.forEach(c => {
      const o = document.createElement('option'); o.value = c; o.textContent = c; sel.appendChild(o);
    });
  }
}

function renderFeatured(){
  const grid = $id('products-grid');
  grid.innerHTML = '';
  // show first 6 as featured
  PRODUCTS.slice(0,6).forEach(p => {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${formatPrice(p.price)}</p>
      <button class="add-btn" data-id="${p.id}">Ajouter au panier</button>
    `;
    grid.appendChild(card);
  });
}

/* ---------- PRODUCTS LIST ---------- */
function renderProductsList(list){
  const grid = $id('products-list');
  const no = $id('no-results');
  grid.innerHTML = '';
  if(!list.length){ no.classList.remove('hidden'); return; }
  no.classList.add('hidden');
  list.forEach(p => {
    const card = document.createElement('article');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${formatPrice(p.price)}</p>
      <div style="display:flex;gap:8px;">
        <button class="add-btn" data-id="${p.id}">Ajouter</button>
        <button class="view-btn" data-id="${p.id}">Voir</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* search & filters */
function applySearch(q){
  q = String(q || '').trim().toLowerCase();
  const cat = $id('category-filter') ? $id('category-filter').value : 'all';
  let list = PRODUCTS.filter(p => {
    const inCat = (cat === 'all') || (p.category === cat);
    const matches = !q || p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return inCat && matches;
  });
  const sort = $id('sort-filter') ? $id('sort-filter').value : 'relevance';
  if(sort === 'price-asc') list.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') list.sort((a,b)=>b.price-a.price);
  renderProductsList(list);
}
function applyCategoryFilter(cat){
  if($id('category-filter')) $id('category-filter').value = cat;
  applySearch($id('top-search').value);
}

/* ---------- CART ---------- */
function saveCart(){ localStorage.setItem('as_cart', JSON.stringify(state.cart)); updateCartUI(); }
function updateCartUI(){
  $id('cart-count').textContent = state.cart.reduce((s,i)=>s + i.qty, 0);
  $id('cart-total').textContent = formatPrice(state.cart.reduce((s,i)=>s + i.qty * i.price, 0));
  // render items in drawer
  const items = $id('cart-items');
  items.innerHTML = '';
  if(state.cart.length === 0){ items.innerHTML = '<p>Panier vide</p>'; return; }
  state.cart.forEach((it,idx)=>{
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div>
      <strong>${it.title}</strong><div class="small">${it.qty} × ${formatPrice(it.price)}</div>
    </div>
    <div>
      <button class="qty-btn" data-idx="${idx}" data-d="-1">-</button>
      <button class="qty-btn" data-idx="${idx}" data-d="1">+</button>
      <button class="remove-btn" data-idx="${idx}">Suppr</button>
    </div>`;
    items.appendChild(div);
  });
}
function addToCartById(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return alert('Produit introuvable');
  const existing = state.cart.find(i=>i.id===id);
  if(existing){ existing.qty += 1; } else {
    state.cart.push({ id:p.id, title:p.title, price:p.price, qty:1 });
  }
  saveCart();
}
function changeQty(idx,delta){
  if(!state.cart[idx]) return;
  state.cart[idx].qty = Math.max(1, state.cart[idx].qty + delta);
  saveCart();
}
function removeFromCart(idx){
  state.cart.splice(idx,1);
  saveCart();
}
function clearCart(){
  if(confirm('Vider complètement le panier ?')){ state.cart = []; saveCart(); }
}

/* ---------- USERS (simple local auth) ---------- */
function saveUsers(){ localStorage.setItem('as_users', JSON.stringify(state.users)); }
function registerUser(data){
  // data: {firstName,lastName,phone,email,password}
  if(state.users.some(u=>u.phone === data.phone)) return { ok:false, msg:'Numéro déjà utilisé' };
  state.users.push(data);
  saveUsers();
  localStorage.setItem('as_user', JSON.stringify(data));
  state.user = data;
  return { ok:true };
}
function loginUser(phone,password){
  const u = state.users.find(x=>x.phone === phone && x.password === password);
  if(!u) return { ok:false };
  state.user = u;
  localStorage.setItem('as_user', JSON.stringify(u));
  return { ok:true, user:u };
}
function logoutUser(){ state.user = null; localStorage.removeItem('as_user'); }

/* ---------- UI Wiring ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // initial render
  renderCategories();
  renderFeatured();
  // populate products page with categories
  if($id('category-filter')){
    CATEGORIES.forEach(c=>{
      const o = document.createElement('option'); o.value=c; o.textContent=c; $id('category-filter').appendChild(o);
    });
  }

  // menu open/close
  $id('menu-btn').onclick = openMenu;
  $id('close-menu').onclick = closeMenu;
  $id('backdrop').onclick = ()=>{ closeMenu(); closeCart(); };

  // header buttons
  $id('explore-btn').onclick = ()=> { showView('products'); renderProductsList(PRODUCTS); closeMenu(); };
  $id('contact-cta').onclick = ()=> { showView('contact'); closeMenu(); };
  $id('signup-btn').onclick = ()=> { showView('signup'); closeMenu(); };
  $id('login-btn').onclick = ()=> { showView('login'); closeMenu(); };

  // top search
  $id('top-search-btn').onclick = ()=> { applySearch($id('top-search').value); showView('products'); };
  $id('top-search').addEventListener('keydown', e=> { if(e.key === 'Enter'){ applySearch($id('top-search').value); showView('products'); } });

  // drawer search link
  $id('drawer-search-link').onclick = (e)=>{ e.preventDefault(); closeMenu(); $id('top-search').focus(); }

  // products actions (delegation)
  document.body.addEventListener('click', e=>{
    if(e.target.classList.contains('add-btn')){
      const id = e.target.getAttribute('data-id');
      addToCartById(id);
      alert('Produit ajouté au panier');
    }
    if(e.target.classList.contains('view-btn')){
      const id = e.target.getAttribute('data-id');
      const p = PRODUCTS.find(x=>x.id===id);
      if(p) alert(`${p.title}\nPrix: ${formatPrice(p.price)}\nCatégorie: ${p.category}`);
    }
    if(e.target.id === 'cart-toggle'){ openCart(); }
    if(e.target.id === 'close-cart'){ closeCart(); }
    if(e.target.id === 'checkout-btn'){ showView('checkout'); closeCart(); }
    if(e.target.id === 'clear-cart-btn'){ clearCart(); }
    if(e.target.id === 'mark-paid'){ 
      // simulate payment success
      state.cart = []; saveCart();
      alert('Merci, paiement enregistré (simulation).');
      showView('home');
    }
    if(e.target.classList.contains('qty-btn')){
      const idx = parseInt(e.target.dataset.idx,10);
      const d = parseInt(e.target.dataset.d,10);
      changeQty(idx,d);
    }
    if(e.target.classList.contains('remove-btn')){
      const idx = parseInt(e.target.dataset.idx,10);
      removeFromCart(idx);
    }
  });

  // cart drawer open/close
  function openCart(){ $id('cart-drawer').classList.remove('hidden'); $id('backdrop').classList.remove('hidden'); updateCartUI(); }
  function closeCart(){ $id('cart-drawer').classList.add('hidden'); $id('backdrop').classList.add('hidden'); }

  // expose to global for use above
  window.openCart = openCart;
  window.closeCart = closeCart;

  // cart buttons
  $id('cart-toggle').onclick = openCart;
  $id('close-cart').onclick = closeCart;

  // checkout cancel
  if($id('cancel-checkout')) $id('cancel-checkout').onclick = ()=> showView('home');

  // signup form
  $id('signup-form').onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(this);
    const data = {
      lastName: fd.get('lastName').trim(),
      firstName: fd.get('firstName').trim(),
      phone: fd.get('phone').trim(),
      email: fd.get('email') ? fd.get('email').trim() : '',
      password: fd.get('password')
    };
    if(!data.phone || !data.password || !data.firstName) return alert('Remplissez les champs requis');
    const res = registerUser(data);
    if(!res.ok) return alert(res.msg || 'Erreur inscription');
    alert('Inscription réussie. Vous êtes connecté.');
    showView('home');
  };
  $id('cancel-signup').onclick = ()=> showView('home');

  // login form
  $id('login-form').onsubmit = function(e){
    e.preventDefault();
    const fd = new FormData(this);
    const phone = fd.get('phone').trim();
    const password = fd.get('password');
    const res = loginUser(phone,password);
    if(!res.ok) return alert('Identifiants incorrects');
    alert('Connexion réussie. Bienvenue ' + (res.user.firstName || ''));
    showView('home');
  };
  $id('cancel-login').onclick = ()=> showView('home');
  $id('goto-signup').onclick = (e)=> { e.preventDefault(); showView('signup'); };

  // contact form
  $id('contact-form').onsubmit = function(e){
    e.preventDefault();
    alert('Message envoyé (simulation). Nous vous contacterons bientôt.');
    this.reset();
  };
  $id('cancel-contact').onclick = ()=> showView('home');

  // back button
  $id('back-btn').onclick = goBack;

  // init cart render
  updateCartUI();

  // close any drawer when pressing ESC
  document.addEventListener('keydown', e=> {
    if(e.key === 'Escape'){ closeMenu(); closeCart(); }
  });

  // fill menu links behavior
  qAll('.drawer-nav a[data-view]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const view = a.dataset.view;
      showView(view);
      closeMenu();
    });
  });

});
