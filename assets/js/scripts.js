/**
 * Victor Global Initiative - Master Script Engine
 * Handles Modular Components, Dynamic Counters, Flip Cards, and Donation Modal
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

async function loadComponents() {
    try {
        // 1. Inject Header & Footer
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

        // 2. Initialize AOS (Animate on Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({ duration: 1000, once: true });
        }

        // 3. Inject Favicon Globally
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.type = 'image/png';
        favicon.href = 'assets/images/favicon.png';
        document.head.appendChild(favicon);

        // 4. Highlight Active Navigation Link Automatically
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active-link');
            }
        }); // FIXED: Added missing closing brace and parenthesis

        // 5. Centralized AOS Injection (CSS & JS)
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet';
        aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        aosCSS.integrity = 'sha384-/rJKQnzOkEo+daG0jMjU1IwwY9unxt1NBw3Ef2fmOJ3PW/TfAg2KXVoWwMZQZtw9';
        aosCSS.crossOrigin = 'anonymous';
        document.head.appendChild(aosCSS);

        const aosJS = document.createElement('script');
        aosJS.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        aosJS.integrity = 'sha384-wziAfh6b/qT+3LrqebF9WeK4+J5sehS6FA10J1t3a866kJ/fvU5UwofWnQyzLtwu';
        aosJS.crossOrigin = 'anonymous';
        
        aosJS.onload = () => {
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 1000, once: true });
            }
        };
        document.body.appendChild(aosJS); // FIXED: Removed illegal trailing parenthesis/semicolon block

        // 6. Calibrate Impact Counters
        setTimeout(() => {
            const counters = document.querySelectorAll('.counter:not(.counted)');
            if (counters.length > 0) initCounters();
        }, 300);

        // 7. Meta Tag Injection
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
        injectMetaTags();

    } catch (err) {
        console.error("VGI Component load failed:", err);
    }
}

/* ==========================================================================
   INTERACTIVE FLIP ENGINE
   ========================================================================== */
function handleFlip(card) {
    card.classList.toggle('is-flipped');
    
    // Auto-reset card after 8 seconds
    setTimeout(() => {
        card.classList.remove('is-flipped');
    }, 8000);
}

/* ==========================================================================
   MISSION IMPACT COUNTERS
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter:not(.counted)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                if (isNaN(target)) return;

                const card = counter.closest('.flip-card-front');
                if (!card) return; // Guard clause

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
                        if (progressBar && goalValue) {
                            progressBar.style.width = (target / goalValue * 100) + "%";
                        }
                        clearInterval(timer);
                    } else {
                        const currentCeil = Math.ceil(current);
                        counter.innerText = currentCeil;
                        if (accomplishedSpan) accomplishedSpan.innerText = currentCeil;
                        if (progressBar && goalValue) {
                            progressBar.style.width = (currentCeil / goalValue * 100) + "%";
                        }
                    }
                }, duration / steps);
                
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   DONATION MODAL LOGIC
   ========================================================================== */
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

/* ==========================================================================
   CENTRALIZED EVENT LISTENER
   ========================================================================== */
document.addEventListener('click', (e) => {
    // Mobile Menu Toggle
    if (e.target.closest('.hamburger')) {
        const nav = document.querySelector('nav');
        if (nav) nav.classList.toggle('active');
    }

    // Close Modal on Backdrop Click
    if (e.target.classList.contains('modal')) {
        closeDonate();
    }
});

// Start the engine
window.onload = loadComponents;