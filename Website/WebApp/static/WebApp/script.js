// Smooth scrolling for navigation
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Access form submission
    const accessForm = document.getElementById('accessForm');
    if (accessForm) {
        accessForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const profession = document.getElementById('profession').value;
            
            // Here you would typically send the data to your server
            console.log('Pilot program signup:', { email, profession });
            
            // Show success message
            alert('Thank you for your interest! We\'ll be in touch soon with early access details.');
            
            // Reset form
            accessForm.reset();
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you would typically send the data to your server
            console.log('Newsletter signup:', email);
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            
            // Reset form
            this.reset();
        });
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.step-card, .audience-card, .feature-card, .validation-card, .case-card, .ethics-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add scroll effect to hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add loading state if it's a form submission
            if (this.type === 'submit') {
                const originalText = this.innerHTML;
                this.innerHTML = 'Processing...';
                this.disabled = true;
                
                // Re-enable after 2 seconds (in real app, this would be after server response)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
});

// Add dynamic metrics animation
function animateMetrics() {
    const metrics = document.querySelectorAll('.stat-number');
    
    metrics.forEach(metric => {
        const finalValue = metric.textContent;
        const isPercentage = finalValue.includes('%');
        const isTime = finalValue.includes('hrs') || finalValue.includes('ms');
        
        let numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50; // 50 steps
        
        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue * 10) / 10;
            
            if (isPercentage) {
                metric.textContent = displayValue + '%';
            } else if (isTime) {
                if (finalValue.includes('hrs')) {
                    metric.textContent = Math.floor(displayValue) + '+hrs';
                } else {
                    metric.textContent = '<' + Math.floor(displayValue) + 'ms';
                }
            } else {
                metric.textContent = displayValue.toFixed(1) + '%';
            }
        }, 50);
    });
}

// Trigger metrics animation when stats section is visible
const statsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateMetrics();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function() {
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});