/**
 * Victor Global Initiative - Master Script Engine
 * Handles Modular Components, Tracking, Dynamic Animations, and Governance
 */

// ==========================================================================
// 1. GLOBAL TRACKING INITIALIZATION (Aviation-Grade Integrity)
// ==========================================================================
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

// ==========================================================================
// 2. COMPONENT INJECTION & INITIALIZATION
// ==========================================================================
async function loadComponents() {
    try {
        // Inject Header & Footer dynamically
        const [headerResp, footerResp] = await Promise.all([
            fetch('header.html'),
            fetch('footer.html')
        ]);

        if (headerResp.ok) document.getElementById('header-placeholder').innerHTML = await headerResp.text();
        if (footerResp.ok) document.getElementById('footer-placeholder').innerHTML = await footerResp.text();

        // Inject Favicon
        const favicon = document.createElement('link');
        favicon.rel = 'icon'; favicon.type = 'image/png'; favicon.href = 'assets/images/favicon.png';
        document.head.appendChild(favicon);

        // Inject AOS CSS
        const aosCSS = document.createElement('link');
        aosCSS.rel = 'stylesheet'; aosCSS.href = 'https://unpkg.com/aos@2.3.1/dist/aos.css';
        document.head.appendChild(aosCSS);

        // Highlight Active Navigation Link
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active-link');
            }
        });

        // Initialize AOS (Animate on Scroll)
        const aosJS = document.createElement('script');
        aosJS.src = 'https://unpkg.com/aos@2.3.1/dist/aos.js';
        aosJS.onload = () => { 
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 800, once: true, offset: 100 });
                // Refresh AOS after DOM shifting to ensure accurate scroll triggers
                setTimeout(() => AOS.refresh(), 500); 
            }
        };
        document.body.appendChild(aosJS);

        // Initialize Counters & Meta Tags
        setTimeout(initCounters, 300);
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

// ==========================================================================
// 3. INTERACTIVE LOGIC (Counters, Modals, Mobile Nav)
// ==========================================================================
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

// Donation Modal Logic
function openDonate() { 
    document.getElementById('donateModal').style.display = "block"; 
    document.body.style.overflow = "hidden"; 
}

function closeDonate() { 
    document.getElementById('donateModal').style.display = "none"; 
    document.body.style.overflow = "auto"; 
}

// Global Click Listener (Hamburger Menu & Modal Exits)
document.addEventListener('click', (e) => {
    // FIX: Targets the '.nav-list' to match the updated style.css
    if (e.target.closest('.hamburger')) {
        const navList = document.querySelector('.nav-list');
        if(navList) navList.classList.toggle('active');
    }
    
    // Close modal if clicking outside the modal content
    if (e.target.classList.contains('modal')) {
        closeDonate();
    }
});

// ==========================================================================
// 4. SCHOLARSHIP INTAKE ENGINE
// ==========================================================================

// Teacher Upload Verification Logic
async function verifyTeacherCode() {
    const code = document.getElementById('teacher-code').value;
    const statusDiv = document.getElementById('upload-status');
    
    if (code.length !== 8 || !code.startsWith('VGI-')) { // Updated to match length of VGI-XXXX
        statusDiv.innerHTML = "<p style='color:red; font-weight: 600;'>Invalid Code Format. Must be VGI-XXXX.</p>";
        return;
    }

    statusDiv.innerHTML = "<p style='color:var(--secondary); font-weight: 600;'>Verifying Code with VGI Database...</p>";
    
    // Simulate Azure Function Call Delay
    setTimeout(() => {
        statusDiv.innerHTML = "<p style='color:green; font-weight: 600;'>Code Verified. System ready for document transmission.</p>";
        // Logic to reveal file upload input would go here
    }, 1500);
}

// Automated Secret Code Generator (For New Candidate Registrations)
function generateSecretCode() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = 'VGI-';
    for (let i = 0; i < 4; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

/* ==========================================================================
   VAULT UPLOAD ENGINE (Direct-to-Azure Blob Storage)
   ========================================================================== */

/**
 * Handles the secure transmission of files to Azure Blob Storage
 * @param {string} fileInputId - The ID of the HTML input element
 * @param {string} feedbackId - The ID of the element to show status updates
 */
async function uploadFile(fileInputId, feedbackId) {
    const fileInput = document.getElementById(fileInputId);
    const feedback = document.getElementById(feedbackId);
    
    if (!fileInput || !fileInput.files[0]) {
        feedback.innerText = "The Victor Standard requires a file selection first.";
        feedback.style.color = "red";
        return;
    }

    const file = fileInput.files[0];
    feedback.innerText = "Requesting secure clearance from the Vault...";
    feedback.style.color = "var(--white)"; // Matches your site typography

    try {
        // 1. Fetch the time-limited SAS Token from our Azure Function
        const response = await fetch(`/api/GetUploadToken?file=${encodeURIComponent(file.name)}`);
        
        if (!response.ok) throw new Error("Could not obtain secure token.");
        
        const { uploadUrl } = await response.json();

        feedback.innerText = "Clearance granted. Transmitting to VGI Vault...";

        // 2. Perform the Direct-to-Blob Upload
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'x-ms-blob-type': 'BlockBlob',
                'Content-Type': file.type
            },
            body: file
        });

        if (uploadResponse.ok) {
            feedback.innerText = "Success: Document secured in the Vault.";
            feedback.style.color = "var(--secondary)"; // Using your mint seafoam success color
        } else {
            throw new Error("Vault rejected transmission.");
        }

    } catch (err) {
        console.error("VGI Vault Error:", err);
        feedback.innerText = "Error: Connection to the Vault failed. Please re-authenticate.";
        feedback.style.color = "red";
    }
}

// Ignition
window.onload = loadComponents;