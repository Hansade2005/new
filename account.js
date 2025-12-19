// Account Page JavaScript

class AccountPage {
    constructor() {
        this.currentSection = 'profile';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showSection('profile');
        this.loadWishlist();
        this.loadUserData();
    }

    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.account-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
            });
        });

        // Profile form
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProfile();
        });

        // Settings toggles
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.saveSetting(e.target.id, e.target.checked);
            });
        });

        // Settings select
        document.getElementById('profileVisibility').addEventListener('change', (e) => {
            this.saveSetting('profileVisibility', e.target.value);
        });
    }

    showSection(sectionName) {
        // Update active link
        document.querySelectorAll('.account-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === sectionName);
        });

        // Show section content
        document.querySelectorAll('.account-section-content').forEach(section => {
            section.classList.toggle('active', section.id === `${sectionName}-section`);
        });

        this.currentSection = sectionName;

        // Update URL hash
        window.location.hash = sectionName;
    }

    loadUserData() {
        // Load user data from localStorage (mock data for demo)
        const userData = this.getUserData();

        // Populate profile form
        Object.keys(userData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = userData[key];
            }
        });

        // Load settings
        const settings = this.getSettings();
        Object.keys(settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = settings[key];
                } else {
                    element.value = settings[key];
                }
            }
        });
    }

    getUserData() {
        const defaultData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            birthdate: ''
        };

        const saved = localStorage.getItem('eliteshop_user');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveProfile() {
        const formData = new FormData(document.getElementById('profileForm'));
        const userData = {};

        for (let [key, value] of formData.entries()) {
            userData[key] = value;
        }

        localStorage.setItem('eliteshop_user', JSON.stringify(userData));
        window.eliteShop.showNotification('Profile updated successfully!', 'success');
    }

    getSettings() {
        const defaultSettings = {
            emailNotifications: true,
            smsNotifications: false,
            profileVisibility: 'private'
        };

        const saved = localStorage.getItem('eliteshop_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSetting(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        localStorage.setItem('eliteshop_settings', JSON.stringify(settings));
        window.eliteShop.showNotification('Settings saved!', 'success');
    }

    loadWishlist() {
        const wishlist = window.eliteShop.wishlist;
        const container = document.getElementById('wishlistGrid');
        const emptyState = document.getElementById('emptyWishlist');

        if (wishlist.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        const wishlistProducts = wishlist.map(id => window.EliteShopData.utils.getProductById(id)).filter(Boolean);
        container.innerHTML = wishlistProducts.map(product => this.createWishlistItem(product)).join('');

        this.attachWishlistListeners(container);
    }

    createWishlistItem(product) {
        const { formatPrice } = window.EliteShopData.utils;

        return `
            <div class="wishlist-item" data-product-id="${product.id}">
                <div class="wishlist-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="remove-wishlist" data-product-id="${product.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="wishlist-info">
                    <h4>${product.name}</h4>
                    <div class="wishlist-price">${formatPrice(product.price)}</div>
                    <div class="wishlist-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                </div>
                <div class="wishlist-actions">
                    <button class="btn btn-primary btn-small add-to-cart-wishlist" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-small">
                        View Details
                    </a>
                </div>
            </div>
        `;
    }

    attachWishlistListeners(container) {
        // Remove from wishlist
        container.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const productId = parseInt(btn.dataset.productId);
                window.eliteShop.toggleWishlist(productId);
                this.loadWishlist(); // Refresh the wishlist
            });
        });

        // Add to cart from wishlist
        container.querySelectorAll('.add-to-cart-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(btn.dataset.productId);
                window.eliteShop.addToCart(productId);
            });
        });
    }
}

// Additional CSS for account page
const accountPageStyles = `
    .account-section {
        padding: 2rem 0;
        min-height: 60vh;
    }

    .account-layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
        align-items: start;
    }

    .account-sidebar {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .account-nav h3 {
        padding: 1.5rem;
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        border-bottom: 1px solid #e5e7eb;
    }

    .account-nav ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .account-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        color: #4b5563;
        text-decoration: none;
        transition: all 0.2s;
        border-bottom: 1px solid #f3f4f6;
    }

    .account-link:hover,
    .account-link.active {
        background-color: #f9fafb;
        color: #2563eb;
        border-right: 3px solid #2563eb;
    }

    .account-link:last-child {
        border-bottom: none;
    }

    .account-main {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .account-section-content {
        display: none;
        padding: 2rem;
    }

    .account-section-content.active {
        display: block;
    }

    .section-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .section-header h2 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .section-header p {
        color: #6b7280;
    }

    /* Profile Section */
    .profile-card {
        display: flex;
        gap: 2rem;
        align-items: flex-start;
    }

    .profile-avatar {
        position: relative;
        width: 120px;
        height: 120px;
    }

    .profile-avatar i {
        width: 100%;
        height: 100%;
        font-size: 120px;
        color: #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .change-avatar-btn {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: #2563eb;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .profile-form {
        flex: 1;
    }

    .form-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;
    }

    /* Wishlist Section */
    .wishlist-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .wishlist-item {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        gap: 1rem;
        transition: box-shadow 0.2s;
    }

    .wishlist-item:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .wishlist-image {
        position: relative;
        width: 80px;
        height: 80px;
        flex-shrink: 0;
    }

    .wishlist-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
    }

    .remove-wishlist {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ef4444;
        color: white;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 0.75rem;
    }

    .wishlist-info {
        flex: 1;
    }

    .wishlist-info h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .wishlist-price {
        font-size: 0.875rem;
        font-weight: 600;
        color: #2563eb;
        margin-bottom: 0.25rem;
    }

    .wishlist-stock {
        font-size: 0.75rem;
        font-weight: 500;
    }

    .wishlist-stock.in-stock {
        color: #10b981;
    }

    .wishlist-stock.out-of-stock {
        color: #ef4444;
    }

    .wishlist-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .empty-wishlist {
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
    }

    .empty-wishlist i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .empty-wishlist h3 {
        font-size: 1.5rem;
        color: #374151;
        margin-bottom: 0.5rem;
    }

    /* Addresses Section */
    .addresses-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .address-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1.5rem;
    }

    .address-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .address-header h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin: 0;
    }

    .address-actions {
        display: flex;
        gap: 0.5rem;
    }

    .address-content p {
        margin: 0.25rem 0;
        color: #4b5563;
    }

    .add-address-card {
        border: 2px dashed #d1d5db;
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s;
    }

    .add-address-card:hover {
        border-color: #2563eb;
        background-color: #f0f9ff;
    }

    .add-address-card i {
        font-size: 2rem;
        color: #6b7280;
        margin-bottom: 0.5rem;
    }

    .add-address-card h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .add-address-card p {
        color: #6b7280;
        margin: 0;
    }

    /* Settings Section */
    .settings-sections {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .settings-card {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1.5rem;
    }

    .settings-card h4 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
    }

    .settings-card.danger {
        border-color: #fecaca;
        background-color: #fef2f2;
    }

    .settings-card.danger h4 {
        color: #dc2626;
    }

    .setting-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 0;
        border-bottom: 1px solid #f3f4f6;
    }

    .setting-item:last-child {
        border-bottom: none;
    }

    .setting-info {
        flex: 1;
    }

    .setting-info label {
        display: block;
        font-weight: 500;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .setting-info span {
        font-size: 0.875rem;
        color: #6b7280;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 24px;
    }

    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .toggle-slider {
        background-color: #2563eb;
    }

    input:checked + .toggle-slider:before {
        transform: translateX(26px);
    }

    /* Responsive */
    @media (max-width: 768px) {
        .account-layout {
            grid-template-columns: 1fr;
        }

        .account-sidebar {
            margin-bottom: 2rem;
        }

        .profile-card {
            flex-direction: column;
            text-align: center;
        }

        .wishlist-grid {
            grid-template-columns: 1fr;
        }

        .addresses-list {
            grid-template-columns: 1fr;
        }

        .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
    }
`;

// Add account page styles
const style = document.createElement('style');
style.textContent = accountPageStyles;
document.head.appendChild(style);

// Initialize account page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('account.html')) {
        window.accountPage = new AccountPage();

        // Handle URL hash for direct section links
        const hash = window.location.hash.substring(1);
        if (hash && ['profile', 'orders', 'wishlist', 'addresses', 'settings'].includes(hash)) {
            window.accountPage.showSection(hash);
        }
    }
});