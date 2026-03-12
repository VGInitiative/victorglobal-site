const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {

    if (req.method === "OPTIONS") {
        context.res = {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
        return;
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        context.res = {
            status: 400,
            body: { message: "Missing required fields" }
        };
        return;
    }

    const client = new CosmosClient(process.env.COSMOS_CONNECTION);

    const container = client
        .database("vgi")
        .container("candidates");

    const candidate = {
        id: email.toLowerCase(),
        name: fullName,
        email: email.toLowerCase(),
        password: password,
        created: new Date(),
        secretCode: "VGI-" + Math.random().toString(36).substring(2,6).toUpperCase()
    };

    await container.items.create(candidate);

    context.res = {
        status: 200,
        body: {
            message: "Candidate registered",
            secretCode: candidate.secretCode
        }
    };
};