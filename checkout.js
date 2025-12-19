// Checkout Page JavaScript

class CheckoutPage {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {
            billing: {},
            shipping: {},
            payment: {}
        };
        this.init();
    }

    init() {
        if (window.eliteShop.cart.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.renderCheckout();
        this.setupEventListeners();
    }

    showEmptyCart() {
        const container = document.getElementById('checkoutLayout');
        container.innerHTML = `
            <div class="empty-checkout">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>You need items in your cart to proceed with checkout.</p>
                <a href="products.html" class="btn btn-primary btn-large">
                    <i class="fas fa-shopping-bag"></i>
                    Continue Shopping
                </a>
            </div>
        `;
    }

    renderCheckout() {
        const container = document.getElementById('checkoutLayout');
        const cart = window.eliteShop.cart;
        const { formatPrice } = window.EliteShopData.utils;

        const subtotal = window.eliteShop.getCartTotal();
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        container.innerHTML = `
            <div class="checkout-form-section">
                <div class="checkout-progress">
                    <div class="progress-steps">
                        <div class="progress-step ${this.currentStep >= 1 ? 'active' : ''} ${this.currentStep > 1 ? 'completed' : ''}" data-step="1">
                            <div class="step-number">1</div>
                            <div class="step-label">Shipping</div>
                        </div>
                        <div class="progress-step ${this.currentStep >= 2 ? 'active' : ''} ${this.currentStep > 2 ? 'completed' : ''}" data-step="2">
                            <div class="step-number">2</div>
                            <div class="step-label">Payment</div>
                        </div>
                        <div class="progress-step ${this.currentStep >= 3 ? 'active' : ''}" data-step="3">
                            <div class="step-number">3</div>
                            <div class="step-label">Review</div>
                        </div>
                    </div>
                </div>

                <div class="checkout-forms">
                    <form class="checkout-form" id="checkoutForm">
                        ${this.renderShippingForm()}
                        ${this.renderPaymentForm()}
                        ${this.renderReviewForm()}
                    </form>
                </div>

                <div class="checkout-navigation">
                    <button type="button" class="btn btn-outline" id="prevStepBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i>
                        Previous
                    </button>
                    <button type="button" class="btn btn-primary" id="nextStepBtn">
                        Continue to Payment
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <button type="submit" form="checkoutForm" class="btn btn-primary" id="placeOrderBtn" style="display: none;">
                        <i class="fas fa-check"></i>
                        Place Order
                    </button>
                </div>
            </div>

            <div class="checkout-summary">
                <div class="order-summary">
                    <h3>Order Summary</h3>

                    <div class="order-items">
                        ${cart.map(item => `
                            <div class="order-item">
                                <div class="order-item-image">
                                    <img src="${item.image}" alt="${item.name}">
                                    <span class="order-item-quantity">${item.quantity}</span>
                                </div>
                                <div class="order-item-details">
                                    <h4>${item.name}</h4>
                                    <span>${formatPrice(item.price)} × ${item.quantity}</span>
                                </div>
                                <div class="order-item-total">${formatPrice(item.price * item.quantity)}</div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="order-totals">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <span>${formatPrice(subtotal)}</span>
                        </div>
                        <div class="total-row">
                            <span>Shipping</span>
                            <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                        </div>
                        <div class="total-row">
                            <span>Tax</span>
                            <span>${formatPrice(tax)}</span>
                        </div>
                        <div class="total-row total">
                            <span>Total</span>
                            <span>${formatPrice(total)}</span>
                        </div>
                    </div>

                    <div class="checkout-benefits">
                        <div class="benefit">
                            <i class="fas fa-shield-alt"></i>
                            <span>Secure SSL Encryption</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-truck"></i>
                            <span>Fast & Free Shipping</span>
                        </div>
                        <div class="benefit">
                            <i class="fas fa-undo"></i>
                            <span>30-Day Returns</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.showCurrentStep();
    }

    renderShippingForm() {
        return `
            <div class="form-step" id="shippingStep">
                <h2>Shipping Information</h2>

                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                </div>

                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone">
                </div>

                <div class="form-group">
                    <label for="address">Street Address *</label>
                    <input type="text" id="address" name="address" required>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City *</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    <div class="form-group">
                        <label for="state">State/Province *</label>
                        <input type="text" id="state" name="state" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="zipCode">ZIP/Postal Code *</label>
                        <input type="text" id="zipCode" name="zipCode" required>
                    </div>
                    <div class="form-group">
                        <label for="country">Country *</label>
                        <select id="country" name="country" required>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="billingSame" checked>
                        <span>Billing address is the same as shipping</span>
                    </label>
                </div>
            </div>
        `;
    }

    renderPaymentForm() {
        return `
            <div class="form-step" id="paymentStep">
                <h2>Payment Information</h2>

                <div class="payment-methods">
                    <div class="payment-method active" data-method="card">
                        <i class="fas fa-credit-card"></i>
                        <span>Credit/Debit Card</span>
                    </div>
                    <div class="payment-method" data-method="paypal">
                        <i class="fab fa-paypal"></i>
                        <span>PayPal</span>
                    </div>
                </div>

                <div class="payment-form" id="cardForm">
                    <div class="form-group">
                        <label for="cardNumber">Card Number *</label>
                        <div class="card-input-container">
                            <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" required>
                            <i class="fas fa-credit-card card-icon"></i>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="expiryDate">Expiry Date *</label>
                            <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label for="cvv">CVV *</label>
                            <input type="text" id="cvv" name="cvv" placeholder="123" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="cardName">Name on Card *</label>
                        <input type="text" id="cardName" name="cardName" required>
                    </div>
                </div>

                <div class="payment-form" id="paypalForm" style="display: none;">
                    <div class="paypal-notice">
                        <i class="fab fa-paypal"></i>
                        <p>You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                </div>
            </div>
        `;
    }

    renderReviewForm() {
        const cart = window.eliteShop.cart;
        const { formatPrice } = window.EliteShopData.utils;

        const subtotal = window.eliteShop.getCartTotal();
        const shipping = subtotal >= 50 ? 0 : 9.99;
        const tax = subtotal * 0.08;
        const total = subtotal + shipping + tax;

        return `
            <div class="form-step" id="reviewStep">
                <h2>Review Your Order</h2>

                <div class="review-sections">
                    <div class="review-section">
                        <h3>Shipping Address</h3>
                        <div id="shippingReview">
                            <p>Please complete shipping information first</p>
                        </div>
                    </div>

                    <div class="review-section">
                        <h3>Payment Method</h3>
                        <div id="paymentReview">
                            <p>Please complete payment information first</p>
                        </div>
                    </div>

                    <div class="review-section">
                        <h3>Order Items</h3>
                        <div class="review-items">
                            ${cart.map(item => `
                                <div class="review-item">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div class="review-item-details">
                                        <h4>${item.name}</h4>
                                        <span>Quantity: ${item.quantity}</span>
                                        <span>${formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="review-section">
                        <h3>Order Total</h3>
                        <div class="review-totals">
                            <div class="review-total-row">
                                <span>Subtotal:</span>
                                <span>${formatPrice(subtotal)}</span>
                            </div>
                            <div class="review-total-row">
                                <span>Shipping:</span>
                                <span>${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                            </div>
                            <div class="review-total-row">
                                <span>Tax:</span>
                                <span>${formatPrice(tax)}</span>
                            </div>
                            <div class="review-total-row total">
                                <span>Total:</span>
                                <span>${formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="terms-agreement">
                    <label class="checkbox-label">
                        <input type="checkbox" id="termsAgree" required>
                        <span>I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></span>
                    </label>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevStepBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextStepBtn').addEventListener('click', () => this.nextStep());

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', () => this.selectPaymentMethod(method.dataset.method));
        });

        // Form validation and submission
        document.getElementById('checkoutForm').addEventListener('submit', (e) => this.handleOrderSubmission(e));

        // Billing same as shipping toggle
        document.getElementById('billingSame').addEventListener('change', (e) => {
            // In a real implementation, this would show/hide billing address fields
            console.log('Billing same as shipping:', e.target.checked);
        });
    }

    showCurrentStep() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.style.display = 'none';
        });

        // Show current step
        const currentStepElement = document.getElementById(`${this.getStepName(this.currentStep)}Step`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        // Update navigation buttons
        this.updateNavigationButtons();

        // Update progress indicators
        this.updateProgressIndicators();
    }

    getStepName(stepNumber) {
        const stepNames = {
            1: 'shipping',
            2: 'payment',
            3: 'review'
        };
        return stepNames[stepNumber];
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showCurrentStep();

                if (this.currentStep === 3) {
                    this.updateReviewData();
                }
            }
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showCurrentStep();
        }
    }

    validateCurrentStep() {
        const stepName = this.getStepName(this.currentStep);
        const stepElement = document.getElementById(`${stepName}Step`);

        // Basic validation for required fields
        const requiredFields = stepElement.querySelectorAll('input[required], select[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            window.eliteShop.showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    saveCurrentStepData() {
        const stepName = this.getStepName(this.currentStep);

        if (stepName === 'shipping') {
            this.formData.shipping = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zipCode: document.getElementById('zipCode').value,
                country: document.getElementById('country').value
            };
        } else if (stepName === 'payment') {
            this.formData.payment = {
                method: document.querySelector('.payment-method.active').dataset.method,
                cardNumber: document.getElementById('cardNumber').value,
                expiryDate: document.getElementById('expiryDate').value,
                cvv: document.getElementById('cvv').value,
                cardName: document.getElementById('cardName').value
            };
        }
    }

    selectPaymentMethod(method) {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        document.querySelector(`[data-method="${method}"]`).classList.add('active');

        document.getElementById('cardForm').style.display = method === 'card' ? 'block' : 'none';
        document.getElementById('paypalForm').style.display = method === 'paypal' ? 'block' : 'none';
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevStepBtn');
        const nextBtn = document.getElementById('nextStepBtn');
        const placeOrderBtn = document.getElementById('placeOrderBtn');

        prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
        nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-flex' : 'none';
        placeOrderBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';

        // Update next button text
        const nextTexts = {
            1: 'Continue to Payment',
            2: 'Review Order'
        };
        nextBtn.innerHTML = `${nextTexts[this.currentStep] || 'Continue'} <i class="fas fa-arrow-right"></i>`;
    }

    updateProgressIndicators() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.toggle('active', stepNumber === this.currentStep);
            step.classList.toggle('completed', stepNumber < this.currentStep);
        });
    }

    updateReviewData() {
        // Update shipping review
        const shipping = this.formData.shipping;
        document.getElementById('shippingReview').innerHTML = `
            <p>${shipping.firstName} ${shipping.lastName}</p>
            <p>${shipping.address}</p>
            <p>${shipping.city}, ${shipping.state} ${shipping.zipCode}</p>
            <p>${shipping.country}</p>
            <p>${shipping.email}</p>
        `;

        // Update payment review
        const payment = this.formData.payment;
        document.getElementById('paymentReview').innerHTML = `
            <p><i class="fas fa-credit-card"></i> ${payment.method === 'card' ? 'Credit Card' : 'PayPal'}</p>
            ${payment.method === 'card' ? `<p>Ending in ${payment.cardNumber.slice(-4)}</p>` : ''}
        `;
    }

    handleOrderSubmission(e) {
        e.preventDefault();

        if (!document.getElementById('termsAgree').checked) {
            window.eliteShop.showNotification('Please agree to the terms and conditions', 'error');
            return;
        }

        // Simulate order processing
        this.showOrderProcessing();

        setTimeout(() => {
            this.showOrderConfirmation();
        }, 2000);
    }

    showOrderProcessing() {
        const container = document.getElementById('checkoutLayout');
        container.innerHTML = `
            <div class="order-processing">
                <div class="processing-animation">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <h2>Processing Your Order</h2>
                <p>Please wait while we securely process your payment...</p>
            </div>
        `;
    }

    showOrderConfirmation() {
        // Clear cart
        window.eliteShop.cart = [];
        window.eliteShop.saveCart();

        const orderNumber = 'ELT-' + Date.now();
        const container = document.getElementById('checkoutLayout');

        container.innerHTML = `
            <div class="order-confirmation">
                <div class="confirmation-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been successfully placed.</p>

                <div class="order-details">
                    <div class="order-detail-row">
                        <span>Order Number:</span>
                        <strong>${orderNumber}</strong>
                    </div>
                    <div class="order-detail-row">
                        <span>Estimated Delivery:</span>
                        <strong>3-5 business days</strong>
                    </div>
                </div>

                <div class="confirmation-actions">
                    <a href="index.html" class="btn btn-primary">
                        <i class="fas fa-home"></i>
                        Continue Shopping
                    </a>
                    <button class="btn btn-outline" onclick="window.print()">
                        <i class="fas fa-print"></i>
                        Print Receipt
                    </button>
                </div>

                <div class="order-email-notice">
                    <i class="fas fa-envelope"></i>
                    <p>A confirmation email has been sent to your email address.</p>
                </div>
            </div>
        `;
    }
}

// Additional CSS for checkout page
const checkoutPageStyles = `
    .checkout-section {
        padding: 2rem 0;
        min-height: 60vh;
    }

    .checkout-title {
        font-size: 2rem;
        font-weight: 700;
        color: #111827;
        margin-bottom: 2rem;
        text-align: center;
    }

    .checkout-layout {
        display: grid;
        grid-template-columns: 1fr 350px;
        gap: 2rem;
        align-items: start;
    }

    .empty-checkout {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: #6b7280;
    }

    .empty-checkout i {
        font-size: 4rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }

    .empty-checkout h2 {
        font-size: 1.875rem;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .empty-checkout p {
        margin-bottom: 2rem;
    }

    .checkout-progress {
        margin-bottom: 2rem;
    }

    .progress-steps {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        opacity: 0.5;
        transition: opacity 0.3s;
    }

    .progress-step.active {
        opacity: 1;
    }

    .progress-step.completed .step-number {
        background-color: #10b981;
        color: white;
    }

    .step-number {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #e5e7eb;
        color: #6b7280;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        transition: all 0.3s;
    }

    .progress-step.active .step-number {
        background-color: #2563eb;
        color: white;
    }

    .step-label {
        font-size: 0.875rem;
        color: #6b7280;
        font-weight: 500;
    }

    .checkout-forms {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-step {
        display: none;
    }

    .form-step h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1.5rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #374151;
    }

    .form-group input,
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus {
        outline: none;
        border-color: #2563eb;
    }

    .form-group input.error {
        border-color: #ef4444;
    }

    .checkbox-label {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        cursor: pointer;
        font-weight: normal;
    }

    .checkbox-label input {
        margin-top: 0.125rem;
        width: auto;
    }

    .payment-methods {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .payment-method {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .payment-method:hover,
    .payment-method.active {
        border-color: #2563eb;
        background-color: #f0f9ff;
    }

    .card-input-container {
        position: relative;
    }

    .card-input-container input {
        padding-right: 3rem;
    }

    .card-icon {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
    }

    .paypal-notice {
        text-align: center;
        padding: 2rem;
        background-color: #f9fafb;
        border-radius: 8px;
    }

    .paypal-notice i {
        font-size: 3rem;
        color: #0070ba;
        margin-bottom: 1rem;
    }

    .checkout-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid #e5e7eb;
    }

    .checkout-summary {
        position: sticky;
        top: 100px;
    }

    .order-summary {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .order-summary h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1.5rem;
    }

    .order-items {
        margin-bottom: 2rem;
    }

    .order-item {
        display: flex;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid #f3f4f6;
    }

    .order-item:last-child {
        border-bottom: none;
    }

    .order-item-image {
        position: relative;
    }

    .order-item-image img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }

    .order-item-quantity {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .order-item-details h4 {
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.25rem;
    }

    .order-item-details span {
        font-size: 0.75rem;
        color: #6b7280;
    }

    .order-item-total {
        font-size: 0.875rem;
        font-weight: 600;
        color: #111827;
        margin-left: auto;
    }

    .order-totals {
        border-top: 1px solid #e5e7eb;
        padding-top: 1rem;
        margin-bottom: 1.5rem;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .total-row.total {
        font-size: 1rem;
        font-weight: 700;
        color: #111827;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #e5e7eb;
    }

    .checkout-benefits {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .benefit {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .benefit i {
        color: #10b981;
    }

    .review-sections {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .review-section h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 1rem;
    }

    .review-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .review-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
    }

    .review-item img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 6px;
    }

    .review-item-details h4 {
        font-size: 1rem;
        font-weight: 600;
        color: #111827;
        margin-bottom: 0.5rem;
    }

    .review-item-details span {
        display: block;
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 0.25rem;
    }

    .review-totals {
        background: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
    }

    .review-total-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
    }

    .review-total-row.total {
        font-weight: 700;
        color: #111827;
        font-size: 1rem;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #e5e7eb;
    }

    .terms-agreement {
        margin: 2rem 0;
    }

    .order-processing,
    .order-confirmation {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
    }

    .processing-animation i {
        font-size: 4rem;
        color: #2563eb;
        margin-bottom: 1rem;
    }

    .confirmation-icon i {
        font-size: 4rem;
        color: #10b981;
        margin-bottom: 1rem;
    }

    .order-confirmation h2 {
        font-size: 2rem;
        color: #111827;
        margin-bottom: 1rem;
    }

    .order-confirmation p {
        color: #6b7280;
        margin-bottom: 2rem;
    }

    .order-details {
        background: #f9fafb;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 2rem 0;
        text-align: left;
        max-width: 400px;
        margin-left: auto;
        margin-right: auto;
    }

    .order-detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.875rem;
    }

    .confirmation-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 2rem 0;
        flex-wrap: wrap;
    }

    .order-email-notice {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem;
        background: #f0f9ff;
        border-radius: 6px;
        color: #1e40af;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .checkout-layout {
            grid-template-columns: 1fr;
        }

        .checkout-summary {
            position: static;
        }

        .progress-steps {
            flex-direction: column;
            align-items: flex-start;
        }

        .progress-step {
            flex-direction: row;
            width: 100%;
            justify-content: flex-start;
        }

        .form-row {
            grid-template-columns: 1fr;
        }

        .payment-methods {
            flex-direction: column;
        }

        .checkout-navigation {
            flex-direction: column;
            gap: 1rem;
        }

        .confirmation-actions {
            flex-direction: column;
            align-items: center;
        }
    }
`;

// Add checkout page styles
const style = document.createElement('style');
style.textContent = checkoutPageStyles;
document.head.appendChild(style);

// Initialize checkout page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        window.checkoutPage = new CheckoutPage();
    }
});