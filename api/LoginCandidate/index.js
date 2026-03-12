const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {

    const { email, password } = req.body;

    const client = new CosmosClient(process.env.COSMOS_CONNECTION);

    const container = client
        .database("vgi")
        .container("candidates");

    const { resources } = await container.items
        .query({
            query: "SELECT * FROM c WHERE c.email = @email",
            parameters: [{ name: "@email", value: email }]
        })
        .fetchAll();

    if (resources.length === 0) {
        context.res = { status: 401, body: { message: "User not found" } };
        return;
    }

    const user = resources[0];

    if (user.password !== password) {
        context.res = { status: 401, body: { message: "Invalid password" } };
        return;
    }

    context.res = {
        status: 200,
        body: {
            name: user.name,
            secretCode: user.secretCode
        }
    };
};