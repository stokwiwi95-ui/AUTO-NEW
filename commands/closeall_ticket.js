let {
    Client,
    CommandInteraction,
    EmbedBuilder,
    ChannelType,
} = require("discord.js");
let ticket = require("../Schema/ticket.js");
let { COLOR, imageUrl, RedFinger } = require("../config/configEmoji.json");

module.exports = {
    name: 'closeall_ticket',
    description: "Close all open ticket channels",
    accessableby: "admin",
    /**
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     */
    run: async (client, interaction) => {
        try {
            await interaction.deferReply({ ephemeral: true });

            // Get ticket config
            const ticketConfig = await ticket.findOne({});
            if (!ticketConfig || !ticketConfig.category) {
                return await interaction.editReply({
                    content: "❌ Ticket belum di-setup. Hubungi admin!",
                    ephemeral: true
                });
            }

            const categoryId = ticketConfig.category;
            const guild = interaction.guild;

            // Get the ticket category
            const ticketCategory = guild.channels.cache.get(categoryId);
            if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
                return await interaction.editReply({
                    content: "❌ Kategori ticket tidak ditemukan!",
                    ephemeral: true
                });
            }

            // Get all open ticket channels
            const ticketChannels = guild.channels.cache.filter(
                (ch) => ch.parentId === categoryId && ch.type === ChannelType.GuildText
            );

            if (ticketChannels.size === 0) {
                return await interaction.editReply({
                    content: "✅ Tidak ada ticket yang terbuka.",
                    ephemeral: true
                });
            }

            // Close all tickets
            let closedCount = 0;
            const closedTickets = [];

            for (const [channelId, channel] of ticketChannels) {
                try {
                    closedTickets.push(channel.name);
                    await channel.delete();
                    closedCount++;
                } catch (error) {
                    console.error(`Error closing ${channel.name}:`, error);
                }
            }

            // Create success embed
            const embed = new EmbedBuilder()
                .setTitle(`${RedFinger} CLOSE ALL TICKETS ${RedFinger}`)
                .setColor(COLOR)
                .setImage(imageUrl)
                .addFields(
                    {
                        name: "📊 Summary",
                        value: `Total Ticket Ditutup: **${closedCount}**`,
                        inline: false
                    },
                    {
                        name: "📋 Ticket yang Ditutup",
                        value: closedTickets.length > 0 ? closedTickets.map((t) => `• ${t}`).join("\n") : "Tidak ada",
                        inline: false
                    }
                )
                .setTimestamp();

            await interaction.editReply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (error) {
            console.error("Error closing all tickets:", error);
            await interaction.editReply({
                content: `❌ Error: ${error.message}`,
                ephemeral: true
            });
        }
    }
};
