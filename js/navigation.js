/**
 * Navigation JavaScript for Natur Gym Website
 * Handles mobile menu functionality and navigation interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Navigation elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle functionality
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // Toggle active classes
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle aria attributes for accessibility
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            navMenu.setAttribute('aria-hidden', !isExpanded);
            
            // Prevent body scroll when menu is open
            if (isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const scrollThreshold = 100;

    function handleNavbarScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll (optional - can be enabled)
        // if (Math.abs(scrollTop - lastScrollTop) > 5) {
        //     if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
        //         // Scrolling down
        //         navbar.style.transform = 'translateY(-100%)';
        //     } else {
        //         // Scrolling up
        //         navbar.style.transform = 'translateY(0)';
        //     }
        // }
        
        lastScrollTop = scrollTop;
    }

    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleNavbarScroll, 10);
    });

    // Set active navigation link based on current page
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (currentPage === '/' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Initialize active nav link
    setActiveNavLink();

    // Handle keyboard navigation
    function handleKeyboardNavigation(event) {
        if (event.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            navToggle.focus(); // Return focus to toggle button
        }
    }

    document.addEventListener('keydown', handleKeyboardNavigation);

    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    event.preventDefault();
                    
                    // Close mobile menu if open
                    if (navMenu && navMenu.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        navToggle.setAttribute('aria-expanded', 'false');
                        navMenu.setAttribute('aria-hidden', 'true');
                        document.body.style.overflow = '';
                    }
                    
                    // Calculate offset for fixed navbar
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize smooth scroll
    initSmoothScroll();

    // Add loading states for navigation links
    function addLoadingStates() {
        navLinks.forEach(link => {
            // Skip anchor links and external links
            if (link.getAttribute('href').startsWith('#') || 
                link.getAttribute('href').startsWith('http')) {
                return;
            }
            
            link.addEventListener('click', function() {
                // Add loading state
                this.style.opacity = '0.6';
                this.style.pointerEvents = 'none';
                
                // Remove loading state after a short delay
                setTimeout(() => {
                    this.style.opacity = '';
                    this.style.pointerEvents = '';
                }, 500);
            });
        });
    }

    // Initialize loading states
    addLoadingStates();

    // Handle window resize
    function handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        }
    }

    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize ARIA attributes
    function initAriaAttributes() {
        if (navToggle && navMenu) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-controls', 'nav-menu');
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
            navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    // Initialize accessibility features
    initAriaAttributes();

    // Add focus trap for mobile menu
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        event.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        event.preventDefault();
                    }
                }
            }
        });
    }

    // Apply focus trap to navigation menu
    if (navMenu) {
        trapFocus(navMenu);
    }

    // Console log for debugging (can be removed in production)
    console.log('Navigation JavaScript initialized successfully');
});

// Utility function to detect if user is on mobile device
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// Utility function to detect if user prefers reduced motion
function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Export functions for use in other scripts if needed
window.NaturNavigation = {
    isMobileDevice,
    prefersReducedMotion
};
