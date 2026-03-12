document.getElementById("submit-register").addEventListener("click", async () => {

    const fullName = document.getElementById("reg-name").value
    const email = document.getElementById("reg-email").value
    const password = document.getElementById("reg-pass").value

    const res = await fetch("/api/RegisterCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password })
    })

    const data = await res.json()

    alert("Account created. Your instructor code: " + data.secretCode)
})

document.getElementById("submit-login").addEventListener("click", async () => {

    const email = document.getElementById("login-email").value
    const password = document.getElementById("login-pass").value

    const res = await fetch("/api/LoginCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    document.getElementById("display-secret-code").innerText = data.secretCode

    document.getElementById("login-view").classList.remove("active")
    document.getElementById("dashboard-view").classList.add("active")
})