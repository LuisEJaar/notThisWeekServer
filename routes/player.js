const express = require("express");
const router = express.Router();
const playersController = require("../controllers/players");

//Player Routes - simplified for now
router.put("/addGame/:id", playersController.addGameToPlayer);

module.exports = router;
