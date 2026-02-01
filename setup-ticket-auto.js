const { Client, GatewayIntentBits, ChannelType } = require("discord.js");
const config = require("./config/config.json");
const ticket = require("./Schema/ticket.js");
const mongoose = require("mongoose");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
});

client.on("ready", async () => {
    console.log(`✅ Bot logged in as ${client.user.tag}\n`);

    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongourl);
        console.log("✅ MongoDB connected\n");

        // Get the guild (server)
        const guild = client.guilds.cache.first();
        if (!guild) {
            console.error("❌ Bot tidak ada dalam server apapun!");
            process.exit(1);
        }

        console.log(`🔧 Setting up ticket system untuk server: ${guild.name}\n`);

        // Check if ticket category already exists
        let ticketCategory = guild.channels.cache.find(
            (c) => c.type === ChannelType.GuildCategory && c.name === "🎫 TICKETS"
        );

        if (!ticketCategory) {
            console.log("📁 Membuat category 'TICKETS'...");
            ticketCategory = await guild.channels.create({
                name: "🎫 TICKETS",
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ["ViewChannel"],
                    },
                ],
            });
            console.log(`✅ Category berhasil dibuat: ${ticketCategory.name}\n`);
        } else {
            console.log(`✅ Category sudah ada: ${ticketCategory.name}\n`);
        }

        // Update MongoDB with ticket configuration
        await ticket.findOneAndUpdate(
            {},
            { $set: { category: ticketCategory.id } },
            { upsert: true, new: true }
        );

        console.log("✅ Konfigurasi ticket berhasil disimpan ke database\n");
        console.log("📊 Detail Setup:");
        console.log(`   - Guild: ${guild.name}`);
        console.log(`   - Category ID: ${ticketCategory.id}`);
        console.log(`   - Category Name: ${ticketCategory.name}\n`);

        console.log("🚀 Ticket system siap digunakan!");
        console.log("   Gunakan /ticket_panel untuk menampilkan tombol create ticket\n");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
});

client.login(config.TOKEN);
