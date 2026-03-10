const { BlobServiceClient } = require('@azure/storage-blob');
const { TableClient } = require('@azure/data-tables');
const multipart = require('parse-multipart-data');

module.exports = async function (context, req) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
    
    try {
        // 1. Parse the Incoming "Cargo" (Image + Text)
        const boundary = multipart.getBoundary(req.headers['content-type']);
        const parts = multipart.Parse(req.body, boundary);
        
        let data = {};
        let fileData = null;

        parts.forEach(part => {
            if (part.filename) {
                fileData = part; // This is the photo file
            } else {
                data[part.name] = part.data.toString(); // This is the text (youth count, bio, etc)
            }
        });

        // 2. IF PHOTO EXISTS: Upload to the 'media' container in Azure
        let imageUrl = "";
        if (fileData) {
            const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
            const containerClient = blobServiceClient.getContainerClient('media');
            
            // Create a unique name so images don't overwrite each other
            const blobName = `${Date.now()}-${fileData.filename}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            await blockBlobClient.upload(fileData.data, fileData.data.length, {
                blobHTTPHeaders: { blobContentType: fileData.type }
            });
            imageUrl = blockBlobClient.url;
        }

        // 3. SAVE TO DATABASE: Update the 'VGIContent' table
        const tableClient = TableClient.fromConnectionString(connectionString, "VGIContent");
        
        // Use the 'type' (impact, leadership, or initiatives) as the PartitionKey
        const entity = {
            partitionKey: data.type || "General",
            rowKey: data.name || data.title || "LatestUpdate",
            ...data,
            imageUrl: imageUrl || data.existingImageUrl || "" 
        };

        await tableClient.upsertEntity(entity);

        context.res = { 
            status: 200, 
            body: "✅ VGI Vault Updated Successfully" 
        };

    } catch (err) {
        // This is the "Diagnostic" part that talks to the Azure Logs
        context.log.error("--- VGI VAULT ERROR REPORT ---");
        context.log.error("Error Message:", err.message);
        context.log.error("Error Code:", err.code || "N/A");
        context.log.error("Status Code:", err.statusCode || "N/A");
        
        context.res = { 
            status: err.statusCode || 500, 
            body: `VAULT_REJECTION: ${err.message}` 
        };
    }
};