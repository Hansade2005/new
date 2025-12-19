// Cart Page JavaScript

class CartPage {
    constructor() {
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
    }

    renderCart() {
        const cart = window.eliteShop.cart;
        const container = document.getElementById('cartLayout');

        if (cart.length === 0) {
            this.renderEmptyCart(container);
            return;
        }

        this.renderCartWithItems(container);
    }

    renderEmptyCart(container) {
        container.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="products.html" class="btn btn-primary btn-large">
                    <i class="fas fa-shopping-bag"></i>
                    Start Shopping
                </a>
            </div>
        `;
    }

    renderCartWithItems(container) {
        const cart = window.eliteShop.cart;
        const { formatPrice } = window.EliteShopData.utils;

        const subtotal = window.eliteShop.getCartTotal();
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08; // 8% tax
        const total = subtotal + shipping + tax;

        container.innerHTML = `
            <div class="cart-items">
                <div class="cart-header">
                    <h2>Cart Items (${cart.length})</h2>
                    <button class="btn btn-outline btn-small" id="clearCartBtn">
                        <i class="fas fa-trash"></i>
                        Clear Cart
                    </button>
                </div>

                <div class="cart-items-list">
                    ${cart.map((item, index) => this.createCartItem(item, index)).join('')}
                </div>
            </div>

            <div class="cart-summary">
                <div class="cart-summary-content">
                    <h3>Order Summary</h3>

                    <div class="summary-row">
                        <span>Subtotal (${cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>

                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>

                    <div class="summary-row">
                        <span>Tax</span>
                        <span>${formatPrice(tax)}</span>
                    </div>

                    ${shipping === 0 ? `
                        <div class="free-shipping-notice">
                            <i class="fas fa-truck"></i>
                            You've qualified for free shipping!
                        </div>
                    ` : `
                        <div class="shipping-threshold">
                            <i class="fas fa-info-circle"></i>
                            Add ${formatPrice(50 - subtotal)} more for free shipping
                        </div>
                    `}

                    <div class="summary-total">
                        <span>Total</span>
                        <span>${formatPrice(total)}</span>
                    </div>

                    <div class="cart-actions">
                        <a href="checkout.html" class="btn btn-primary btn-large btn-block">
                            <i class="fas fa-credit-card"></i>
                            Proceed to Checkout
                        </a>
                        <a href="products.html" class="btn btn-outline btn-large btn-block">
                            <i class="fas fa-shopping-bag"></i>
                            Continue Shopping
                        </a>
                    </div>
                </div>

                <div class="cart-promotions">
                    <div class="promo-code">
                        <input type="text" placeholder="Enter promo code" id="promoCode">
                        <button class="btn btn-outline btn-small" id="applyPromoBtn">Apply</button>
                    </div>

                    <div class="cart-benefits">
                        <div class="benefit-item">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure Checkout</span>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-undo"></i>
                            <span>Easy Returns</span>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-headset"></i>
                            <span>24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCartItem(item, index) {
        const { formatPrice } = window.EliteShopData.utils;

        return `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>

                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" data-index="${index}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-index="${index}">
                            <button class="quantity-btn increase" data-index="${index}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-item-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                            Remove
                        </button>
                    </div>
                </div>

                <div class="cart-item-total">
                    <div class="item-total-price">${formatPrice(item.price * item.quantity)}</div>
                    <button class="wishlist-move-btn" data-index="${index}">
                        <i class="fas fa-heart"></i>
                        Move to Wishlist
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Quantity controls
        document.addEventListener('click', (e) => {
            if (e.target.closest('.quantity-btn.decrease')) {
                const index = parseInt(e.target.closest('.quantity-btn').dataset.index);
                this.updateItemQuantity(index, -1);
            }

            if (e.target.closest('.quantity-btn.increase')) {
                const index = parseInt(e.target.closest('.quantity-btn').dataset.index);
                this.updateItemQuantity(index, 1);
            }

            if (e.target.closest('.remove-item-btn')) {
                const index = parseInt(e.target.closest('.remove-item-btn').dataset.index);
                this.removeItem(index);
            }

            if (e.target.closest('.wishlist-move-btn')) {
                const index = parseInt(e.target.closest('.wishlist-move-btn').dataset.index);
                this.moveToWishlist(index);
            }

            if (e.target.closest('#clearCartBtn')) {
                this.clearCart();
            }
        });

        // Quantity input changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const index = parseInt(e.target.dataset.index);
                const newQuantity = parseInt(e.target.value);
                if (newQuantity >= 1 && newQuantity <= 99) {
                    this.setItemQuantity(index, newQuantity);
                } else {
                    e.target.value = window.eliteShop.cart[index].quantity;
                }
            }
        });

        // Promo code
        document.addEventListener('click', (e) => {
            if (e.target.id === 'applyPromoBtn') {
                this.applyPromoCode();
            }
        });
    }

    updateItemQuantity(index, change) {
        const item = window.eliteShop.cart[index];
        const newQuantity = Math.max(1, Math.min(99, item.quantity + change));

        if (newQuantity !== item.quantity) {
            window.eliteShop.updateCartItemQuantity(item.id, newQuantity);
            this.renderCart();
        }
    }

    setItemQuantity(index, quantity) {
        const item = window.eliteShop.cart[index];
        window.eliteShop.updateCartItemQuantity(item.id, quantity);
        this.renderCart();
    }

    removeItem(index) {
        const item = window.eliteShop.cart[index];
        if (confirm(`Remove "${item.name}" from cart?`)) {
            window.eliteShop.removeFromCart(item.id);
            this.renderCart();
        }
    }

    moveToWishlist(index) {
        const item = window.eliteShop.cart[index];
        window.eliteShop.toggleWishlist(item.id);
        window.eliteShop.removeFromCart(item.id);
        window.eliteShop.showNotification(`${item.name} moved to wishlist`, 'success');
        this.renderCart();
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            window.eliteShop.cart = [];
            window.eliteShop.saveCart();
            this.renderCart();
            window.eliteShop.showNotification('Cart cleared', 'info');
        }
    }

    applyPromoCode() {
        const promoCode = document.getElementById('promoCode').value.trim().toUpperCase();

        if (!promoCode) {
            window.eliteShop.showNotification('Please enter a promo code', 'warning');
            return;
        }

        // Simple promo code validation (for demo)
        const validCodes = {
            'SAVE10': 10,
            'WELCOME20': 20,
            'FLASH50': 50
        };

        if (validCodes[promoCode]) {
            window.eliteShop.showNotification(`${promoCode} applied! ${validCodes[promoCode]}% off`, 'success');
            // In a real app, you'd apply the discount to the cart
        } else {
            window.eliteShop.showNotification('Invalid promo code', 'error');
        }
    }
}

// Additional CSS for cart page
const cartPageStyles = `
    .cart-section {
        padding: 2rem 0;
        min-height: 60vh;
    }

    .cart-title {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 2rem;
        text-align: center;
    }

    .cart-layout {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
        align-items: start;
    }

    .empty-cart {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
    }

    .empty-cart i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .empty-cart h2 {
        font-size: 1.875rem;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .empty-cart p {
        margin-bottom: 2rem;
    }

    .cart-items {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .cart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
    }

    .cart-header h2 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
    }

    .cart-items-list {
        max-height: 600px;
        overflow-y: auto;
    }

    .cart-item {
        display: flex;
        gap: 1rem;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.2s;
    }

    .cart-item:hover {
        background: #f9fafb;
    }

    .cart-item:last-child {
        border-bottom: none;
    }

    .cart-item-image {
        flex-shrink: 0;
    }

    .cart-item-image img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
    }

    .cart-item-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .cart-item-title {
        font-size: 1rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
    }

    .cart-item-price {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .cart-item-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
    }

    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .quantity-btn {
        width: 32px;
        height: 32px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #374151;
        transition: all 0.2s;
    }

    .quantity-btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }

    .quantity-input {
        width: 50px;
        height: 32px;
        text-align: center;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .remove-item-btn {
        padding: 0.5rem 1rem;
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .remove-item-btn:hover {
        background: #dc2626;
        color: white;
    }

    .cart-item-total {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
        min-width: 120px;
    }

    .item-total-price {
        font-size: 1rem;
        font-weight: 600;
        color: #111827;
    }

    .wishlist-move-btn {
        padding: 0.25rem 0.75rem;
        background: transparent;
        color: #6b7280;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .wishlist-move-btn:hover {
        background: #f9fafb;
        color: #374151;
    }

    .cart-summary {
        position: sticky;
        top: 100px;
    }

    .cart-summary-content {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .cart-summary h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1.5rem;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .summary-row:last-of-type {
        margin-bottom: 1rem;
    }

    .free-shipping-notice,
    .shipping-threshold {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 0.875rem;
        margin: 1rem 0;
    }

    .free-shipping-notice {
        background: #dcfce7;
        color: #166534;
    }

    .shipping-threshold {
        background: #fef3c7;
        color: #92400e;
    }

    .summary-total {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.125rem;
        font-weight: 700;
        color: #111827;
        padding: 1rem 0;
        border-top: 2px solid #e5e7eb;
        margin: 1rem 0;
    }

    .cart-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .btn-block {
        width: 100%;
        justify-content: center;
    }

    .cart-promotions {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }

    .promo-code {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
    }

    .promo-code input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
    }

    .cart-benefits {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .benefit-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .benefit-item i {
        color: #10b981;
        width: 16px;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .cart-layout {
            grid-template-columns: 1fr;
        }

        .cart-summary {
            position: static;
        }

        .cart-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
        }

        .cart-item {
            flex-direction: column;
            gap: 1rem;
        }

        .cart-item-controls {
            justify-content: flex-start;
            gap: 1rem;
        }

        .cart-item-total {
            align-items: flex-start;
            flex-direction: row;
            justify-content: space-between;
        }
    }

    @media (max-width: 480px) {
        .cart-item-image img {
            width: 60px;
            height: 60px;
        }

        .cart-item-controls {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }

        .quantity-controls {
            align-self: stretch;
            justify-content: center;
        }

        .cart-item-total {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
        }
    }
`;

// Add cart page styles
const style = document.createElement('style');
style.textContent = cartPageStyles;
document.head.appendChild(style);

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('cart.html')) {
        window.cartPage = new CartPage();
    }
});