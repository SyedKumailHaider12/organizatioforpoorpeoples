// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown > a').forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdownToggle.parentElement.classList.toggle('active');
            }
        });
    });
}

// ===== Hero Slider =====
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('heroPrev');
const nextBtn = document.getElementById('heroNext');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

if (slides.length > 0) {
    if (nextBtn) nextBtn.addEventListener('click', () => { stopSlider(); nextSlide(); startSlider(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { stopSlider(); prevSlide(); startSlider(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopSlider();
            showSlide(parseInt(dot.dataset.slide));
            startSlider();
        });
    });

    startSlider();
}

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');

function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString() + '+';
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => statsObserver.observe(num));

// ===== Testimonials Slider =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const tDots = document.querySelectorAll('.t-dot');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonialCards.forEach(card => card.classList.remove('active'));
    tDots.forEach(dot => dot.classList.remove('active'));

    currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;

    if (testimonialCards[currentTestimonial]) testimonialCards[currentTestimonial].classList.add('active');
    if (tDots[currentTestimonial]) tDots[currentTestimonial].classList.add('active');
}

if (testimonialCards.length > 0) {
    tDots.forEach(dot => {
        dot.addEventListener('click', () => {
            showTestimonial(parseInt(dot.dataset.index));
        });
    });

    // Auto-rotate testimonials
    setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 6000);
}

// ===== Back to Top =====
const backToTop = document.getElementById('backToTop');

if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== Scroll Animations =====
const animatedElements = document.querySelectorAll('.service-card, .hospital-card, .help-card, .news-card, .stat-card, .about-feature, .doctor-card, .gallery-item');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            scrollObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

animatedElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `all 0.6s ease ${index * 0.1}s`;
    scrollObserver.observe(el);
});

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Donation Amount Buttons handled per-page inline scripts.

// ===== Contact Form Submission =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = '#28a745';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// Donate form is handled by donate.html's own inline script.
