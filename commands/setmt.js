let {
    Client,
    CommandInteraction,
} = require("discord.js");
let mt = require("../Schema/mt.js");
module.exports = {
    name: 'setmt',
    description: "Setting to maintenance",
    accessableby: "admin",
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        await mt.findOne({})
            .then(async (d) => {
                if (d) {
                    d.mt = !d?.mt;
                    await d
                        .save()
                        .then(async (d1) => {
                            await interaction.reply({ content:`${d?.mt ? `*Bot Maintenance ❌*` : `*Done Maintenance ✅*`}`, ephemeral: true }).catch((err) => console.error(err));
                        })
                        .catch(console.error);
                } else {
                    await new mt({ mt: !d?.mt })
                        .save()
                        .then(async (d) => {
                            await interaction.reply({ content:`${d?.mt ? `*Bot Maintenance ❌*` : `*Done Maintenance ✅*`}`, ephemeral: true }).catch((err) => console.error(err));
                        })
                        .catch(console.error);
                }
            })
            .catch(console.error);
    }
}