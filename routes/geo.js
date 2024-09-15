const express = require("express");
const router = express.Router();
const geoController = require("../controllers/geoController");

router.get("/:ip_address", geoController.handleGetGeoInfo);
router.get("/history/:user_id", geoController.handleGetHistory);
router.delete("/history", geoController.handleDeleteHistory);

module.exports = router;
