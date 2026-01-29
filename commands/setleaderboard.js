let {
    ActivityType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageEmbed,
    ApplicationCommandOptionType,
    ButtonBuilder,
} = require("discord.js");
let channelo = require("../Schema/Channel.js");
let Bal = require("../Schema/balance.js");
let { imageUrl, COLOR, Watermark, Box } = require("../config/configEmoji.json");

module.exports = {
    name: 'setleaderboard',
    description: "Sending Realtime Leaderboard",
    accessableby: "admin",
    options: [
        {
            name: "channel",
            description: "Select Your Server To Send Realtime!",
            type: ApplicationCommandOptionType.Channel,
            required: true
        },
        {
            name: "delay",
            description: "Delay For Seconds/Detik",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let delay = interaction.options.getNumber("delay");
        let channel = interaction.options.getChannel("channel");
        let ChanelID = interaction.guild.channels.cache.get(`${channel.id}`);
        if (!ChanelID.viewable) return interaction.reply({ content: `*The provided channel is not visible to me! ❌*`, ephemeral: true }).catch((err) => console.error(err));
        if (delay < 30 || delay > 120) return interaction.reply({ content: `*Minimum Delay For Realtime Is 30 Seconds And Max Delay 120 Seconds/2 Minutes ❌*`, ephemeral: true }).catch((err) => console.error(err));
        let chanel = await channelo.findOne({})
            .then((d) => {
                return d?.ChannelLeaderboard;
            })
            .catch(console.error());
        await interaction.reply({ content: `*Started Editing The Realtime Leaderboard Delay **${delay}s ✅***`, ephemeral: true }).catch((err) => console.error(err));
        let sat = await channel.send({ content: `*Started Editing The Realtime Learderboard Delay **${delay}s ✅***`}).catch((err) => console.error(err));
        await channelo.findOneAndUpdate({}, { $set: { ChannelLeaderboard: ChanelID, MessagIDLeaderboard: sat.id, DelayLeaderboard: delay }}, { upsert: true, new: true }).catch((err) => console.error(err));

        try {
            if (!chanel) {
                setInterval(async () => {
                    let Data = "";
                    let format = `<t:${Math.floor(new Date().getTime() / 1000)}:R>`;
                    
                    await Bal.find({})
                        .sort({ TotalBuying: -1 })
                        .limit(5)
                        .then(async (data) => {
                            data.forEach((d, index) => {
                                Data += `*${index + 1}. Discord User: **<@${d.DiscordID}>** => Buying: **${d.TotalBuying}** ${Box}***\n\n`;
                            });
                        });

                    let embed = new EmbedBuilder()
                        .setTitle(`Leaderboard Top 5 Player`)
                        .setDescription(`**Last Update: ${format}**\n${Data}`)
                        .setColor(COLOR)
                        .setImage(imageUrl);

                    await sat.edit({ content: `**${Watermark}**`, embeds: [embed]}).catch((err) => console.error(err));
                }, delay * 1000);
            }
        } catch (err) {
            console.error(err);
        }
    }
}