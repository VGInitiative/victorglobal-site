// VGI Build Version 1.0.3 - Logic Alignment
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('VGI Engine: Processing live candidate registration.');

    // --- 1. HANDLE CORS PRE-FLIGHT (The 405 Fix) ---
    // If the browser is just "checking" the door, tell it the door is open for POST.
    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
        return;
    }

    // --- 2. CONNECT TO THE LEDGER ---
    // Using the primary connection string is the most reliable "Victor Standard" method.
    const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
    
    if (!connectionString) {
        context.log.error("Missing COSMOS_DB_CONNECTION_STRING in Environment Variables.");
        context.res = { status: 500, body: { message: "Ledger configuration error." } };
        return;
    }

    const client = new CosmosClient(connectionString);
    const container = client.database("vgi-scholarships").container("candidates");

    // --- 3. VALIDATE PAYLOAD ---
    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
        context.res = { 
            status: 400, 
            body: { message: "The Victor Standard requires all fields to be completed." } 
        };
        return;
    }

    try {
        // --- 4. GENERATE VGI SECRET CODE ---
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let secretCode = 'VGI-';
        for (let i = 0; i < 4; i++) {
            secretCode += chars[Math.floor(Math.random() * chars.length)];
        }

        // --- 5. CONSTRUCT CADET PAYLOAD ---
        const newCandidate = {
            id: email.toLowerCase().trim(), 
            email: email.toLowerCase().trim(),
            fullName: fullName.trim(),
            password: password, 
            secretCode: secretCode,
            status: "Incomplete",
            registrationDate: new Date().toISOString()
        };

        // --- 6. SAVE TO COSMOS DB ---
        await container.items.create(newCandidate);

        context.res = {
            status: 200,
            body: { 
                message: "Candidate secured in the Ledger.",
                candidateData: {
                    name: fullName,
                    email: newCandidate.email,
                    secretCode: secretCode
                }
            }
        };

    } catch (error) {
        context.log.error("Database Error: ", error);
        
        // This will tell us the EXACT reason for the "Offline" status
        context.res = { 
            status: 500, 
            body: { 
                message: "Ledger Error: " + error.message,
                detail: error.code || "No code" 
            } 
        };
    }
};