// Blog Management
class BlogManager {
    constructor() {
        this.posts = this.getSamplePosts();
        this.currentCategory = 'all';
        this.postsPerPage = 6;
        this.currentPage = 1;
        this.init();
    }

    init() {
        this.renderPosts();
        this.renderRecentPosts();
        this.setupEventListeners();
    }

    getSamplePosts() {
        return [
            {
                id: 1,
                title: "Top 10 Gadgets for 2024: Must-Have Tech Accessories",
                excerpt: "Discover the latest technology trends and essential gadgets that will enhance your digital lifestyle this year.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop",
                category: "reviews",
                author: "Sarah Johnson",
                date: "2024-01-15",
                readTime: "5 min read",
                tags: ["gadgets", "technology", "2024"]
            },
            {
                id: 2,
                title: "Sustainable Shopping: How to Make Eco-Friendly Purchases",
                excerpt: "Learn how to shop responsibly and make choices that benefit both you and the environment.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
                category: "tips",
                author: "Michael Chen",
                date: "2024-01-12",
                readTime: "4 min read",
                tags: ["sustainability", "eco-friendly", "shopping"]
            },
            {
                id: 3,
                title: "Winter Fashion Trends: Stay Warm and Stylish",
                excerpt: "Explore the hottest winter fashion trends and find the perfect pieces for the cold season.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
                category: "trends",
                author: "Emily Davis",
                date: "2024-01-10",
                readTime: "6 min read",
                tags: ["fashion", "winter", "trends"]
            },
            {
                id: 4,
                title: "Home Office Setup Guide: Boost Your Productivity",
                excerpt: "Create the perfect home office environment with our comprehensive setup guide and product recommendations.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
                category: "tips",
                author: "Sarah Johnson",
                date: "2024-01-08",
                readTime: "7 min read",
                tags: ["home office", "productivity", "setup"]
            },
            {
                id: 5,
                title: "EliteShop's New Sustainability Initiative",
                excerpt: "We're excited to announce our new commitment to sustainable practices and eco-friendly packaging.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
                category: "news",
                author: "EliteShop Team",
                date: "2024-01-05",
                readTime: "3 min read",
                tags: ["sustainability", "company news", "eco-friendly"]
            },
            {
                id: 6,
                title: "Customer Spotlight: Meet Our Top Reviewer",
                excerpt: "Get to know Jane, one of our most active product reviewers and her favorite EliteShop finds.",
                content: "Full article content here...",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=600&h=400&fit=crop",
                category: "news",
                author: "Emily Davis",
                date: "2024-01-03",
                readTime: "4 min read",
                tags: ["customers", "reviews", "community"]
            }
        ];
    }

    setupEventListeners() {
        // Category filtering
        document.querySelectorAll('.blog-category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setCategory(e.target.dataset.category);
            });
        });

        // Search functionality
        const searchInput = document.getElementById('blogSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.searchPosts(e.target.value));
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMorePosts());
        }

        // Sidebar newsletter
        const sidebarNewsletter = document.getElementById('sidebarNewsletter');
        if (sidebarNewsletter) {
            sidebarNewsletter.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
    }

    setCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;

        // Update active category link
        document.querySelectorAll('.blog-category-link').forEach(link => {
            link.classList.toggle('active', link.dataset.category === category);
        });

        this.renderPosts();
    }

    searchPosts(query) {
        if (query.length > 2) {
            const filteredPosts = this.posts.filter(post =>
                post.title.toLowerCase().includes(query.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            this.renderFilteredPosts(filteredPosts);
        } else {
            this.renderPosts();
        }
    }

    getFilteredPosts() {
        if (this.currentCategory === 'all') {
            return this.posts;
        }
        return this.posts.filter(post => post.category === this.currentCategory);
    }

    renderPosts() {
        const filteredPosts = this.getFilteredPosts();
        const startIndex = 0;
        const endIndex = this.currentPage * this.postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        const postsContainer = document.getElementById('blogPosts');
        postsContainer.innerHTML = postsToShow.map(post => this.createPostCard(post)).join('');

        // Update load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = endIndex < filteredPosts.length ? 'inline-flex' : 'none';
        }
    }

    renderFilteredPosts(posts) {
        const postsContainer = document.getElementById('blogPosts');
        postsContainer.innerHTML = posts.map(post => this.createPostCard(post)).join('');

        // Hide load more button when searching
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    createPostCard(post) {
        const postDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="blog-post-card">
                <div class="post-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="post-category">${this.capitalizeFirst(post.category)}</div>
                </div>
                <div class="post-content">
                    <h2 class="post-title">
                        <a href="#" onclick="blogManager.openPost(${post.id}); return false;">${post.title}</a>
                    </h2>
                    <div class="post-meta">
                        <span class="post-author">
                            <i class="fas fa-user"></i>
                            ${post.author}
                        </span>
                        <span class="post-date">
                            <i class="fas fa-calendar"></i>
                            ${postDate}
                        </span>
                        <span class="post-read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                    <a href="#" class="post-read-more" onclick="blogManager.openPost(${post.id}); return false;">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    renderRecentPosts() {
        const recentPostsContainer = document.getElementById('recentPosts');
        const recentPosts = this.posts.slice(0, 3);

        recentPostsContainer.innerHTML = recentPosts.map(post => `
            <div class="recent-post-item">
                <img src="${post.image}" alt="${post.title}" class="recent-post-image">
                <div class="recent-post-info">
                    <h4>
                        <a href="#" onclick="blogManager.openPost(${post.id}); return false;">${post.title}</a>
                    </h4>
                    <span class="recent-post-date">${new Date(post.date).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    loadMorePosts() {
        this.currentPage++;
        this.renderPosts();
    }

    openPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Create modal for full post
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <div class="blog-modal-header">
                    <h1>${post.title}</h1>
                    <button class="modal-close" onclick="this.closest('.blog-modal').remove()">&times;</button>
                </div>
                <div class="blog-modal-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(post.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                    <span class="post-category">${this.capitalizeFirst(post.category)}</span>
                </div>
                <div class="blog-modal-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-modal-body">
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-content">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                        <h3>The Importance of Quality</h3>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

                        <blockquote>
                            "Quality is not an act, it is a habit." - Aristotle
                        </blockquote>

                        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                    </div>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;

        // Simulate API call
        window.eliteShop.showNotification('Thank you for subscribing to our blog!', 'success');
        e.target.reset();
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Initialize blog manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('blog.html')) {
        window.blogManager = new BlogManager();
    }
});