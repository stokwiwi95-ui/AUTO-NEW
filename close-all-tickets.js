const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const config = require("./config/config.json");
const ticket = require("./Schema/ticket.js");
const mongoose = require("mongoose");

async function closeAllTickets() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MongoURL);
        console.log("✅ MongoDB connected\n");

        const client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });

        client.on("ready", async () => {
            console.log(`✅ Bot logged in as ${client.user.tag}\n`);

            try {
                // Get ticket config
                const ticketConfig = await ticket.findOne({});
                if (!ticketConfig || !ticketConfig.category) {
                    console.error("❌ Ticket belum di-setup!");
                    process.exit(1);
                }

                const categoryId = ticketConfig.category;
                const guild = client.guilds.cache.first();

                if (!guild) {
                    console.error("❌ Bot tidak ada dalam server apapun!");
                    process.exit(1);
                }

                // Get the ticket category
                const ticketCategory = guild.channels.cache.get(categoryId);
                if (!ticketCategory || ticketCategory.type !== ChannelType.GuildCategory) {
                    console.error("❌ Kategori ticket tidak ditemukan!");
                    process.exit(1);
                }

                console.log(`🔍 Mencari ticket yang terbuka di kategori: ${ticketCategory.name}\n`);

                // Get all channels in the ticket category
                const ticketChannels = guild.channels.cache.filter(
                    (ch) => ch.parentId === categoryId && ch.type === ChannelType.GuildText
                );

                if (ticketChannels.size === 0) {
                    console.log("✅ Tidak ada ticket yang terbuka.\n");
                    process.exit(0);
                }

                console.log(`📋 Ditemukan ${ticketChannels.size} ticket yang akan ditutup:\n`);

                // Close (delete) all tickets
                let closedCount = 0;
                for (const [channelId, channel] of ticketChannels) {
                    try {
                        console.log(`   🔄 Menutup: ${channel.name}...`);
                        await channel.delete();
                        closedCount++;
                        console.log(`   ✅ ${channel.name} berhasil ditutup!`);
                    } catch (error) {
                        console.error(`   ❌ Error menutup ${channel.name}: ${error.message}`);
                    }
                }

                console.log(`\n✅ Selesai! ${closedCount} ticket berhasil ditutup.\n`);
                process.exit(0);

            } catch (error) {
                console.error("❌ Error:", error.message);
                process.exit(1);
            }
        });

        client.login(config.TOKEN);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

closeAllTickets();
