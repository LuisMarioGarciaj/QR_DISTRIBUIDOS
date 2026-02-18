const express = require("express");
const router = express.Router();

const metricsController =
    require("../controllers/metricsController");

router.get(
    "/scans",
    metricsController.getScans
);

router.get(
    "/dashboard",
    metricsController.getDashboardMetrics
);

module.exports = router;
