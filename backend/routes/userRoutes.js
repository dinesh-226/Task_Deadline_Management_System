const express = require("express");
const router = express.Router();

const { getInterns, logoutUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

router.get("/interns", protect, admin, getInterns);
router.post("/logout",protect, logoutUser)

module.exports = router;
