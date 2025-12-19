// FAQ Management
class FAQManager {
    constructor() {
        this.faqs = this.getSampleFAQs();
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.renderFAQs();
        this.setupEventListeners();
    }

    getSampleFAQs() {
        return [
            {
                id: 1,
                question: "How do I place an order?",
                answer: "To place an order, browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your purchase.",
                category: "orders"
            },
            {
                id: 2,
                question: "What payment methods do you accept?",
                answer: "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay for secure and convenient payment processing.",
                category: "payment"
            },
            {
                id: 3,
                question: "How long does shipping take?",
                answer: "Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) and overnight shipping are also available for an additional fee.",
                category: "shipping"
            },
            {
                id: 4,
                question: "What is your return policy?",
                answer: "We offer a 30-day return policy for most items. Products must be in their original condition with tags attached. Some items like personalized products are not returnable.",
                category: "returns"
            },
            {
                id: 5,
                question: "How do I track my order?",
                answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status by logging into your account and viewing your order history.",
                category: "orders"
            },
            {
                id: 6,
                question: "Do you offer international shipping?",
                answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Additional customs fees may apply.",
                category: "shipping"
            },
            {
                id: 7,
                question: "Can I change or cancel my order?",
                answer: "Orders can be modified or cancelled within 2 hours of placement. Please contact our customer service team immediately if you need to make changes.",
                category: "orders"
            },
            {
                id: 8,
                question: "Are my payment details secure?",
                answer: "Yes, we use SSL encryption and PCI-compliant payment processing to ensure your payment information is secure. We never store your full credit card details.",
                category: "payment"
            },
            {
                id: 9,
                question: "How do I create an account?",
                answer: "Click the 'Account' link in the navigation and select 'Sign Up'. You'll need to provide your email address and create a password to register.",
                category: "account"
            },
            {
                id: 10,
                question: "What should I do if I receive a damaged item?",
                answer: "Please contact our customer service team immediately with photos of the damaged item. We'll arrange for a replacement or full refund at no cost to you.",
                category: "returns"
            },
            {
                id: 11,
                question: "Do you offer gift wrapping?",
                answer: "Yes, we offer complimentary gift wrapping for most items. You can select this option during checkout and add a personalized message.",
                category: "orders"
            },
            {
                id: 12,
                question: "How do I reset my password?",
                answer: "Go to the login page and click 'Forgot Password'. Enter your email address and we'll send you a link to reset your password.",
                category: "account"
            }
        ];
    }

    setupEventListeners() {
        // Category filtering
        document.querySelectorAll('.faq-category-btn').forEach(btn => {
            btn.addEventListener('click', () => this.setCategory(btn.dataset.category));
        });

        // Search functionality
        const searchInput = document.getElementById('faqSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchFAQs(e.target.value));
        }
    }

    setCategory(category) {
        this.currentCategory = category;

        // Update active category button
        document.querySelectorAll('.faq-category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.renderFAQs();
    }

    searchFAQs(query) {
        if (query.length > 2) {
            const filteredFAQs = this.faqs.filter(faq =>
                faq.question.toLowerCase().includes(query.toLowerCase()) ||
                faq.answer.toLowerCase().includes(query.toLowerCase())
            );
            this.renderFilteredFAQs(filteredFAQs);
        } else {
            this.renderFAQs();
        }
    }

    getFilteredFAQs() {
        if (this.currentCategory === 'all') {
            return this.faqs;
        }
        return this.faqs.filter(faq => faq.category === this.currentCategory);
    }

    renderFAQs() {
        const filteredFAQs = this.getFilteredFAQs();
        const faqList = document.getElementById('faqList');
        faqList.innerHTML = filteredFAQs.map(faq => this.createFAQItem(faq)).join('');
    }

    renderFilteredFAQs(faqs) {
        const faqList = document.getElementById('faqList');
        faqList.innerHTML = faqs.map(faq => this.createFAQItem(faq)).join('');
    }

    createFAQItem(faq) {
        return `
            <div class="faq-item" data-faq-id="${faq.id}">
                <div class="faq-question" onclick="faqManager.toggleFAQ(${faq.id})">
                    <h3>${faq.question}</h3>
                    <i class="fas fa-chevron-down faq-toggle"></i>
                </div>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `;
    }

    toggleFAQ(faqId) {
        const faqItem = document.querySelector(`[data-faq-id="${faqId}"]`);
        const answer = faqItem.querySelector('.faq-answer');
        const toggle = faqItem.querySelector('.faq-toggle');

        // Close all other FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = '0';
                item.querySelector('.faq-toggle').style.transform = 'rotate(0deg)';
            }
        });

        // Toggle current FAQ
        const isActive = faqItem.classList.contains('active');

        if (isActive) {
            faqItem.classList.remove('active');
            answer.style.maxHeight = '0';
            toggle.style.transform = 'rotate(0deg)';
        } else {
            faqItem.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            toggle.style.transform = 'rotate(180deg)';
        }
    }
}

// Initialize FAQ manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('faq.html')) {
        window.faqManager = new FAQManager();
    }
});