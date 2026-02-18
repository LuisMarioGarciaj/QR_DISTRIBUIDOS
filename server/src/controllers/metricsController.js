const Scan = require("../models/Scan");
const User = require("../models/User");


// helper filtro fechas
const buildDateFilter = (field, startDate, endDate) => {

    const filter = {};

    if (startDate || endDate) {

        filter[field] = {};

        if (startDate) {
            filter[field].$gte = new Date(startDate);
        }

        if (endDate) {
            filter[field].$lte = new Date(endDate);
        }
    }

    return filter;
};



// GET /api/metrics/scans
exports.getScans = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;

        const filter =
            buildDateFilter("createdAt", startDate, endDate);

        const totalScans =
            await Scan.countDocuments(filter);

        res.json({
            totalScans
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// GET /api/metrics/dashboard
exports.getDashboardMetrics = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;
        console.log("Metrics Query Params:", { startDate, endDate });

        const scanFilter =
            buildDateFilter("createdAt", startDate, endDate);

        const userFilter =
            buildDateFilter("createdAt", startDate, endDate);

        console.log("User Filter:", JSON.stringify(userFilter));


        const [

            totalScans,
            totalUsers

        ] = await Promise.all([

            Scan.countDocuments(scanFilter),

            User.countDocuments(userFilter)

        ]);

        console.log("Total Users Found:", totalUsers);

        res.json({
            totalScans,
            totalUsers
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
