module.exports = async function (context, req) {
    const { youth, partners, programs } = req.body;

    // This connects to your Azure Table Storage (part of your $2000 credit)
    context.bindings.tableBinding = {
        PartitionKey: "VGI",
        RowKey: "Stats",
        YouthReached: youth,
        Partners: partners,
        Programs: programs
    };

    context.res = {
        status: 200,
        body: "Impact updated successfully."
    };
};
const { BlobServiceClient } = require('@azure/storage-blob');
const { TableClient } = require('@azure/data-tables');
const multipart = require('parse-multipart-data');

module.exports = async function (context, req) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    try {
        // 1. Parse the Incoming Data (Image + Text)
        const boundary = multipart.getBoundary(req.headers['content-type']);
        const parts = multipart.Parse(req.body, boundary);
        
        let data = {};
        let fileData = null;

        parts.forEach(part => {
            if (part.filename) {
                fileData = part; // This is your image
            } else {
                data[part.name] = part.data.toString(); // This is your text (bio, stats, etc)
            }
        });

        // 2. IF IMAGE EXISTS: Upload to Blob Storage
        let imageUrl = "";
        if (fileData) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('media');
            const blobName = `${Date.now()}-${fileData.filename}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            await blockBlobClient.upload(fileData.data, fileData.data.length);
            imageUrl = blockBlobClient.url; // This is the link we save to the database
        }

        // 3. SAVE TEXT DATA: Update Table Storage
        const tableClient = TableClient.fromConnectionString(connectionString, "VGIContent");
        
        const entity = {
            partitionKey: data.type || "General",
            rowKey: data.name || "LatestUpdate",
            ...data,
            imageUrl: imageUrl || data.existingImageUrl // Keep old image if new one wasn't uploaded
        };

        await tableClient.upsertEntity(entity);

        context.res = { status: 200, body: "✅ VGI Vault Updated Successfully" };

    } catch (err) {
        context.log.error("VGI Error:", err);
        context.res = { status: 500, body: "❌ Error Syncing with Azure" };
    }
};