const { nanoid } = require('nanoid');
const Url = require('../models/Url');

/**
 * Create a shortened URL entry.
 * Expects `originalUrl` in the request body.
 * Returns the created document along with a full short URL.
 */
const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ message: "OriginalUrl is required" });
        }
        // Generate a 6‑character identifier
        const shortId = nanoid(6);
        // Persist the mapping
        const newUrl = await Url.create({ originalUrl, shortId });
        // Build the full short URL based on the incoming request
        const host = req.get('host');
        const protocol = req.protocol;
        const shortUrl = `${protocol}://${host}/${shortId}`;
        // Respond with the document plus the ready‑to‑use short URL
        res.status(201).json({
            _id: newUrl._id,
            originalUrl: newUrl.originalUrl,
            shortId: newUrl.shortId,
            shortUrl,
            clicks: newUrl.clicks,
            createdAt: newUrl.createdAt,
            updatedAt: newUrl.updatedAt
        });
    } catch (err) {
        console.error("URL creation failed:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Redirect a short URL to its original destination.
 * Expects `shortId` as a URL parameter.
 */
const redirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ message: "short url not found" });
        }
        url.clicks++;
        await url.save();
        res.redirect(url.originalUrl);
    } catch (err) {
        console.error("Redirect failed:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { shortenUrl, redirectUrl };