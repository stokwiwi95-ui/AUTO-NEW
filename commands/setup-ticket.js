let { Client, CommandInteraction, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
let ticket = require("../Schema/ticket.js");

module.exports = {
    name: 'setup-ticket',
    description: "Setup a ticket in your server",
    options: [
        {
            name: "category",
            description: "provide category where created ticket will be displayed",
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
        let data2 = interaction.options.getChannel("category");
        let category = interaction.guild.channels.cache.get(`${data2.id}`)
        
        if (category.type !== ChannelType.GuildCategory) return interaction.reply({
            content: "The category you provided is invalid ❌",
            ephemeral: true
        });
        
        if (!category.viewable) return interaction.reply({
            content: "The provided category is not visible to me ❌",
            ephemeral: true
        });
        
        if (!category.permissionsFor(client.user.id).has("ManageChannels")) return interaction.reply({
            content: "The bot is missing manage-channels permissions to create ticket channel ❌",
            ephemeral: true
        });
        
        await ticket.findOneAndUpdate(
            {},
            { $set: { category: data2.id } },
            { upsert: true, new: true }
        )
            .then(async (res) => {
                console.log(res);
                await interaction.reply({ content: `✅ Successffully setting the ticket to category ${data2}`, ephemeral: true });
            })
            .catch((e) => console.error(e));
    }
}