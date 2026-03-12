/**
 * VGI Candidate Portal - Secure Logic Engine
 * Complies with strict 'self' Content Security Policies
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("VGI Portal Engine: Secured and Operational.");

    // --- VIEW CONTROLLER ---
    const switchView = (viewId) => {
        document.querySelectorAll('.auth-card').forEach(card => card.classList.remove('active'));
        const target = document.getElementById(viewId);
        if (target) target.classList.add('active');
        window.scrollTo(0, 0);
    };

    // --- ATTACH EVENT LISTENERS (NON-INLINE) ---
    
    // Navigation Triggers
    const toReg = document.getElementById('go-to-register');
    const toLogin = document.getElementById('go-to-login');
    const toReset = document.getElementById('go-to-reset');
    const backToLogin = document.getElementById('back-to-login');
    const logoutBtn = document.getElementById('btn-logout');

    if (toReg) toReg.addEventListener('click', () => switchView('register-view'));
    if (toLogin) toLogin.addEventListener('click', () => switchView('login-view'));
    if (toReset) toReset.addEventListener('click', () => switchView('reset-view'));
    if (backToLogin) backToLogin.addEventListener('click', () => switchView('login-view'));
    if (logoutBtn) logoutBtn.addEventListener('click', () => location.reload());

    // Login Action
    const submitLogin = document.getElementById('submit-login');
    if (submitLogin) {
        submitLogin.addEventListener('click', async () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-pass').value;

            if (!email || !password) return alert("Credentials required.");

            try {
                const response = await fetch('/api/LoginCandidate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                if (data.authorized) {
                    document.getElementById('display-secret-code').innerText = data.secretCode;
                    switchView('dashboard-view');
                } else {
                    alert(data.message || "Login failed.");
                }
            } catch (err) {
                alert("System connection lost. Verify internet access.");
            }
        });
    }

    // Updated Register Action for assets/js/portal.js
const submitReg = document.getElementById('submit-register');
if (submitReg) {
    submitReg.addEventListener('click', async () => {
        const fullName = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;

        if (!fullName || !email || !password) return alert("All fields are mandatory.");

        try {
            const response = await fetch('/api/RegisterCandidate/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Mission Success: " + data.message);
                switchView('login-view');
            } else {
                // This tells us if the DB is failing or the API is failing
                alert("Engine Alert: " + (data.message || "Unknown Error"));
            }
        } catch (err) {
            // This triggers if the API can't be reached at all
            console.error("Critical Connection Error:", err);
            alert("Connection Lost: The VGI Engine is not responding at /api/RegisterCandidate. Check the Azure 'Functions' tab status.");
        }
    });
}
