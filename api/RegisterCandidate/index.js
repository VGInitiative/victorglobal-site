const { app } = require('@azure/functions');
const { CosmosClient } = require("@azure/cosmos");

app.http('RegisterCandidate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('VGI Engine: Modern v4 Execution Active.');

        const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!connectionString) {
            return { status: 500, jsonBody: { message: "Environment Variable Missing." } };
        }

        try {
            const body = await request.json();
            const { fullName, email, password } = body;

            if (!fullName || !email || !password) {
                return { status: 400, jsonBody: { message: "Data missing." } };
            }

            const client = new CosmosClient(connectionString);
            const container = client.database("vgi-scholarships").container("candidates");

            const secretCode = 'VGI-' + Math.random().toString(36).substring(2, 6).toUpperCase();

            const newCandidate = {
                id: email.toLowerCase().trim(),
                email: email.toLowerCase().trim(),
                fullName: fullName.trim(),
                password: password,
                secretCode: secretCode,
                status: "Incomplete",
                registrationDate: new Date().toISOString()
            };

            await container.items.create(newCandidate);
            return { status: 200, jsonBody: { message: "Success", secretCode } };

        } catch (error) {
            return { status: 500, jsonBody: { message: "ENGINE ERROR: " + error.message } };
        }
    }
});
