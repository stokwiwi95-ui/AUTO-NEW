let fs = require('fs');

module.exports = (client) => {
    try {
        fs.readdirSync('./events/').forEach(dir => {
            let commands = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
            for (let file of commands) {
                let pull = require(`../events/${dir}/${file}`);
                if (pull.name) {
                    client.events.set(pull.name, pull);
                } else {
                    console.log("\n" + "----------------------------------------".red)
                    console.log(`[SYSTEMS EVENTS]`.bgYellow.bold, `Couldn't load the file ${file}, missing name or aliases`.bgRed.bold)
                    console.log("----------------------------------------".red)
                    continue;
                }
            }
        })
    } catch (error) {
        console.error(error);
    }
}