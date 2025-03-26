document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    });

    // Initialize cart count badge
    initializeCartBadge();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking a nav link
        const mobileNavLinks = navLinks.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Testimonial Slider with Touch Support
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonials.length > 0 && prevBtn && nextBtn) {
        let currentSlide = 0;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Hide all testimonials except the first one
        testimonials.forEach((testimonial, index) => {
            if (index !== 0) {
                testimonial.style.display = 'none';
            }
        });
        
        // Show a specific testimonial
        function showTestimonial(index) {
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
            });
            testimonials[index].style.display = 'block';
        }
        
        // Next button click
        nextBtn.addEventListener('click', function() {
            currentSlide++;
            if (currentSlide >= testimonials.length) {
                currentSlide = 0;
            }
            showTestimonial(currentSlide);
        });
        
        // Previous button click
        prevBtn.addEventListener('click', function() {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = testimonials.length - 1;
            }
            showTestimonial(currentSlide);
        });

        // Add touch swipe functionality for mobile
        if (testimonialSlider) {
            testimonialSlider.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            testimonialSlider.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left, go to next slide
                    nextBtn.click();
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right, go to previous slide
                    prevBtn.click();
                }
            }
        }
    }

    // Collection Category Tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    const collectionItems = document.querySelectorAll('.collection-item');
    
    if (categoryTabs.length > 0 && collectionItems.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                categoryTabs.forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Get category from data attribute
                const category = this.getAttribute('data-category');
                
                // Show/hide collection items based on category
                collectionItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // FAQ Toggles
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    if (faqToggles.length > 0) {
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item');
                faqItem.classList.toggle('active');
                
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-plus')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * Initializes the cart count badge in the navigation
 * This function can be called from any page to consistently display the cart count
 */
function initializeCartBadge() {
    // Add cart count badge to shopping bag icon in navigation
    const shoppingBagIcon = document.querySelector('.nav-icons a[href="cart.html"]');
    if (shoppingBagIcon) {
        const cartCountBadge = document.createElement('span');
        cartCountBadge.className = 'cart-count';
        shoppingBagIcon.style.position = 'relative';
        shoppingBagIcon.appendChild(cartCountBadge);
        
        try {
            // Get cart from localStorage
            let cart = [];
            const cartData = localStorage.getItem('eleganceCart');
            
            if (cartData) {
                cart = JSON.parse(cartData);
                console.log('Cart loaded from localStorage:', cart);
                
                // Ensure cart is an array
                if (Array.isArray(cart)) {
                    // Calculate total items in cart
                    const cartCount = cart.reduce((total, item) => {
                        return total + (item.quantity || 0);
                    }, 0);
                    
                    console.log('Total items in cart:', cartCount);
                    
                    // Update cart count badge
                    cartCountBadge.textContent = cartCount;
                    
                    if (cartCount > 0) {
                        cartCountBadge.classList.add('show');
                    }
                } else {
                    console.error('Cart data is not an array:', cart);
                }
            } else {
                console.log('No cart found in localStorage');
            }
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
        }
    }
}

// Make the function globally available
window.initializeCartBadge = initializeCartBadge;