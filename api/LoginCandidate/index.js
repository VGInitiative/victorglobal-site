// VGI Build Version 1.0.3 - Login Alignment
const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('VGI Engine: Processing candidate authentication.');

    // --- 1. HANDLE CORS PRE-FLIGHT (The 405 Fix) ---
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
    const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
    
    if (!connectionString) {
        context.log.error("Missing COSMOS_DB_CONNECTION_STRING.");
        context.res = { status: 500, body: { message: "Ledger configuration error." } };
        return;
    }

    const client = new CosmosClient(connectionString);
    const container = client.database("vgi-scholarships").container("candidates");

    // --- 3. VALIDATE PAYLOAD ---
    const { email, password } = req.body || {};

    if (!email || !password) {
        context.res = { 
            status: 400, 
            body: { message: "Email and Password are required for entry." } 
        };
        return;
    }

    try {
        // --- 4. QUERY THE LEDGER ---
        const querySpec = {
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [
                { name: "@email", value: email.toLowerCase().trim() }
            ]
        };

        const { resources: results } = await container.items.query(querySpec).fetchAll();

        // --- 5. VERIFY CANDIDATE ---
        if (results.length === 0) {
            context.res = { status: 401, body: { message: "Invalid credentials." } };
            return;
        }

        const candidate = results[0];

        // Simple password check (Note: Hashing to be implemented in Phase 3)
        if (candidate.password !== password) {
            context.res = { status: 401, body: { message: "Invalid credentials." } };
            return;
        }

        // --- 6. RETURN AUTHORIZATION ---
        context.res = {
            status: 200,
            body: { 
                authorized: true,
                fullName: candidate.fullName,
                secretCode: candidate.secretCode,
                status: candidate.status || "Incomplete"
            }
        };

    } catch (error) {
        context.log.error("Database Error: ", error);
        context.res = { 
            status: 500, 
            body: { message: "Internal server error connecting to the Ledger." } 
        };
    }
};