// Products Page JavaScript - Advanced filtering and sorting

class ProductsPage {
    constructor() {
        this.allProducts = window.EliteShopData.products;
        this.filteredProducts = [...this.allProducts];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.currentView = 'grid'; // 'grid' or 'list'
        this.filters = {
            category: 'all',
            minPrice: null,
            maxPrice: null,
            minRating: null,
            inStockOnly: true
        };
        this.sortBy = 'name';

        this.init();
    }

    init() {
        this.parseUrlParams();
        this.setupEventListeners();
        this.applyFilters();
        this.renderProducts();
        this.updateUI();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        if (category) {
            this.filters.category = category;
        }
    }

    setupEventListeners() {
        // Category filters
        document.querySelectorAll('.filter-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.dataset.category;
                this.setCategoryFilter(category);
                this.updateUrl(category);
            });
        });

        // Price filter
        document.getElementById('applyPriceFilter').addEventListener('click', () => {
            const minPrice = parseFloat(document.getElementById('minPrice').value) || null;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || null;
            this.setPriceFilter(minPrice, maxPrice);
        });

        // Rating filters
        document.querySelectorAll('.rating-filter input').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const checkedRatings = Array.from(document.querySelectorAll('.rating-filter input:checked'))
                    .map(cb => parseInt(cb.value));
                this.filters.minRating = checkedRatings.length > 0 ? Math.min(...checkedRatings) : null;
                this.applyFilters();
            });
        });

        // In stock filter
        document.getElementById('inStockOnly').addEventListener('change', (e) => {
            this.filters.inStockOnly = e.target.checked;
            this.applyFilters();
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // View options
        document.getElementById('gridView').addEventListener('click', () => this.setView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.setView('list'));
    }

    setCategoryFilter(category) {
        this.filters.category = category;
        this.currentPage = 1;
        this.applyFilters();
        this.updateActiveCategoryFilter();
    }

    setPriceFilter(minPrice, maxPrice) {
        this.filters.minPrice = minPrice;
        this.filters.maxPrice = maxPrice;
        this.currentPage = 1;
        this.applyFilters();
    }

    setView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        this.renderProducts();
    }

    updateUrl(category) {
        const url = new URL(window.location);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }

    applyFilters() {
        let filtered = [...this.allProducts];

        // Category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(product => product.category === this.filters.category);
        }

        // Price filter
        if (this.filters.minPrice !== null) {
            filtered = filtered.filter(product => product.price >= this.filters.minPrice);
        }
        if (this.filters.maxPrice !== null) {
            filtered = filtered.filter(product => product.price <= this.filters.maxPrice);
        }

        // Rating filter
        if (this.filters.minRating !== null) {
            filtered = filtered.filter(product => product.rating >= this.filters.minRating);
        }

        // In stock filter
        if (this.filters.inStockOnly) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Sort products
        this.sortProducts(filtered);

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateUI();
    }

    sortProducts(products) {
        products.sort((a, b) => {
            switch (this.sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return b.id - a.id; // Assuming higher ID = newer
                default:
                    return 0;
            }
        });
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            container.innerHTML = '';
            document.getElementById('noResults').style.display = 'block';
            document.getElementById('pagination').style.display = 'none';
            return;
        }

        document.getElementById('noResults').style.display = 'none';
        document.getElementById('pagination').style.display = 'block';

        container.className = `products-container ${this.currentView}-view`;
        container.innerHTML = productsToShow.map(product =>
            this.currentView === 'grid' ? this.createProductCard(product) : this.createProductListItem(product)
        ).join('');

        this.attachProductListeners(container);
        this.renderPagination();
    }

    createProductCard(product) {
        const { formatPrice, getStarRating } = window.EliteShopData.utils;
        const stars = getStarRating(product.rating);

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                    ${product.isNew ? `<span class="product-badge new">New</span>` : ''}
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
                        <button class="btn-wishlist ${window.eliteShop.isInWishlist(product.id) ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createProductListItem(product) {
        const { formatPrice, getStarRating } = window.EliteShopData.utils;
        const stars = getStarRating(product.rating);

        return `
            <div class="product-list-item" data-product-id="${product.id}">
                <div class="product-list-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.discount > 0 ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                    ${product.isNew ? `<span class="product-badge new">New</span>` : ''}
                </div>
                <div class="product-list-info">
                    <div class="product-list-header">
                        <div>
                            <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                            <h3 class="product-title">${product.name}</h3>
                        </div>
                        <div class="product-price">
                            <span class="product-price-current">${formatPrice(product.price)}</span>
                            ${product.originalPrice > product.price ? `<span class="product-price-old">${formatPrice(product.originalPrice)}</span>` : ''}
                            ${product.discount > 0 ? `<span class="product-price-discount">-${product.discount}%</span>` : ''}
                        </div>
                    </div>
                    <div class="product-rating">
                        <div class="product-stars">
                            ${'★'.repeat(stars.full)}${stars.half ? '☆' : ''}${'☆'.repeat(stars.empty)}
                        </div>
                        <span class="product-rating-count">(${product.reviewCount})</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-features">
                        ${product.features.slice(0, 3).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-to-cart" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-wishlist ${window.eliteShop.isInWishlist(product.id) ? 'active' : ''}" data-product-id="${product.id}">
                            <i class="fas fa-heart"></i>
                        </button>
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-small">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    attachProductListeners(container) {
        // Add to cart buttons
        container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                window.eliteShop.addToCart(productId);
            });
        });

        // Wishlist buttons
        container.querySelectorAll('.btn-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                window.eliteShop.toggleWishlist(productId);
            });
        });

        // Product clicks (go to product detail)
        container.querySelectorAll('.product-card, .product-list-item').forEach(item => {
            item.addEventListener('click', () => {
                const productId = item.dataset.productId;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    renderPagination() {
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        const pagination = document.getElementById('pagination');

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Previous button
        if (this.currentPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(totalPages, this.currentPage + 2);

        if (startPage > 1) {
            paginationHTML += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `<button class="page-btn ${i === this.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="page-dots">...</span>`;
            }
            paginationHTML += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }

        // Next button
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="page-btn" data-page="${this.currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
        }

        pagination.innerHTML = paginationHTML;

        // Add event listeners to pagination buttons
        pagination.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentPage = parseInt(btn.dataset.page);
                this.renderProducts();
                this.scrollToTop();
            });
        });
    }

    updateUI() {
        // Update products count
        const count = this.filteredProducts.length;
        document.getElementById('productsCount').textContent =
            `Showing ${count} product${count !== 1 ? 's' : ''}`;

        // Update title and breadcrumb
        const categoryNames = {
            all: 'All Products',
            electronics: 'Electronics',
            clothing: 'Clothing & Accessories',
            home: 'Home & Garden',
            books: 'Books'
        };

        const title = categoryNames[this.filters.category] || 'Products';
        document.getElementById('productsTitle').textContent = title;
        document.getElementById('breadcrumbCurrent').textContent = title;

        // Update active category filter
        this.updateActiveCategoryFilter();
    }

    updateActiveCategoryFilter() {
        document.querySelectorAll('.filter-link').forEach(link => {
            link.classList.toggle('active', link.dataset.category === this.filters.category);
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Public methods for external access
    refreshProducts() {
        this.applyFilters();
    }

    setCategory(category) {
        this.setCategoryFilter(category);
        this.updateUrl(category);
    }
}

// Additional CSS for products page
const productsPageStyles = `
    .breadcrumb {
        padding: 1rem 0;
        background-color: #f9fafb;
        border-bottom: 1px solid #e5e7eb;
    }

    .breadcrumb-list {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .breadcrumb-list a {
        color: #2563eb;
        text-decoration: none;
    }

    .breadcrumb-list a:hover {
        text-decoration: underline;
    }

    .products-section {
        padding: 2rem 0;
    }

    .products-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
    }

    .products-sidebar {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        height: fit-content;
        position: sticky;
        top: 100px;
    }

    .filter-section {
        margin-bottom: 2rem;
    }

    .filter-section:last-child {
        margin-bottom: 0;
    }

    .filter-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
    }

    .filter-list {
        list-style: none;
    }

    .filter-link {
        display: block;
        padding: 0.5rem 0;
        color: #4b5563;
        text-decoration: none;
        transition: color 0.2s;
    }

    .filter-link:hover,
    .filter-link.active {
        color: #2563eb;
        font-weight: 500;
    }

    .price-range {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .price-inputs {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .price-inputs input {
        flex: 1;
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.875rem;
    }

    .rating-filters,
    .availability-filter {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .rating-filter,
    .availability-filter {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #4b5563;
    }

    .rating-filter input,
    .availability-filter input {
        margin: 0;
    }

    .stars {
        color: #f59e0b;
        margin-right: 0.25rem;
    }

    .products-main {
        min-height: 600px;
    }

    .products-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .products-info h1 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .products-count {
        color: #6b7280;
        font-size: 0.875rem;
    }

    .products-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .sort-dropdown select {
        padding: 0.5rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        font-size: 0.875rem;
        color: #374151;
    }

    .view-options {
        display: flex;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        overflow: hidden;
    }

    .view-btn {
        padding: 0.5rem 0.75rem;
        background: white;
        border: none;
        color: #6b7280;
        transition: all 0.2s;
    }

    .view-btn:hover {
        background: #f9fafb;
        color: #374151;
    }

    .view-btn.active {
        background: #2563eb;
        color: white;
    }

    .products-container.grid-view {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
    }

    .products-container.list-view {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .product-list-item {
        display: flex;
        gap: 1.5rem;
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .product-list-item:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .product-list-image {
        flex-shrink: 0;
        position: relative;
    }

    .product-list-image img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: 6px;
    }

    .product-list-info {
        flex: 1;
    }

    .product-list-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.75rem;
    }

    .product-list-item .product-category {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 0.25rem;
    }

    .product-list-item .product-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .product-list-item .product-price {
        text-align: right;
    }

    .product-list-item .product-rating {
        margin-bottom: 0.75rem;
    }

    .product-description {
        color: #4b5563;
        margin-bottom: 0.75rem;
        line-height: 1.5;
    }

    .product-features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }

    .feature-tag {
        background: #f3f4f6;
        color: #374151;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .product-list-item .product-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-top: 3rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }

    .page-btn {
        padding: 0.5rem 0.75rem;
        border: 1px solid #d1d5db;
        background: white;
        color: #374151;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.875rem;
        min-width: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .page-btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }

    .page-btn.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
    }

    .page-dots {
        color: #6b7280;
        padding: 0 0.5rem;
    }

    .no-results {
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
    }

    .no-results i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .no-results h3 {
        font-size: 1.5rem;
        color: #374151;
        margin-bottom: 0.5rem;
    }

    .no-results p {
        margin-bottom: 2rem;
    }

    .product-badge.new {
        background-color: #10b981;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .products-layout {
            grid-template-columns: 250px 1fr;
            gap: 1.5rem;
        }
    }

    @media (max-width: 768px) {
        .products-layout {
            grid-template-columns: 1fr;
        }

        .products-sidebar {
            position: static;
            margin-bottom: 2rem;
        }

        .products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }

        .products-controls {
            width: 100%;
            justify-content: space-between;
        }

        .product-list-item {
            flex-direction: column;
            text-align: center;
        }

        .product-list-header {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
        }

        .product-list-item .product-price {
            text-align: center;
        }

        .product-list-item .product-actions {
            justify-content: center;
        }
    }

    @media (max-width: 480px) {
        .products-container.grid-view {
            grid-template-columns: 1fr;
        }

        .products-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
        }

        .sort-dropdown select,
        .view-options {
            width: 100%;
        }

        .view-options {
            justify-content: center;
        }
    }
`;

// Add products page styles
const style = document.createElement('style');
style.textContent = productsPageStyles;
document.head.appendChild(style);

// Initialize products page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('products.html')) {
        window.productsPage = new ProductsPage();
    }
});