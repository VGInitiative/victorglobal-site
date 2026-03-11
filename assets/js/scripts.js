/**
 * Victor Global Initiative - Master Script Engine
 * Centralized logic for Security, Navigation, Animations, and Impact Tracking
 */

const VGI_CONFIG = {
    name: "Victor Global Initiative",
    ein: "41-3649085",
    regNum: "CH81888",
    regExp: "Jan 20, 2027",
    phone: "+1 (760) 842-8677",
    email: "info@victorglobal.org",
    address: "11507 Dr MLK Blvd Unit 34, Mango, FL 33550"
};

/**
 * 1. COMPONENT ENGINE
 * Fetches and injects shared UI elements and handles global page setup.
 */
async function loadComponents() {
    try {
        // Inject Header & Footer
        const [headerResp, footerResp] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (headerResp.ok) {
            document.getElementById('header-placeholder').innerHTML = await headerResp.text();
        }
        if (footerResp.ok) {
            document.getElementById('footer-placeholder').innerHTML = await footerResp.text();
        }

        // Highlight Active Navigation Link
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active-link');
            }
        });

        // Global Favicon Injection
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = 'assets/images/favicon.png';
        document.head.appendChild(favicon);

        // SEO Meta Tag Injection
        injectMetaTags();

        // Security-Hardened AOS Injection
        injectAnimations();

        // Calibrate Impact Counters (delay for DOM rendering)
        setTimeout(() => {
            const counters = document.querySelectorAll('.counter:not(.counted)');
            if (counters.length > 0) initCounters();
        }, 400);

    } catch (err) {
        console.error("VGI Mission Control: Component load failed", err);
    }
}

/**
 * 2. SECURITY & ANIMATION ENGINE
 * Injects AOS with SHA-384 Integrity verification.
 */
function injectAnimations() {
    // Inject CSS
    const aosCSS = document.createElement('link');
    aosCSS.rel = 'stylesheet';
    aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
    aosCSS.integrity = 'sha384-/rJKQnzOkEo+daG0jMjU1IwwY9unxt1NBw3Ef2fmOJ3PW/TfAg2KXVoWwMZQZtw9';
    aosCSS.crossOrigin = 'anonymous';
    document.head.appendChild(aosCSS);

    // Inject JS
    const aosJS = document.createElement('script');
    aosJS.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
    aosJS.integrity = 'sha384-wziAfh6b/qT+3LrqebF9WeK4+J5sehS6FA10J1t3a866kJ/fvU5UwofWnQyzLtwu';
    aosJS.crossOrigin = 'anonymous';
    
    aosJS.onload = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 1000, once: true });
        }
    };
    document.body.appendChild(aosJS);
}

/**
 * 3. SEO ENGINE
 */
function injectMetaTags() {
    const metaData = {
        "og:title": "Victor Global Initiative | Victors, Not Victims",
        "og:description": "Empowering at-risk youth through military discipline and professional mentorship.",
        "og:image": "https://victorglobal.org/assets/images/impact.jpg",
        "og:type": "website",
        "og:url": window.location.href
    };

    for (const [property, content] of Object.entries(metaData)) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }
}

/**
 * 4. IMPACT TRACKING ENGINE
 * Intersection Observer for data counters and progress bars.
 */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                if (isNaN(target)) return;

                const card = counter.closest('.flip-card-front') || counter.closest('.section-padding');
                if (!card) return;

                const goalTracker = card.querySelector('.goal-tracker');
                const goalValue = goalTracker ? parseInt(goalTracker.getAttribute('data-goal')) : null;
                const progressBar = card.querySelector('.goal-progress');
                const accomplishedSpan = card.querySelector('.accomplished-text');

                counter.classList.add('counted');
                let current = 0;
                const duration = 2000; 
                const steps = 50;
                const increment = target / steps;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.innerText = target;
                        if (accomplishedSpan) accomplishedSpan.innerText = target;
                        if (progressBar && goalValue) progressBar.style.width = (target / goalValue * 100) + "%";
                        clearInterval(timer);
                    } else {
                        const val = Math.ceil(current);
                        counter.innerText = val;
                        if (accomplishedSpan) accomplishedSpan.innerText = val;
                        if (progressBar && goalValue) progressBar.style.width = (val / goalValue * 100) + "%";
                    }
                }, duration / steps);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.counter:not(.counted)').forEach(c => observer.observe(c));
}

/**
 * 5. INTERACTIVE EVENT HANDLERS
 */
function openDonate() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeDonate() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Global Click Delegation
document.addEventListener('click', (e) => {
    // Mobile Navigation Toggle
    if (e.target.closest('.hamburger')) {
        const nav = document.querySelector('nav');
        if (nav) nav.classList.toggle('active');
    }

    // Modal Backdrop Click
    if (e.target.classList.contains('modal')) {
        closeDonate();
    }

    // Flip Card Handling (Global listener for touch/click)
    const flipCard = e.target.closest('.flip-card, .initiative-card');
    if (flipCard) {
        flipCard.classList.toggle('is-flipped');
    }
});

// Launch System
window.addEventListener('DOMContentLoaded', loadComponents);