// Simple cart management using localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (cartItems && cartTotal) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
            cartTotal.textContent = '0.00';
        } else {
            let total = 0;
            cartItems.innerHTML = cart.map(item => {
                total += item.price * item.quantity;
                return `
                    <div class="cart-item">
                        <div>
                            <h3>${item.name}</h3>
                            <p>$${item.price} x ${item.quantity}</p>
                        </div>
                        <button onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                `;
            }).join('');
            cartTotal.textContent = total.toFixed(2);
        }
    }
}

function addToCart(productId) {
    // Mock product data - in a real app, this would come from a database
    const products = [
        { id: 1, name: 'Product 1', price: 29.99 },
        { id: 2, name: 'Product 2', price: 39.99 },
        { id: 3, name: 'Product 3', price: 19.99 },
        { id: 4, name: 'Product 4', price: 49.99 },
        { id: 5, name: 'Product 5', price: 24.99 },
        { id: 6, name: 'Product 6', price: 34.99 }
    ];

    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} added to cart!`);
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your purchase!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'index.html';
        });
    }

    updateCartDisplay();
});