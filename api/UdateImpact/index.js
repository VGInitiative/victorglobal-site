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