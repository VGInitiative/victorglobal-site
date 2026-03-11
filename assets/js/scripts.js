/**
 * Victor Global Initiative - Master Script Engine
 * Handles Modular Components, Dynamic Counters, Flip Cards, and Donation Modal
 */

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

        // 3. Highlight Active Navigation Link Automatically
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active-link');
            }
        });

        // 4. Calibrate Impact Counters (Wait slightly for DOM to settle)
        setTimeout(() => {
            const counters = document.querySelectorAll('.counter:not(.counted)');
            if (counters.length > 0) initCounters();
        }, 300);

    } catch (err) {
        console.error("VGI Component load failed:", err);
    }
}

/* ==========================================================================
   INTERACTIVE FLIP ENGINE (Initiatives, Board, Impact)
   ========================================================================== */
function handleFlip(card) {
    if (card.classList.contains('is-flipped')) {
        card.classList.remove('is-flipped');
        return;
    }
    card.classList.add('is-flipped');
    
    // Auto-reset card after 8 seconds
    setTimeout(() => {
        card.classList.remove('is-flipped');
    }, 8000);
}

/* ==========================================================================
   MISSION IMPACT COUNTERS (Index / About)
   ========================================================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter:not(.counted)');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                if (isNaN(target)) return;

                // Find the associated Goal and Progress Bar in this specific card
                const card = counter.closest('.flip-card-front');
                const goalTracker = card.querySelector('.goal-tracker');
                const goalValue = parseInt(goalTracker.getAttribute('data-goal'));
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
                        const finalVal = target;
                        counter.innerText = finalVal;
                        
                        // Update the "Accomplished" span and bar width at the end
                        if (accomplishedSpan) accomplishedSpan.innerText = finalVal;
                        if (progressBar && goalValue) {
                            const percent = (finalVal / goalValue) * 100;
                            progressBar.style.width = percent + "%";
                        }
                        
                        clearInterval(timer);
                    } else {
                        const currentCeil = Math.ceil(current);
                        counter.innerText = currentCeil;
                        
                        // Sync the small text while it counts
                        if (accomplishedSpan) accomplishedSpan.innerText = currentCeil;
                        
                        // Sync the bar width while it counts
                        if (progressBar && goalValue) {
                            const percent = (currentCeil / goalValue) * 100;
                            progressBar.style.width = percent + "%";
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
   DONATION MODAL LOGIC (Donate Page)
   ========================================================================== */
function openDonate() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Disable background scrolling
    }
}

function closeDonate() {
    const modal = document.getElementById('donateModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto"; // Re-enable background scrolling
    }
}

// Close modal if user clicks outside the modal content window
window.onclick = function(event) {
    const modal = document.getElementById('donateModal');
    if (event.target === modal) {
        closeDonate();
    }
}

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */
function toggleMenu() {
    const nav = document.getElementById('nav-menu');
    if (nav) nav.classList.toggle('active');
}

// Start the engine when the window loads
window.onload = loadComponents;