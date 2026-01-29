let mongoose = require("mongoose");
let { MongoURL, TOKEN } = require("../config/config.json");
let connectDB = async (client) => {
    await mongoose
        .connect(MongoURL)
        .then(async (res) => {
            console.log(`[DATABASE MONGO DB]`.bgCyan.bold, `${res.connection.host}`.green.bold);
            client.login(TOKEN);
        })
        .catch((err) => {
            console.log(`[SYSTEM ERROR]`.bgRed.bold, `Already Error In MongoDB!\n${err}`.red);
            process.exit(1);
        });
};

module.exports = connectDB;