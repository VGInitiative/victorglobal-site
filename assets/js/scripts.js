/**
 * Victor Global Initiative - Master Script Engine
 * Handles Modular Components, Tracking, Dynamic Counters, and Governance
 */

// 1. GLOBAL TRACKING INITIALIZATION (Aviation-Grade Integrity)
(function() {
    const GA_ID = 'G-DER09HHGKX';
    const AW_TAG = 'AW-17894206414';
    
    // Inject GA4 Script
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag; // Make globally accessible
    gtag('js', new Date());

    // Initialize both properties
    gtag('config', GA_ID);
    gtag('config', AW_TAG);
})();

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

        if (headerResp.ok) document.getElementById('header-placeholder').innerHTML = await headerResp.text();
        if (footerResp.ok) document.getElementById('footer-placeholder').innerHTML = await footerResp.text();

        // 2. Favicon & CSS Assets
        const favicon = document.createElement('link');
        favicon.rel = 'icon'; favicon.type = 'image/png'; favicon.href = 'assets/images/favicon.png';
        document.head.appendChild(favicon);

        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet'; aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(aosCSS);

        // 3. Navigation Activity
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('nav a').forEach(link => {
            if (link.getAttribute('href') === currentPage) link.classList.add('active-link');
        });

        // 4. Initialize AOS (Animate on Scroll)
        const aosJS = document.createElement('script');
        aosJS.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        aosJS.onload = () => { if (typeof AOS !== 'undefined') AOS.init({ duration: 1000, once: true }); };
        document.body.appendChild(aosJS);

        // 5. Impact Counters
        setTimeout(initCounters, 300);

        // 6. Meta Tags (Social/SEO)
        injectMetaTags();

    } catch (err) {
        console.error("VGI Component load failed:", err);
    }
}

function injectMetaTags() {
    const metaData = {
        "og:title": "Victor Global Initiative | Victors, Not Victims",
        "og:description": "Empowering at-risk youth through military discipline and professional mentorship.",
        "og:image": "https://victorglobal.org/assets/images/impact.jpg",
        "og:type": "website",
        "og:url": window.location.href
    };
    for (const [property, content] of Object.entries(metaData)) {
        let meta = document.querySelector(`meta[property="${property}"]`) || document.createElement('meta');
        meta.setAttribute('property', property);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
    }
}

/* INTERACTIVE LOGIC (Counters, Modals, Flips) */
function initCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                counter.classList.add('counted');
                let current = 0;
                const timer = setInterval(() => {
                    current += target / 50;
                    if (current >= target) {
                        counter.innerText = target;
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.ceil(current);
                    }
                }, 40);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.counter').forEach(c => observer.observe(c));
}

function openDonate() { 
    document.getElementById('donateModal').style.display = "block"; 
    document.body.style.overflow = "hidden"; 
}

function closeDonate() { 
    document.getElementById('donateModal').style.display = "none"; 
    document.body.style.overflow = "auto"; 
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.hamburger')) document.querySelector('nav').classList.toggle('active');
    if (e.target.classList.contains('modal')) closeDonate();
});

window.onload = loadComponents;