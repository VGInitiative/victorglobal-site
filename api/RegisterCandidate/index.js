const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    // This allows the Function to talk to your Ledger
    const endpoint = process.env.AZURE_COSMOS_DB_ENDPOINT;
    const key = process.env.AZURE_COSMOS_DB_KEY;
    const client = new CosmosClient({ endpoint, key });
    
    // ... rest of your registration logic

    context.log('VGI Engine: Processing live candidate registration to Cosmos DB.');

    const { fullName, email, password } = req.body || {};

    if (!fullName || !email || !password) {
        context.res = { status: 400, body: { message: "The Victor Standard requires all fields to be completed." } };
        return;
    }

    try {
        // 1. Connect to the Ledger
        const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
        const container = client.database("vgi-scholarships").container("candidates");

        // 2. Generate the unique VGI Secret Code
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let secretCode = 'VGI-';
        for (let i = 0; i < 4; i++) {
            secretCode += chars[Math.floor(Math.random() * chars.length)];
        }

        // 3. Construct the Cadet Payload
        const newCandidate = {
            id: email.toLowerCase(), // Using email as the unique ID prevents duplicate registrations
            email: email.toLowerCase(), // This is our Partition Key
            fullName: fullName,
            password: password, // Note: For MVP. Phase 3 will involve hashing this for maximum security.
            secretCode: secretCode,
            status: "Incomplete",
            registrationDate: new Date().toISOString()
        };

        // 4. Save to Cosmos DB
        await container.items.create(newCandidate);

        // 5. Return success to the portal
        context.res = {
            status: 200,
            body: { 
                message: "Candidate secured in the Ledger.",
                candidateData: {
                    name: fullName,
                    email: newCandidate.email,
                    secretCode: secretCode,
                    status: "Incomplete"
                }
            }
        };

    } catch (error) {
        context.log.error("Database Error: ", error);
        // If the error is a conflict (status 409), the email is already registered
        if (error.code === 409) {
            context.res = { status: 409, body: { message: "A candidate with this email is already registered." } };
        } else {
            context.res = { status: 500, body: { message: "Internal server error connecting to the Ledger." } };
        }
    }
};