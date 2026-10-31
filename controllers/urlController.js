const { nanoid } = require('nanoid');
const Url = require('../models/Url');

const shortenUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ message: "OriginalUrl is required" });
        }

        const shortId = nanoid(6);
        const newUrl = await Url.create({ originalUrl, shortId });
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;

        return res.status(201).json({
            _id: newUrl._id,
            originalUrl: newUrl.originalUrl,
            shortId: newUrl.shortId,
            shortUrl,
            clicks: newUrl.clicks,
            createdAt: newUrl.createdAt
        });
    } catch (err) {
        console.error("URL creation failed:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const getOriginalUrl = async (req, res) => {
    try {
        const url = await Url.findOne({ shortId: req.params.shortId });
        if (!url) {
            return res.status(404).json({ message: "Short URL not found" });
        }
        return res.json({ originalUrl: url.originalUrl });
    } catch (err) {
        console.error("URL lookup failed:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

const redirectUrl = async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ message: "short url not found" });
        }
        url.clicks++;
        await url.save();
        return res.redirect(url.originalUrl);
    } catch (err) {
        console.error("Redirect failed:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { shortenUrl, getOriginalUrl, redirectUrl };
