const mongoose = require("mongoose");
const connectDB = async () => {
    try {
        console.log("URI:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db connection successful");
    }catch (err){
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}
module.exports = connectDB;