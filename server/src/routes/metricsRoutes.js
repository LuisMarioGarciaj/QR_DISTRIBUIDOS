const express = require("express");
const router = express.Router();

const metricsController =
    require("../controllers/metricsController");

router.get(
    "/rounds",
    metricsController.getRounds
);
router.get(
    "/scans",
    metricsController.getScans
);
router.get(
    "/shifts",
    metricsController.getShifts
);
router.get(
    "/compliance",
    metricsController.getCompliance
);
router.get(
    "/dashboard",
    metricsController.getDashboardMetrics
);

module.exports = router;
