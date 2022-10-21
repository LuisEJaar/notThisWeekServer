const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const charactersController = require("../controllers/characters");


//Character Routes
router.post("/create", upload.single("file"), charactersController.createCharacter);

router.get("/:id", charactersController.getCharacter);

router.put("/addGame/:id", charactersController.addGame);

module.exports = router;
