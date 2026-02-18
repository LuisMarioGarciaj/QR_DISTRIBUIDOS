require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.7s87u.mongodb.net/guard_patrol?retryWrites=true&w=majority&appName=Cluster0");
        console.log("MongoDB Connected");

        const count = await User.countDocuments({});
        console.log("Total Users found via Mongoose:", count);

        // Also try to list them to be sure
        const users = await User.find({}, 'name role');
        console.log("Users:", users);

        // Check collection name usage
        console.log("Collection name being used:", User.collection.name);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
