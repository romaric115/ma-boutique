let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    alert(`${name} ajouté au panier !`);
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const total = document.getElementById("total");
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price;
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.price}€ `;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Supprimer";
        removeBtn.onclick = () => {
            cart.splice(index, 1);
            updateCart();
        };
        li.appendChild(removeBtn);
        cartItems.appendChild(li);
    });

    total.textContent = `Total : ${totalPrice}€`;
}

document.getElementById("view-cart").onclick = () => {
    document.getElementById("cart").classList.toggle("hidden");
};

document.getElementById("checkout").onclick = () => {
    alert("Merci pour votre commande !");
    cart = [];
    updateCart();
    document.getElementById("cart").classList.add("hidden");
};