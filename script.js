    // Newsletter
    handleNewsletterSubmit(e) {
        e.preventDefault();
        const email = e.target.querySelector('input[type=\"email\"]').value;

        // Simulate API call
        this.showNotification('Thank you for subscribing!', 'success');
        e.target.reset();
    }

    // Contact Form
    handleContactSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const contactData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Simulate API call
        console.log('Contact form submitted:', contactData);
        this.showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }