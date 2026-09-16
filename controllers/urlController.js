const { nanoid} = require('nanoid');
const Url = require('../models/Url');

const shortenUrl = async (req, res) => {
    try{
        const {originalUrl} = req.body;
        if(! originalUrl){
            return res.status(400).json({ message: "OriginalUrl is required"});
        }
        const shortId = nanoid(6);
        const newUrl = await Url.create({ originalUrl,shortId});
        res.status(201).json(newUrl);
    }catch(err){
        console.error("URL creation failed:", err);
        res.status(500).json({ message: "Server error"});
    }
};

const redirectUrl = async(req,res) => {
    try{
        const {shortId} = req.params;
        const url = await Url.findOne({shortId});
        if(!url){
            return res.status(404).json({ message: "short url not found"});
        }
        url.clicks++;
        await url.save();
        res.redirect(url.originalUrl);
    }catch(err){
        res.status(500).json({ message: "Sever error"});
    }
};

module.exports = { shortenUrl, redirectUrl};