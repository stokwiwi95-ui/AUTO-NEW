const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const config = require("./config/config.json");
const mongoose = require("mongoose");

// Import ticket schema
let ticketSchema = require("./Schema/ticket.js");

async function setupTicket() {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.MongoURL);
        console.log("✅ MongoDB connected\n");

        // Create Discord client
        const client = new Client({
            intents: [GatewayIntentBits.Guilds],
        });

        client.on("ready", async () => {
            console.log(`✅ Bot logged in as ${client.user.tag}\n`);

            try {
                // Get first guild
                const guild = client.guilds.cache.first();
                if (!guild) {
                    console.error("❌ Bot tidak ada dalam server apapun!");
                    process.exit(1);
                }

                console.log(`🔧 Setting up untuk: ${guild.name}\n`);

                // Check if category exists
                let ticketCategory = guild.channels.cache.find(
                    (c) => c.type === ChannelType.GuildCategory && c.name === "🎫-tickets"
                );

                if (!ticketCategory) {
                    console.log("📁 Membuat category 🎫-tickets...");
                    ticketCategory = await guild.channels.create({
                        name: "🎫-tickets",
                        type: ChannelType.GuildCategory,
                        permissionOverwrites: [
                            {
                                id: guild.id,
                                deny: ["ViewChannel"],
                            },
                        ],
                    });
                    console.log(`✅ Category berhasil dibuat!\n`);
                } else {
                    console.log(`✅ Category sudah ada!\n`);
                }

                // Save to database
                await ticketSchema.findOneAndUpdate(
                    {},
                    { $set: { category: ticketCategory.id } },
                    { upsert: true, new: true }
                );

                console.log("✅ Konfigurasi tersimpan!\n");
                console.log("📊 Detail Setup Ticket:");
                console.log(`   Server: ${guild.name}`);
                console.log(`   Category: ${ticketCategory.name}`);
                console.log(`   Category ID: ${ticketCategory.id}\n`);

                console.log("🎫 Ticket system siap!\n");
                console.log("Sekarang bisa gunakan:");
                console.log("   /ticket_panel  → Tampilkan tombol create ticket\n");

                await client.destroy();
                process.exit(0);

            } catch (error) {
                console.error("❌ Error:", error.message);
                await client.destroy();
                process.exit(1);
            }
        });

        client.login(config.TOKEN);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

setupTicket();
