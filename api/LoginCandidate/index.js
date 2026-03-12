const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
    context.log('VGI Engine: Processing live candidate login from Cosmos DB.');

    const { email, password } = req.body || {};

    if (!email || !password) {
        context.res = { status: 400, body: { message: "Credentials missing." } };
        return;
    }

    try {
        // 1. Connect to the Ledger
        const client = new CosmosClient(process.env.COSMOS_DB_CONNECTION_STRING);
        const container = client.database("vgi-scholarships").container("candidates");

        // 2. Read the specific candidate's file (id and partition key are both the email)
        const { resource: candidate } = await container.item(email.toLowerCase(), email.toLowerCase()).read();

        // 3. Verify Identity
        if (candidate && candidate.password === password) {
            context.res = {
                status: 200,
                body: { 
                    authorized: true,
                    name: candidate.fullName,
                    secretCode: candidate.secretCode,
                    status: candidate.status
                }
            };
        } else {
            context.res = {
                status: 401,
                body: { authorized: false, message: "Invalid credentials. Ensure accuracy." }
            };
        }

    } catch (error) {
        context.log.error("Database Error: ", error);
        context.res = { status: 500, body: { message: "Internal server error connecting to the Ledger." } };
    }
};