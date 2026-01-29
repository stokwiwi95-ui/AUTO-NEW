let client = require('../index.js');
let { CLIENTID, TOKEN } = require("../config/config.json");
let { REST, Routes } = require('discord.js');
let fs = require('fs');

module.exports = async () => {
    let slash = [];
    let commands = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
    for (let file of commands) {
        let pull = require(`../commands/${file}`);
        if (pull.name) {
            slash.push(pull)
            client.slash.set(pull.name, pull);
        } else {
            console.log(`[SYSTEM EVENTS]`.bgYellow.bold, `Couldn't load the file ${file}, missing name or aliases`.bgRed.bold);
            continue;
        }
    };
    let rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationCommands(CLIENTID), { body: slash })
        .then(() => {
            console.log(`[SYSTEMS SLASH]`.bgMagenta.bold, `All Commands already registered in your server!`.green.bold);
        })
        .catch((err) => console.error(err));
}