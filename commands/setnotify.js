let {
    Client,
    CommandInteraction,
    ApplicationCommandOptionType,
} = require("discord.js");
let setchannel = require("../Schema/Channel.js");
module.exports = {
    name: 'setnotify',
    description: "Settings Notify Channel Testimoni and Auto Stock",
    accessableby: "admin",
    options: [
        {
            name: "testimoni",
            description: "Set Channel For Testimoni",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let data1 = interaction.options.getChannel("testimoni");
        let ChanelID = interaction.guild.channels.cache.get(data1.id);
        if (!ChanelID.viewable) return interaction.reply({ content: `*The provided channel is not visible to me! ❌*`, ephemeral: true}).catch((err) => console.error(err));
        await setchannel.findOneAndUpdate({}, { $set: { ChanelTesti: ChanelID } }, { upsert: true, new: true })
            .then(async (res) => {
                await interaction.reply({ content:`*Successffully Set Chanel Testimoni To **${data1} ✅***`, ephemeral: true}).catch((err) => console.error(err));
            })
            .catch((e) => console.error(e));
    }
}