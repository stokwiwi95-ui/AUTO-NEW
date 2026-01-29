let { GatewayIntentBits, Client, Collection } = require("discord.js");
let IncludedIntents = Object.entries(GatewayIntentBits).reduce((t, [, V]) => t | V, 0);
let client = new Client({ intents: IncludedIntents });
let color = require('colors');

client.startTime = Date.now()
client.events = new Collection()
client.slash = new Collection()
module.exports = client;

["mongoosee", "event", "slash"].forEach((file) => {
    require(`./handlers/${file}`)(client);
});

process.on("unhandledRejection", async (err) => {
    console.log(`[SYSTEM ERROR]`.bgRed.bold, `Unhandled Rejection : \n${err.stack}`.red.bold);
})