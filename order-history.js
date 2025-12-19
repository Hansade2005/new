// Order History Management
class OrderHistory {
    constructor() {
        this.orders = this.loadOrders();
        this.init();
    }

    init() {
        this.displayOrders();
    }

    loadOrders() {
        const orders = localStorage.getItem('eliteshop_orders');
        return orders ? JSON.parse(orders) : [];
    }

    saveOrders() {
        localStorage.setItem('eliteshop_orders', JSON.stringify(this.orders));
    }

    addOrder(orderData) {
        const order = {
            id: this.generateOrderId(),
            date: new Date().toISOString(),
            status: 'Processing',
            ...orderData
        };
        this.orders.unshift(order);
        this.saveOrders();
        return order;
    }

    generateOrderId() {
        return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    updateOrderStatus(orderId, status) {
        const order = this.getOrderById(orderId);
        if (order) {
            order.status = status;
            this.saveOrders();
        }
    }

    displayOrders() {
        const container = document.getElementById('ordersContainer');
        const noOrders = document.getElementById('noOrders');

        if (!container) return;

        if (this.orders.length === 0) {
            container.style.display = 'none';
            noOrders.style.display = 'block';
            return;
        }

        container.style.display = 'block';
        noOrders.style.display = 'none';

        container.innerHTML = this.orders.map(order => this.createOrderCard(order)).join('');
    }

    createOrderCard(order) {
        const { formatPrice } = window.EliteShopData.utils;
        const orderDate = new Date(order.date).toLocaleDateString();
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return `
            <div class="order-card" data-order-id="${order.id}">
                <div class="order-header">
                    <div class="order-info">
                        <h3>Order #${order.id}</h3>
                        <p class="order-date">Placed on ${orderDate}</p>
                    </div>
                    <div class="order-status status-${order.status.toLowerCase()}">
                        ${order.status}
                    </div>
                </div>

                <div class="order-items">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-info">
                                <h4>${item.name}</h4>
                                <p>Qty: ${item.quantity}</p>
                            </div>
                        </div>
                    `).join('')}

                    ${order.items.length > 3 ? `<div class="order-item-more">+${order.items.length - 3} more items</div>` : ''}
                </div>

                <div class="order-footer">
                    <div class="order-summary">
                        <span>${totalItems} item${totalItems > 1 ? 's' : ''}</span>
                        <span class="order-total">${formatPrice(order.total)}</span>
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-outline btn-small" onclick="orderHistory.viewOrderDetails('${order.id}')">
                            View Details
                        </button>
                        <button class="btn btn-primary btn-small" onclick="orderHistory.reorder('${order.id}')">
                            Reorder
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    viewOrderDetails(orderId) {
        const order = this.getOrderById(orderId);
        if (!order) return;

        // Create modal for order details
        const modal = document.createElement('div');
        modal.className = 'order-modal';
        modal.innerHTML = `
            <div class="order-modal-content">
                <div class="order-modal-header">
                    <h2>Order Details</h2>
                    <button class="modal-close" onclick="this.closest('.order-modal').remove()">&times;</button>
                </div>
                <div class="order-modal-body">
                    <div class="order-info-section">
                        <h3>Order Information</h3>
                        <p><strong>Order ID:</strong> ${order.id}</p>
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                    </div>

                    <div class="order-shipping-section">
                        <h3>Shipping Information</h3>
                        <p><strong>Name:</strong> ${order.shipping.firstName} ${order.shipping.lastName}</p>
                        <p><strong>Address:</strong> ${order.shipping.address}</p>
                        <p><strong>City:</strong> ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}</p>
                        <p><strong>Email:</strong> ${order.shipping.email}</p>
                    </div>

                    <div class="order-items-section">
                        <h3>Items Ordered</h3>
                        ${order.items.map(item => `
                            <div class="detailed-order-item">
                                <img src="${item.image}" alt="${item.name}" class="detailed-item-image">
                                <div class="detailed-item-info">
                                    <h4>${item.name}</h4>
                                    <p>Quantity: ${item.quantity}</p>
                                    <p>Price: ${window.EliteShopData.utils.formatPrice(item.price)}</p>
                                    <p>Subtotal: ${window.EliteShopData.utils.formatPrice(item.price * item.quantity)}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-total-section">
                        <h3>Order Total: ${window.EliteShopData.utils.formatPrice(order.total)}</h3>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    reorder(orderId) {
        const order = this.getOrderById(orderId);
        if (!order) return;

        // Add items back to cart
        order.items.forEach(item => {
            window.eliteShop.addToCart(item.id, item.quantity);
        });

        // Redirect to cart
        window.location.href = 'cart.html';
    }
}

// Initialize order history when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.orderHistory = new OrderHistory();
});