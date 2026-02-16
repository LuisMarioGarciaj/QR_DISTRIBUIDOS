const PatrolRound = require("../models/PatrolRound");
const Scan = require("../models/Scan");
const Shift = require("../models/Shift");


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



// GET /api/metrics/rounds
exports.getRounds = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;

        const filter =
            buildDateFilter("createdAt", startDate, endDate);

        const totalRounds =
            await PatrolRound.countDocuments(filter);

        res.json({
            totalRounds
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

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



// GET /api/metrics/shifts
exports.getShifts = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;

        const filter =
            buildDateFilter("startTime", startDate, endDate);

        const totalShifts =
            await Shift.countDocuments(filter);

        res.json({
            totalShifts
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};



// GET /api/metrics/compliance
exports.getCompliance = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;

        const filter =
            buildDateFilter("createdAt", startDate, endDate);

        const rounds =
            await PatrolRound.find(filter);

        let totalCheckpoints = 0;
        let completedCheckpoints = 0;

        rounds.forEach(round => {

            totalCheckpoints +=
                round.totalCheckpoints || 0;

            completedCheckpoints +=
                round.completedCheckpoints || 0;

        });

        let compliancePercentage = 0;

        if (totalCheckpoints > 0) {

            compliancePercentage =
                (completedCheckpoints / totalCheckpoints) * 100;

        }

        res.json({

            compliancePercentage:
                Number(compliancePercentage.toFixed(2))

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

        const roundFilter =
            buildDateFilter("createdAt", startDate, endDate);

        const scanFilter =
            buildDateFilter("createdAt", startDate, endDate);

        const shiftFilter =
            buildDateFilter("startTime", startDate, endDate);


        const [

            totalRounds,
            totalScans,
            totalShifts,
            rounds

        ] = await Promise.all([

            PatrolRound.countDocuments(roundFilter),

            Scan.countDocuments(scanFilter),

            Shift.countDocuments(shiftFilter),

            PatrolRound.find(roundFilter)

        ]);


        let totalCheckpoints = 0;
        let completedCheckpoints = 0;

        rounds.forEach(round => {

            totalCheckpoints +=
                round.totalCheckpoints || 0;

            completedCheckpoints +=
                round.completedCheckpoints || 0;

        });


        let compliancePercentage = 0;

        if (totalCheckpoints > 0) {

            compliancePercentage =
                (completedCheckpoints / totalCheckpoints) * 100;

        }


        res.json({

            totalRounds,
            totalScans,
            totalShifts,

            compliancePercentage:
                Number(compliancePercentage.toFixed(2))

        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
