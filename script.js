// ===================================
// PORTFOLIO WEBSITE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeThemeToggle();
    initializeScrollAnimations();
    initializeContactForm();
    initializeProjectCards();
    initializeSmoothScrolling();
    initializeScrollIndicator();
    initializeResumeDownload();
});

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================

function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Update active navigation link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(248, 250, 252, 0.95)';
            if (document.documentElement.getAttribute('data-theme') === 'dark') {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        } else {
            navbar.style.background = 'var(--glass-bg)';
        }
    });
}

// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Add transition class for smooth theme change
        body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Remove transition after animation
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add staggered animation for skill items
                if (entry.target.classList.contains('skills-list')) {
                    const skillItems = entry.target.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `fadeInLeft 0.6s ease-out ${index * 0.1}s both`;
                        }, index * 100);
                    });
                }
                
                // Add staggered animation for project cards
                if (entry.target.classList.contains('projects-grid')) {
                    const projectCards = entry.target.querySelectorAll('.project-card');
                    projectCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
                        }, index * 200);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.section-header, .about-content, .skills-grid, .projects-grid, .resume-content, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// ===================================
// CONTACT FORM FUNCTIONALITY
// ===================================

function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearFormErrors();
        
        // Validate form
        const formData = new FormData(contactForm);
        const formValues = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            subject: formData.get('subject').trim(),
            message: formData.get('message').trim()
        };
        
        const errors = validateForm(formValues);
        
        if (Object.keys(errors).length > 0) {
            displayFormErrors(errors);
            return;
        }
        
        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            
            // Show success modal
            showModal(successModal);
            
            // Log form data (in real implementation, send to server)
            console.log('Form submitted:', formValues);
        }, 2000);
    });
    
    // Close modal functionality
    closeModalBtn.addEventListener('click', () => hideModal(successModal));
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            hideModal(successModal);
        }
    });
    
    function validateForm(values) {
        const errors = {};
        
        if (!values.name) {
            errors.name = 'Name is required';
        } else if (values.name.length < 2) {
            errors.name = 'Name must be at least 2 characters';
        }
        
        if (!values.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(values.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        if (!values.subject) {
            errors.subject = 'Subject is required';
        } else if (values.subject.length < 5) {
            errors.subject = 'Subject must be at least 5 characters';
        }
        
        if (!values.message) {
            errors.message = 'Message is required';
        } else if (values.message.length < 10) {
            errors.message = 'Message must be at least 10 characters';
        }
        
        return errors;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function displayFormErrors(errors) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}-error`);
            const inputElement = document.getElementById(field);
            
            if (errorElement && inputElement) {
                errorElement.textContent = errors[field];
                inputElement.style.borderColor = '#ef4444';
            }
        });
    }
    
    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        const inputElements = document.querySelectorAll('.form-group input, .form-group textarea');
        
        errorElements.forEach(el => el.textContent = '');
        inputElements.forEach(el => el.style.borderColor = '');
    }
    
    function showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===================================
// PROJECT CARDS FUNCTIONALITY
// ===================================

function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectId = card.getAttribute('data-project');
            handleProjectClick(projectId);
        });
        
        // Add hover sound effect (optional)
        card.addEventListener('mouseenter', function() {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
    
    function handleProjectClick(projectId) {
        // In a real implementation, this could open a modal with project details
        // or navigate to a project page
        console.log(`Project ${projectId} clicked`);
        
        // For now, just add a visual feedback
        const card = document.querySelector(`[data-project="${projectId}"]`);
        card.style.animation = 'pulse 0.6s ease-in-out';
        
        setTimeout(() => {
            card.style.animation = '';
        }, 600);
    }
}

// ===================================
// SMOOTH SCROLLING
// ===================================

function initializeSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// SCROLL INDICATOR
// ===================================

function initializeScrollIndicator() {
    const scrollArrow = document.querySelector('.scroll-arrow');
    
    if (scrollArrow) {
        scrollArrow.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Hide scroll indicator when scrolling
    window.addEventListener('scroll', function() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            const opacity = Math.max(0, 1 - window.scrollY / 300);
            scrollIndicator.style.opacity = opacity;
        }
    });
}

// ===================================
// RESUME DOWNLOAD
// ===================================

function initializeResumeDownload() {
    const downloadBtn = document.getElementById('download-resume');
    
    downloadBtn.addEventListener('click', function() {
        // Create a fake PDF download simulation
        const link = document.createElement('a');
        link.href = '#'; // In real implementation, this would be the actual PDF URL
        link.download = 'Alex_Carter_Resume.pdf';
        
        // Add visual feedback
        downloadBtn.style.transform = 'scale(0.95)';
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Download...';
        
        setTimeout(() => {
            downloadBtn.style.transform = '';
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> Download Complete!';
            
            setTimeout(() => {
                downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Resume';
            }, 2000);
        }, 1500);
        
        // In a real implementation, trigger the actual download
        // link.click();
        
        console.log('Resume download initiated');
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Throttle function for performance optimization
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Optimize scroll events
const optimizedScrollHandler = throttle(() => {
    updateActiveNavLink();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
preloadResources();

// ===================================
// ACCESSIBILITY IMPROVEMENTS
// ===================================

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key closes modals
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            hideModal(openModal);
        }
    }
    
    // Enter key on project cards
    if (e.key === 'Enter' && e.target.classList.contains('project-card')) {
        e.target.click();
    }
});

// Add focus styles for keyboard navigation
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--accent-primary)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
});

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ===================================
// ANALYTICS (Placeholder)
// ===================================

function trackEvent(eventName, eventData) {
    // Placeholder for analytics tracking
    console.log('Analytics Event:', eventName, eventData);
    
    // In a real implementation, you would send this to your analytics service
    // Example: gtag('event', eventName, eventData);
}

// Track important user interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('project-card')) {
        trackEvent('project_card_click', { project_id: e.target.getAttribute('data-project') });
    }
    
    if (e.target.id === 'download-resume') {
        trackEvent('resume_download', { timestamp: Date.now() });
    }
    
    if (e.target.closest('.contact-form')) {
        trackEvent('contact_form_interaction', { element: e.target.tagName });
    }
});

console.log('Portfolio website initialized successfully! 🚀');