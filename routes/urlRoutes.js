const express = require("express");
const { shortenUrl, getOriginalUrl, redirectUrl} = require("../controllers/urlController");
const router = express.Router();
router.post("/shorten", shortenUrl);
router.get("/lookup/:shortId", getOriginalUrl);
router.get("/:shortId", redirectUrl);
module.exports = router;