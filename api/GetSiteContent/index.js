const { TableClient } = require('@azure/data-tables');

module.exports = async function (context, req) {
    // Uses the connection string you saved in the Azure Environment Variables
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const tableClient = TableClient.fromConnectionString(connectionString, "VGIContent");

    try {
        const entities = tableClient.listEntities();
        let results = { stats: {}, gallery: [] };

        for await (const entity of entities) {
            // Sorts data by category based on how you saved it in the admin portal
            if (entity.partitionKey === "impact") {
                results.stats = entity;
            } else if (entity.partitionKey === "initiatives") {
                results.gallery.push(entity);
            }
        }

        context.res = { 
            status: 200, 
            body: results,
            headers: { 'Content-Type': 'application/json' } 
        };
    } catch (err) {
        context.log.error("VGI Data Fetch Error:", err);
        context.res = { status: 500, body: "Error fetching VGI vault data" };
    }
};