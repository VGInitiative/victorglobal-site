const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");

module.exports = async function (context, req) {
    const fileName = req.query.file; // e.g., "video-statement.mp4"
    const containerName = "scholarship-uploads";

    if (!fileName) {
        context.res = { status: 400, body: "Please specify a file name." };
        return;
    }

    try {
        const connString = process.env.BLOB_STORAGE_CONNECTION_STRING;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
        
        // Generate a unique name for the file to prevent overwriting (e.g., date-filename)
        const blobName = `${new Date().getTime()}-${fileName}`;
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Define permissions: Read and Write for 15 minutes
        const sasOptions = {
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse("rw"),
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 15 * 60 * 1000) // 15 mins
        };

        const sasToken = generateBlobSASQueryParameters(sasOptions, blobServiceClient.credential).toString();

        context.res = {
            status: 200,
            body: {
                uploadUrl: `${blockBlobClient.url}?${sasToken}`,
                blobName: blobName
            }
        };
    } catch (err) {
        context.log.error(err);
        context.res = { status: 500, body: "Error generating upload token." };
    }
};