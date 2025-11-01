// ===============================================
// HOSTINO - Main JavaScript
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ===============================================
    // NAVIGATION - Mobile Menu Toggle
    // ===============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // ===============================================
    // NAVIGATION - Scroll Effect
    // ===============================================
    const navbar = document.querySelector('.nav-bar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===============================================
    // DOMAIN SEARCH - Mock Functionality
    // ===============================================
    const domainInput = document.getElementById('domain-input');
    const searchDomainBtn = document.getElementById('search-domain-btn');
    const domainResult = document.getElementById('domain-result');
    const searchedDomain = document.getElementById('searched-domain');
    
    if (searchDomainBtn && domainInput) {
        searchDomainBtn.addEventListener('click', function() {
            const domain = domainInput.value.trim();
            
            if (domain) {
                // Format domain
                let formattedDomain = domain.toLowerCase();
                if (!formattedDomain.includes('.')) {
                    formattedDomain += '.com';
                }
                
                // Show result
                searchedDomain.textContent = formattedDomain;
                domainResult.classList.remove('hidden');
                
                // Smooth scroll to result
                domainResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                alert('Please enter a domain name');
            }
        });
        
        // Allow Enter key
        domainInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchDomainBtn.click();
            }
        });
    }

    // ===============================================
    // SMOOTH SCROLL for Anchor Links
    // ===============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#contact') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===============================================
    // FADE IN ANIMATION on Scroll
    // ===============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // ===============================================
    // PRICING CARDS - Hover Effect Enhancement
    // ===============================================
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 20px 60px rgba(0, 123, 255, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            if (!this.classList.contains('featured')) {
                this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            }
        });
    });

    // ===============================================
    // FEATURE CARDS - Staggered Animation
    // ===============================================
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        const cardObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });

    // ===============================================
    // TESTIMONIAL CARDS - Staggered Animation
    // ===============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    testimonialCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        
        const cardObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        cardObserver.observe(card);
    });

    // ===============================================
    // LOADING ANIMATION (Initial Page Load)
    // ===============================================
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // ===============================================
    // CURSOR EFFECT (Optional - for premium feel)
    // ===============================================
    const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-hero-primary, a.btn-hero-secondary');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // ===============================================
    // TOOLTIP EFFECT (for icons and badges)
    // ===============================================
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const title = this.getAttribute('title');
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = title;
            tooltip.style.cssText = `
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s ease;
            `;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.bottom + 10 + 'px';
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 200);
            }, { once: true });
        });
    });

    // ===============================================
    // SCROLL TO TOP BUTTON (appears on scroll)
    // ===============================================
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #007BFF, #00D4FF);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    scrollTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.boxShadow = '0 8px 25px rgba(0, 123, 255, 0.4)';
    });
    
    scrollTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(0, 123, 255, 0.3)';
    });

    console.log('🚀 Hostino - Website loaded successfully!');
});

