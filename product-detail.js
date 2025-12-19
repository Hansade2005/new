// Product Detail Page JavaScript

class ProductDetailPage {
    constructor() {
        this.productId = this.getProductIdFromUrl();
        this.product = null;
        this.selectedImageIndex = 0;
        this.quantity = 1;

        this.init();
    }

    init() {
        if (!this.productId) {
            this.showError('Product not found');
            return;
        }

        this.product = window.EliteShopData.utils.getProductById(this.productId);
        if (!this.product) {
            this.showError('Product not found');
            return;
        }

        this.renderProductDetail();
        this.loadRelatedProducts();
        this.setupEventListeners();
        this.updateBreadcrumb();
    }

    getProductIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    renderProductDetail() {
        const container = document.getElementById('productDetail');
        const { formatPrice, getStarRating } = window.EliteShopData.utils;
        const stars = getStarRating(this.product.rating);

        // Create additional product images (using the same image for demo)
        const productImages = [this.product.image, this.product.image, this.product.image, this.product.image];

        container.innerHTML = `
            <div class="product-gallery">
                <div class="main-image-container">
                    <img id="mainImage" src="${productImages[0]}" alt="${this.product.name}" class="main-image">
                    ${this.product.discount > 0 ? `<span class="product-badge">-${this.product.discount}%</span>` : ''}
                    ${this.product.isNew ? `<span class="product-badge new">New</span>` : ''}
                </div>
                <div class="thumbnail-gallery">
                    ${productImages.map((img, index) => `
                        <img src="${img}" alt="${this.product.name} ${index + 1}"
                             class="thumbnail ${index === 0 ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
            </div>

            <div class="product-info">
                <div class="product-header">
                    <div class="product-category">${this.product.category.charAt(0).toUpperCase() + this.product.category.slice(1)}</div>
                    <h1 class="product-title">${this.product.name}</h1>
                    <div class="product-rating">
                        <div class="product-stars">
                            ${'★'.repeat(stars.full)}${stars.half ? '☆' : ''}${'☆'.repeat(stars.empty)}
                        </div>
                        <span class="product-rating-count">${this.product.rating} (${this.product.reviewCount} reviews)</span>
                    </div>
                </div>

                <div class="product-price">
                    <span class="current-price">${formatPrice(this.product.price)}</span>
                    ${this.product.originalPrice > this.product.price ?
                        `<span class="original-price">${formatPrice(this.product.originalPrice)}</span>` : ''}
                    ${this.product.discount > 0 ?
                        `<span class="discount-badge">-${this.product.discount}%</span>` : ''}
                </div>

                <div class="product-description">
                    <h3>Description</h3>
                    <p>${this.product.description}</p>
                </div>

                <div class="product-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${this.product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>

                <div class="product-stock">
                    <span class="stock-status ${this.product.inStock ? 'in-stock' : 'out-of-stock'}">
                        <i class="fas ${this.product.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        ${this.product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                </div>

                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn" id="decreaseQty">-</button>
                        <input type="number" id="quantity" value="1" min="1" max="99">
                        <button class="quantity-btn" id="increaseQty">+</button>
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-primary btn-large" id="addToCartBtn">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-outline btn-large" id="buyNowBtn">
                            <i class="fas fa-bolt"></i>
                            Buy Now
                        </button>
                        <button class="btn-wishlist-large ${window.eliteShop.isInWishlist(this.product.id) ? 'active' : ''}" id="wishlistBtn">
                            <i class="fas fa-heart"></i>
                            <span>Add to Wishlist</span>
                        </button>
                    </div>
                </div>

                <div class="product-meta">
                    <div class="meta-item">
                        <i class="fas fa-truck"></i>
                        <div>
                            <strong>Free Shipping</strong>
                            <span>On orders over $50</span>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-undo"></i>
                        <div>
                            <strong>Easy Returns</strong>
                            <span>30-day return policy</span>
                        </div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-shield-alt"></i>
                        <div>
                            <strong>Secure Payment</strong>
                            <span>SSL encrypted checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadRelatedProducts() {
        const relatedProducts = window.EliteShopData.products
            .filter(product => product.category === this.product.category && product.id !== this.product.id)
            .slice(0, 4);

        const container = document.getElementById('relatedProducts');
        container.innerHTML = relatedProducts.map(product => this.createRelatedProductCard(product)).join('');
        this.attachRelatedProductListeners(container);
    }

    createRelatedProductCard(product) {
        const { formatPrice } = window.EliteShopData.utils;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">
                        <span class="product-price-current">${formatPrice(product.price)}</span>
                        ${product.originalPrice > product.price ? `<span class="product-price-old">${formatPrice(product.originalPrice)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    attachRelatedProductListeners(container) {
        container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                window.eliteShop.addToCart(productId);
            });
        });

        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    setupEventListeners() {
        // Image gallery
        document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.changeImage(index));
        });

        // Quantity selector
        document.getElementById('decreaseQty').addEventListener('click', () => this.updateQuantity(-1));
        document.getElementById('increaseQty').addEventListener('click', () => this.updateQuantity(1));
        document.getElementById('quantity').addEventListener('change', (e) => {
            const newQty = parseInt(e.target.value);
            if (newQty >= 1 && newQty <= 99) {
                this.quantity = newQty;
            } else {
                e.target.value = this.quantity;
            }
        });

        // Add to cart
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            window.eliteShop.addToCart(this.product.id, this.quantity);
        });

        // Buy now
        document.getElementById('buyNowBtn').addEventListener('click', () => {
            window.eliteShop.addToCart(this.product.id, this.quantity);
            window.location.href = 'checkout.html';
        });

        // Wishlist
        document.getElementById('wishlistBtn').addEventListener('click', () => {
            window.eliteShop.toggleWishlist(this.product.id);
            this.updateWishlistButton();
        });
    }

    changeImage(index) {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('mainImage');

        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');

        mainImage.src = thumbnails[index].src;
        this.selectedImageIndex = index;
    }

    updateQuantity(change) {
        this.quantity = Math.max(1, Math.min(99, this.quantity + change));
        document.getElementById('quantity').value = this.quantity;
    }

    updateWishlistButton() {
        const btn = document.getElementById('wishlistBtn');
        const isInWishlist = window.eliteShop.isInWishlist(this.product.id);
        btn.classList.toggle('active', isInWishlist);
        btn.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</span>
        `;
    }

    updateBreadcrumb() {
        document.getElementById('productBreadcrumb').textContent = this.product.name;
        document.title = `${this.product.name} - EliteShop`;
    }

    showError(message) {
        const container = document.getElementById('productDetail');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>${message}</h2>
                <p>Sorry, we couldn't find the product you're looking for.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
    }
}

// Additional CSS for product detail page
const productDetailStyles = `
    .product-detail {
        padding: 2rem 0;
    }

    .product-detail-layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
        align-items: start;
    }

    .product-gallery {
        position: sticky;
        top: 100px;
    }

    .main-image-container {
        position: relative;
        margin-bottom: 1rem;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .main-image {
        width: 100%;
        height: 500px;
        object-fit: cover;
        display: block;
    }

    .thumbnail-gallery {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
    }

    .thumbnail {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.3s ease;
        border: 2px solid transparent;
    }

    .thumbnail:hover,
    .thumbnail.active {
        opacity: 1;
        border-color: #2563eb;
    }

    .product-info {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .product-header {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .product-title {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        line-height: 1.2;
    }

    .product-price {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .current-price {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
    }

    .original-price {
        font-size: 1.25rem;
        color: #6b7280;
        text-decoration: line-through;
    }

    .discount-badge {
        background-color: #ef4444;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
    }

    .product-description h3,
    .product-features h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.75rem;
    }

    .product-description p {
        color: #4b5563;
        line-height: 1.6;
    }

    .product-features ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .product-features li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #374151;
    }

    .product-features i {
        color: #10b981;
        font-size: 0.875rem;
    }

    .product-stock {
        margin: 1rem 0;
    }

    .stock-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.875rem;
    }

    .stock-status.in-stock {
        background-color: #dcfce7;
        color: #166534;
    }

    .stock-status.out-of-stock {
        background-color: #fef2f2;
        color: #991b1b;
    }

    .product-actions {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .quantity-selector {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 150px;
    }

    .quantity-btn {
        width: 40px;
        height: 40px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-weight: 600;
        color: #374151;
        transition: all 0.2s;
    }

    .quantity-btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }

    #quantity {
        width: 60px;
        height: 40px;
        text-align: center;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
    }

    .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .btn-wishlist-large {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: 2px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.875rem;
    }

    .btn-wishlist-large:hover {
        border-color: #2563eb;
        color: #2563eb;
    }

    .btn-wishlist-large.active {
        border-color: #ef4444;
        color: #ef4444;
    }

    .product-meta {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1rem;
        padding-top: 1.5rem;
        border-top: 1px solid #e5e7eb;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .meta-item i {
        color: #2563eb;
        font-size: 1.25rem;
        width: 24px;
    }

    .meta-item strong {
        display: block;
        color: #111827;
        font-weight: 600;
    }

    .meta-item span {
        color: #6b7280;
        font-size: 0.875rem;
    }

    .related-products {
        padding: 4rem 0;
        background-color: #f9fafb;
    }

    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
    }

    .error-message i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: #ef4444;
    }

    .error-message h2 {
        font-size: 1.875rem;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .error-message p {
        margin-bottom: 2rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .product-detail-layout {
            gap: 2rem;
        }

        .main-image {
            height: 400px;
        }
    }

    @media (max-width: 768px) {
        .product-detail-layout {
            grid-template-columns: 1fr;
        }

        .product-gallery {
            position: static;
        }

        .main-image {
            height: 350px;
        }

        .thumbnail-gallery {
            grid-template-columns: repeat(4, 1fr);
            gap: 0.5rem;
        }

        .thumbnail {
            height: 80px;
        }

        .product-title {
            font-size: 1.75rem;
        }

        .current-price {
            font-size: 1.75rem;
        }

        .action-buttons {
            flex-direction: column;
        }

        .btn-wishlist-large {
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .thumbnail-gallery {
            grid-template-columns: repeat(4, 1fr);
        }

        .thumbnail {
            height: 60px;
        }

        .product-title {
            font-size: 1.5rem;
        }

        .current-price {
            font-size: 1.5rem;
        }

        .quantity-selector {
            max-width: none;
        }

        .meta-item {
            text-align: center;
        }
    }
`;

// Add product detail styles
const style = document.createElement('style');
style.textContent = productDetailStyles;
document.head.appendChild(style);

// Initialize product detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('product-detail.html')) {
        window.productDetailPage = new ProductDetailPage();
    }
});