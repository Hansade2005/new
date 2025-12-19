// EliteShop - Mock Data and Configuration

const PRODUCTS_DATA = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 199.99,
        originalPrice: 249.99,
        discount: 20,
        rating: 4.5,
        reviewCount: 128,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        features: ["Active Noise Cancellation", "30-hour Battery", "Bluetooth 5.0", "Comfortable Fit"],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "electronics",
        price: 299.99,
        originalPrice: 349.99,
        discount: 14,
        rating: 4.7,
        reviewCount: 256,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        description: "Advanced fitness tracking with heart rate monitoring and GPS.",
        features: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-day Battery"],
        inStock: true,
        isNew: true,
        isFeatured: true
    },
    {
        id: 3,
        name: "Premium Coffee Maker",
        category: "home",
        price: 149.99,
        originalPrice: 179.99,
        discount: 17,
        rating: 4.3,
        reviewCount: 89,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
        description: "Professional-grade coffee maker with programmable brewing and thermal carafe.",
        features: ["Programmable Timer", "Thermal Carafe", "12-Cup Capacity", "Auto Shut-off"],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 4,
        name: "Designer Leather Wallet",
        category: "clothing",
        price: 79.99,
        originalPrice: 99.99,
        discount: 20,
        rating: 4.6,
        reviewCount: 67,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
        description: "Handcrafted genuine leather wallet with RFID protection.",
        features: ["Genuine Leather", "RFID Protection", "8 Card Slots", "Coin Pocket"],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 5,
        name: "The Art of Programming",
        category: "books",
        price: 34.99,
        originalPrice: 44.99,
        discount: 22,
        rating: 4.8,
        reviewCount: 203,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop",
        description: "Comprehensive guide to modern programming practices and principles.",
        features: ["800+ Pages", "Code Examples", "Best Practices", "Updated Edition"],
        inStock: true,
        isNew: false,
        isFeatured: true
    },
    {
        id: 6,
        name: "Ergonomic Office Chair",
        category: "home",
        price: 399.99,
        originalPrice: 499.99,
        discount: 20,
        rating: 4.4,
        reviewCount: 145,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
        description: "Adjustable ergonomic chair with lumbar support and breathable mesh.",
        features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh", "5-Year Warranty"],
        inStock: true,
        isNew: true,
        isFeatured: false
    },
    {
        id: 7,
        name: "Wireless Charging Pad",
        category: "electronics",
        price: 29.99,
        originalPrice: 39.99,
        discount: 25,
        rating: 4.2,
        reviewCount: 78,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
        features: ["Qi Compatible", "Fast Charging", "LED Indicator", "Non-slip Surface"],
        inStock: true,
        isNew: false,
        isFeatured: false
    },
    {
        id: 8,
        name: "Minimalist Watch",
        category: "clothing",
        price: 159.99,
        originalPrice: 199.99,
        discount: 20,
        rating: 4.5,
        reviewCount: 92,
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop",
        description: "Classic minimalist watch with Japanese movement and sapphire crystal.",
        features: ["Japanese Movement", "Sapphire Crystal", "Stainless Steel", "Water Resistant"],
        inStock: true,
        isNew: false,
        isFeatured: false
    }
];

const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', count: 3 },
    { id: 'clothing', name: 'Clothing & Accessories', count: 2 },
    { id: 'home', name: 'Home & Garden', count: 2 },
    { id: 'books', name: 'Books', count: 1 }
];

const BRANDS = [
    'Apple', 'Samsung', 'Sony', 'Nike', 'Adidas', 'Levi\'s', 'Penguin Books', 'IKEA'
];

const CONFIG = {
    siteName: 'EliteShop',
    currency: 'USD',
    currencySymbol: '$',
    shippingThreshold: 50,
    freeShippingMessage: 'Free shipping on orders over $50',
    contactEmail: 'support@eliteshop.com',
    socialLinks: {
        facebook: 'https://facebook.com/eliteshop',
        twitter: 'https://twitter.com/eliteshop',
        instagram: 'https://instagram.com/eliteshop',
        linkedin: 'https://linkedin.com/company/eliteshop'
    }
};

// Utility functions
const formatPrice = (price) => {
    return `${CONFIG.currencySymbol}${price.toFixed(2)}`;
};

const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return {
        full: fullStars,
        half: hasHalfStar,
        empty: emptyStars
    };
};

const getProductsByCategory = (category) => {
    return PRODUCTS_DATA.filter(product => product.category === category);
};

const getFeaturedProducts = () => {
    return PRODUCTS_DATA.filter(product => product.isFeatured);
};

const getNewProducts = () => {
    return PRODUCTS_DATA.filter(product => product.isNew);
};

const searchProducts = (query) => {
    const lowerQuery = query.toLowerCase();
    return PRODUCTS_DATA.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
};

const getProductById = (id) => {
    return PRODUCTS_DATA.find(product => product.id === parseInt(id));
};

// Export for use in other files
window.EliteShopData = {
    products: PRODUCTS_DATA,
    categories: CATEGORIES,
    brands: BRANDS,
    config: CONFIG,
    utils: {
        formatPrice,
        calculateDiscount,
        getStarRating,
        getProductsByCategory,
        getFeaturedProducts,
        getNewProducts,
        searchProducts,
        getProductById
    }
};