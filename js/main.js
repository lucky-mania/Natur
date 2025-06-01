/**
 * Main JavaScript for Natur Gym Website
 * Handles homepage interactions, animations, and general functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Natur Gym - Main JavaScript loaded');

    // Initialize all main functionality
    initScrollAnimations();
    initCounterAnimations();
    initCardInteractions();
    initFormValidation();
    initLoadingStates();
    initImageGallery();
    initTooltips();

    /**
     * Scroll-based animations for elements
     */
    function initScrollAnimations() {
        // Elements to animate on scroll
        const animateElements = document.querySelectorAll('.feature, .class-card, .stat, .philosophy-item, .benefit-card');
        
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const scrollObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Apply initial styles and observe elements
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            scrollObserver.observe(element);
        });
    }

    /**
     * Animated counters for statistics
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat h3');
        let hasAnimated = false;

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        if (counters.length > 0) {
            counterObserver.observe(counters[0].parentElement);
        }

        function animateCounters() {
            counters.forEach(counter => {
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = target / 100;
                const duration = 2000; // 2 seconds
                const stepTime = duration / 100;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    counter.textContent = Math.floor(current) + suffix;
                }, stepTime);
            });
        }
    }

    /**
     * Interactive card hover effects
     */
    function initCardInteractions() {
        const cards = document.querySelectorAll('.class-card, .feature, .trainer-card, .pricing-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                }
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });

            // Add ripple effect on click
            card.addEventListener('click', function(e) {
                if (!this.querySelector('.ripple')) {
                    createRippleEffect(e, this);
                }
            });
        });
    }

    /**
     * Create ripple effect for card interactions
     */
    function createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.classList.add('ripple');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 102, 204, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            z-index: 10;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        // Add ripple animation keyframes if not already added
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Form validation and interaction
     */
    function initFormValidation() {
        const forms = document.querySelectorAll('form');

        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select, textarea');

            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('blur', function() {
                    validateField(this);
                });

                input.addEventListener('input', function() {
                    clearFieldError(this);
                });

                // Enhanced focus styles
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });

                input.addEventListener('blur', function() {
                    this.parentElement.classList.remove('focused');
                });
            });

            // Form submission handling
            form.addEventListener('submit', function(e) {
                let isValid = true;

                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isValid = false;
                    }
                });

                if (!isValid) {
                    e.preventDefault();
                    // Focus on first invalid field
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        firstError.focus();
                    }
                }
            });
        });
    }

    /**
     * Validate individual form field
     */
    function validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        clearFieldError(field);

        if (isRequired && !value) {
            showFieldError(field, 'Este campo é obrigatório');
            return false;
        }

        if (value) {
            switch (fieldType) {
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        showFieldError(field, 'Por favor, insira um e-mail válido');
                        return false;
                    }
                    break;

                case 'tel':
                    const phoneRegex = /^\(?[1-9]\d{1}\)?[0-9]{4,5}-?[0-9]{4}$/;
                    if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                        showFieldError(field, 'Por favor, insira um telefone válido');
                        return false;
                    }
                    break;

                case 'number':
                    const min = parseFloat(field.getAttribute('min'));
                    const max = parseFloat(field.getAttribute('max'));
                    const numValue = parseFloat(value);
                    
                    if (isNaN(numValue)) {
                        showFieldError(field, 'Por favor, insira um número válido');
                        return false;
                    }
                    
                    if (min !== null && numValue < min) {
                        showFieldError(field, `Valor mínimo: ${min}`);
                        return false;
                    }
                    
                    if (max !== null && numValue > max) {
                        showFieldError(field, `Valor máximo: ${max}`);
                        return false;
                    }
                    break;
            }
        }

        showFieldSuccess(field);
        return true;
    }

    /**
     * Show field error message
     */
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: hsl(0, 72%, 51%);
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    /**
     * Show field success state
     */
    function showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
    }

    /**
     * Clear field error state
     */
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * Loading states for buttons and forms
     */
    function initLoadingStates() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Skip if it's a form submit button (handled by form validation)
                if (this.type === 'submit') return;

                // Skip if it's an anchor tag with href
                if (this.tagName === 'A' && this.getAttribute('href') && 
                    !this.getAttribute('href').startsWith('#')) {
                    
                    addLoadingState(this);
                    
                    // Remove loading state after navigation
                    setTimeout(() => {
                        removeLoadingState(this);
                    }, 1000);
                }
            });
        });
    }

    /**
     * Add loading state to button
     */
    function addLoadingState(button) {
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        const originalText = button.textContent;
        button.setAttribute('data-original-text', originalText);
        button.textContent = 'Carregando...';
        
        // Add loading spinner
        const spinner = document.createElement('span');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = `
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 8px;
        `;
        button.appendChild(spinner);

        // Add spinner animation if not already added
        if (!document.querySelector('#spinner-animation')) {
            const style = document.createElement('style');
            style.id = 'spinner-animation';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Remove loading state from button
     */
    function removeLoadingState(button) {
        button.style.opacity = '';
        button.style.pointerEvents = '';
        
        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
            button.removeAttribute('data-original-text');
        }
        
        const spinner = button.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    /**
     * Simple image gallery functionality
     */
    function initImageGallery() {
        const galleryImages = document.querySelectorAll('[data-gallery]');
        
        galleryImages.forEach(image => {
            image.addEventListener('click', function() {
                openLightbox(this);
            });
            
            image.style.cursor = 'pointer';
            image.setAttribute('role', 'button');
            image.setAttribute('tabindex', '0');
            
            // Keyboard support
            image.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(this);
                }
            });
        });
    }

    /**
     * Open lightbox for image viewing
     */
    function openLightbox(image) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        `;

        const img = document.createElement('img');
        img.src = image.src || image.style.backgroundImage.slice(5, -2);
        img.alt = image.alt || 'Imagem ampliada';
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            font-size: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        lightbox.appendChild(img);
        lightbox.appendChild(closeBtn);
        document.body.appendChild(lightbox);

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Close lightbox events
        const closeLightbox = () => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        };

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        closeBtn.addEventListener('click', closeLightbox);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeLightbox();
            }
        });

        // Focus management
        closeBtn.focus();
    }

    /**
     * Tooltip functionality
     */
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('focus', showTooltip);
            element.addEventListener('blur', hideTooltip);
        });
    }

    /**
     * Show tooltip
     */
    function showTooltip(e) {
        const element = e.target;
        const tooltipText = element.getAttribute('data-tooltip');
        
        if (!tooltipText) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
        `;

        document.body.appendChild(tooltip);

        // Position tooltip
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top = rect.top - tooltipRect.height - 8;
        let left = rect.left + (rect.width - tooltipRect.width) / 2;

        // Adjust if tooltip goes off screen
        if (top < 0) {
            top = rect.bottom + 8;
        }
        
        if (left < 0) {
            left = 8;
        } else if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 8;
        }

        tooltip.style.top = top + window.scrollY + 'px';
        tooltip.style.left = left + 'px';
        
        // Store reference for cleanup
        element._tooltip = tooltip;
        
        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
    }

    /**
     * Hide tooltip
     */
    function hideTooltip(e) {
        const element = e.target;
        const tooltip = element._tooltip;
        
        if (tooltip) {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
            delete element._tooltip;
        }
    }

    // Lazy loading for images
    function initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    }

    // Initialize lazy loading if there are lazy images
    if (document.querySelector('img[data-src]')) {
        initLazyLoading();
    }

    // Performance monitoring
    function logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const loadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`Page load time: ${loadTime}ms`);
                }, 0);
            });
        }
    }

    // Initialize performance monitoring
    logPerformance();

    console.log('All main functionality initialized successfully');
});

// Utility functions available globally
window.NaturGym = {
    // Smooth scroll to element
    scrollTo: function(selector, offset = 0) {
        const element = document.querySelector(selector);
        if (element) {
            const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
                top: top,
                behavior: 'smooth'
            });
        }
    },

    // Show notification
    showNotification: function(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;

        // Set colors based on type
        const colors = {
            info: '#0066CC',
            success: '#4ADE80',
            warning: '#EAB308',
            error: '#DC2626'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
};
