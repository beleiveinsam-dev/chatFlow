import mongoose from "mongoose";

// Function to connect to mongoDB

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}`
        );

        console.log(
            `DB connected | DB host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("Error connecting to DB: ", error.message);
        process.exit(1);
    }
};

export default connectDB;
