const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('VGI Engine: Diagnostic Mode Active.');

    // 1. Handle CORS (Same as before)
    if (req.method === "OPTIONS") {
        context.res = { status: 204, headers: { "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } };
        return;
    }

    // 2. CONNECTION CHECK - The most likely failure point
    const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
    if (!connectionString) {
        context.res = { status: 500, body: { message: "DIAGNOSTIC: Environment Variable 'COSMOS_DB_CONNECTION_STRING' is missing in Azure." } };
        return;
    }

    try {
        const client = new CosmosClient(connectionString);
        // Note: Ensure these names match your Azure Cosmos DB exactly!
        const database = client.database("vgi-scholarships");
        const container = database.container("candidates");

        const { fullName, email, password } = req.body || {};
        if (!fullName || !email || !password) {
            context.res = { status: 400, body: { message: "Data missing from request." } };
            return;
        }

        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let secretCode = 'VGI-';
        for (let i = 0; i < 4; i++) secretCode += chars[Math.floor(Math.random() * chars.length)];

        const newCandidate = {
            id: email.toLowerCase().trim(),
            email: email.toLowerCase().trim(),
            fullName: fullName.trim(),
            password: password,
            secretCode: secretCode,
            status: "Incomplete",
            registrationDate: new Date().toISOString()
        };

        // Attempt the write
        await container.items.create(newCandidate);

        context.res = { status: 200, body: { message: "Success", secretCode: secretCode } };

    } catch (error) {
        context.log.error("VGI Diagnostic Error:", error.message);
        
        // This will tell us the EXACT reason (e.g., "Entity Not Found" or "Unauthorized")
        context.res = { 
            status: 500, 
            body: { message: "ENGINE ERROR: " + error.message } 
        };
    }
};