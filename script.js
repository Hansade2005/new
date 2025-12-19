// EliteShop - Main JavaScript Application

class EliteShop {
    constructor() {
        this.cart = this.loadCart();
        this.wishlist = this.loadWishlist();
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.loadFeaturedProducts();
        this.setupScrollToTop();
        this.setupSearch();
        this.checkMobileMenu();
        this.loadPageSpecificContent();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Search toggle
        const searchToggle = document.getElementById('searchToggle');
        if (searchToggle) {
            searchToggle.addEventListener('click', () => this.toggleSearch());
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }

        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu')) {
                this.closeMobileMenu();
            }
        });
    }

    // Mobile Menu Functions
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.toggle('active');
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        mobileMenu.classList.remove('active');
    }

    checkMobileMenu() {
        // Close mobile menu on window resize if desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    // Search Functions
    toggleSearch() {
        const searchBar = document.getElementById('searchBar');
        searchBar.classList.toggle('active');

        if (searchBar.classList.contains('active')) {
            const searchInput = document.getElementById('searchInput');
            searchInput.focus();
        }
    }

    handleSearch(query) {
        if (query.length > 2) {
            const results = window.EliteShopData.utils.searchProducts(query);
            this.displaySearchResults(results);
        } else {
            this.clearSearchResults();
        }
    }

    displaySearchResults(results) {
        // Create or update search results dropdown
        let searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            searchResults = document.createElement('div');
            searchResults.id = 'searchResults';
            searchResults.className = 'search-results';
            document.querySelector('.search-container').appendChild(searchResults);
        }

        if (results.length > 0) {
            searchResults.innerHTML = results.slice(0, 5).map(product => `
                <a href="product-detail.html?id=${product.id}" class="search-result-item">
                    <img src="${product.image}" alt="${product.name}" class="search-result-image">
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <span>${window.EliteShopData.utils.formatPrice(product.price)}</span>
                    </div>
                </a>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            searchResults.style.display = 'block';
        }
    }

    clearSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
    }

    // Cart Functions
    loadCart() {
        const cart = localStorage.getItem('eliteshop_cart');
        return cart ? JSON.parse(cart) : [];
    }

    saveCart() {
        localStorage.setItem('eliteshop_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addToCart(productId, quantity = 1) {
        const product = window.EliteShopData.utils.getProductById(productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }

        this.saveCart();
        this.showNotification(`${product.name} added to cart!`, 'success');
        return true;
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.showNotification('Item removed from cart', 'info');
    }

    updateCartItemQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const count = this.getCartItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Wishlist Functions
    loadWishlist() {
        const wishlist = localStorage.getItem('eliteshop_wishlist');
        return wishlist ? JSON.parse(wishlist) : [];
    }

    saveWishlist() {
        localStorage.setItem('eliteshop_wishlist', JSON.stringify(this.wishlist));
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        const product = window.EliteShopData.utils.getProductById(productId);

        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showNotification(`${product.name} removed from wishlist`, 'info');
        } else {
            this.wishlist.push(productId);
            this.showNotification(`${product.name} added to wishlist!`, 'success');
        }

        this.saveWishlist();
        this.updateWishlistButtons();
    }

    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }

    updateWishlistButtons() {
        document.querySelectorAll('.btn-wishlist').forEach(btn => {
            const productId = parseInt(btn.dataset.productId);
            btn.classList.toggle('active', this.isInWishlist(productId));
        });
    }

    // Product Display Functions
    loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featuredProducts');
        if (!featuredContainer) return;

        const featuredProducts = window.EliteShopData.utils.getFeaturedProducts();
        this.displayProducts(featuredProducts, featuredContainer);
    }

    displayProducts(products, container) {
        container.innerHTML = products.map(product => this.createProductCard(product)).join('');
        this.attachProductCardListeners(container);
    }

    createProductCard(product) {
        const { formatPrice, getStarRating } = window.EliteShopData.utils;
        const stars = getStarRating(product.rating);

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-rating">
                        <div class="product-stars">
                            ${'★'.repeat(stars.full)}${stars.half ? '☆' : ''}${'☆'.repeat(stars.empty)}
                        </div>
                        <span class="product-rating-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price">
                        <span class="product-price-current">${formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? `<span class="product-price-old">${formatPrice(product.originalPrice)}</span>` : ''}
                        ${product.discount > 0 ? `<span class="product-price-discount">-${product.discount}%</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-wishlist ${this.isInWishlist(product.id) ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachProductCardListeners(container) {
        // Add to cart buttons
        container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                this.addToCart(productId);
            });
        });

        // Wishlist buttons
        container.querySelectorAll('.btn-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                this.toggleWishlist(productId);
            });
        });

        // Product card clicks (go to product detail)
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    // Scroll to Top
    setupScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        document.body.appendChild(scrollButton);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollButton.classList.add('show');
            } else {
                scrollButton.classList.remove('show');
            }
        });
    }

    // Newsletter
    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;

        // Simulate API call
        this.showNotification('Thank you for subscribing!', 'success');
        e.target.reset();
    }

    // Notifications
    showNotification(message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Page-specific content loading
    loadPageSpecificContent() {
        const path = window.location.pathname;

        if (path.includes('products.html')) {
            this.loadProductsPage();
        } else if (path.includes('product-detail.html')) {
            this.loadProductDetailPage();
        } else if (path.includes('cart.html')) {
            this.loadCartPage();
        }
    }

    loadProductsPage() {
        // Implementation for products page would go here
        console.log('Products page loaded');
    }

    loadProductDetailPage() {
        // Implementation for product detail page would go here
        console.log('Product detail page loaded');
    }

    loadCartPage() {
        // Implementation for cart page would go here
        console.log('Cart page loaded');
    }
}

// Notification Styles (added dynamically)
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    }

    .notification-success {
        border-left: 4px solid #10b981;
    }

    .notification-error {
        border-left: 4px solid #ef4444;
    }

    .notification-warning {
        border-left: 4px solid #f59e0b;
    }

    .notification-info {
        border-left: 4px solid #2563eb;
    }

    .notification i {
        font-size: 1.25rem;
    }

    .notification-success i { color: #10b981; }
    .notification-error i { color: #ef4444; }
    .notification-warning i { color: #f59e0b; }
    .notification-info i { color: #2563eb; }

    .notification-close {
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        color: #6b7280;
        margin-left: auto;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }

    .search-results {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        max-height: 400px;
        overflow-y: auto;
        display: none;
        z-index: 1000;
    }

    .search-result-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.2s;
    }

    .search-result-item:hover {
        background-color: #f9fafb;
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-image {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
    }

    .search-result-info h4 {
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 2px;
        color: #111827;
    }

    .search-result-info span {
        font-size: 0.75rem;
        color: #2563eb;
        font-weight: 600;
    }

    .no-results {
        padding: 16px;
        text-align: center;
        color: #6b7280;
        font-size: 0.875rem;
    }
`;

// Add notification styles to head
const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eliteShop = new EliteShop();
});

// Handle page visibility change to update cart count
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.eliteShop) {
        window.eliteShop.updateCartCount();
    }
});