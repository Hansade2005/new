// Admin Panel Management
class AdminPanel {
    constructor() {
        this.currentTab = 'products';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDashboardStats();
        this.loadProducts();
        this.loadOrders();
        this.loadAnalytics();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Add product button
        const addProductBtn = document.getElementById('addProductBtn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => this.showAddProductModal());
        }

        // Save settings
        const saveSettingsBtn = document.getElementById('saveSettings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update active tab button
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Show active tab content
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}Tab`);
        });
    }

    loadDashboardStats() {
        const products = window.EliteShopData.products || [];
        const orders = JSON.parse(localStorage.getItem('eliteshop_orders') || '[]');

        // Calculate stats
        const totalProducts = products.length;
        const totalOrders = orders.length;
        const totalCustomers = new Set(orders.map(order => order.shipping?.email)).size;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Update stats display
        document.getElementById('totalProducts').textContent = totalProducts;
        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    }

    loadProducts() {
        const products = window.EliteShopData.products || [];
        const tbody = document.getElementById('productsTableBody');

        tbody.innerHTML = products.slice(0, 10).map(product => `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
                <td>${product.name}</td>
                <td>${this.capitalizeFirst(product.category)}</td>
                <td>$${product.price}</td>
                <td>${Math.floor(Math.random() * 100) + 10}</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td>
                    <button class="btn-action btn-edit" onclick="adminPanel.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="adminPanel.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadOrders() {
        const orders = JSON.parse(localStorage.getItem('eliteshop_orders') || '[]');
        const tbody = document.getElementById('ordersTableBody');

        tbody.innerHTML = orders.slice(0, 10).map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.shipping?.firstName} ${order.shipping?.lastName}</td>
                <td>${new Date(order.date).toLocaleDateString()}</td>
                <td><span class="status-badge status-${order.status?.toLowerCase() || 'processing'}">${order.status || 'Processing'}</span></td>
                <td>$${order.total?.toFixed(2)}</td>
                <td>
                    <button class="btn-action btn-view" onclick="adminPanel.viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    loadAnalytics() {
        // Mock top products data
        const topProducts = [
            { name: "Wireless Headphones", sales: 145 },
            { name: "Smart Watch", sales: 132 },
            { name: "Laptop Stand", sales: 98 },
            { name: "Coffee Maker", sales: 87 },
            { name: "Desk Lamp", sales: 76 }
        ];

        const topProductsList = document.getElementById('topProductsList');
        topProductsList.innerHTML = topProducts.map((product, index) => `
            <div class="top-product-item">
                <span class="product-rank">${index + 1}</span>
                <span class="product-name">${product.name}</span>
                <span class="product-sales">${product.sales} sales</span>
            </div>
        `).join('');
    }

    showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h2>Add New Product</h2>
                    <button class="modal-close" onclick="this.closest('.admin-modal').remove()">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form class="product-form" id="productForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productName">Product Name *</label>
                                <input type="text" id="productName" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="productCategory">Category *</label>
                                <select id="productCategory" name="category" required>
                                    <option value="">Select Category</option>
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home">Home & Garden</option>
                                    <option value="books">Books</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="productPrice">Price *</label>
                                <input type="number" id="productPrice" name="price" step="0.01" required>
                            </div>
                            <div class="form-group">
                                <label for="productImage">Image URL *</label>
                                <input type="url" id="productImage" name="image" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="productDescription">Description</label>
                            <textarea id="productDescription" name="description" rows="3"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" onclick="this.closest('.admin-modal').remove()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Product</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Handle form submission
        const form = document.getElementById('productForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct(new FormData(form));
            modal.remove();
        });
    }

    addProduct(formData) {
        const newProduct = {
            id: Date.now(),
            name: formData.get('name'),
            category: formData.get('category'),
            price: parseFloat(formData.get('price')),
            image: formData.get('image'),
            description: formData.get('description'),
            rating: 4.5,
            reviewCount: 0
        };

        // In a real app, this would save to a database
        console.log('New product added:', newProduct);
        window.eliteShop.showNotification('Product added successfully!', 'success');
        this.loadProducts();
        this.loadDashboardStats();
    }

    editProduct(productId) {
        // Mock edit functionality
        window.eliteShop.showNotification('Edit functionality would open here', 'info');
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            // In a real app, this would delete from database
            console.log('Product deleted:', productId);
            window.eliteShop.showNotification('Product deleted successfully!', 'success');
            this.loadProducts();
            this.loadDashboardStats();
        }
    }

    viewOrder(orderId) {
        // Mock view order functionality
        window.eliteShop.showNotification('Order details would open here', 'info');
    }

    saveSettings() {
        // Mock save settings functionality
        const settings = {
            storeName: document.getElementById('storeName').value,
            storeEmail: document.getElementById('storeEmail').value,
            storePhone: document.getElementById('storePhone').value,
            freeShippingThreshold: document.getElementById('freeShippingThreshold').value,
            standardShipping: document.getElementById('standardShipping').value
        };

        localStorage.setItem('eliteshop_settings', JSON.stringify(settings));
        window.eliteShop.showNotification('Settings saved successfully!', 'success');
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        window.adminPanel = new AdminPanel();
    }
});