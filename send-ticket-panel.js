const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("./config/config.json");
const { COLOR, imageUrl, RedFinger } = require("./config/configEmoji.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
    ],
});

client.on("ready", async () => {
    console.log(`✅ Bot logged in as ${client.user.tag}`);
    
    try {
        const channelId = "1455805734934548481";
        const channel = await client.channels.fetch(channelId);

        if (!channel) {
            console.error("❌ Channel tidak ditemukan!");
            process.exit(1);
        }

        // Buat embed untuk ticket panel
        const embed = new EmbedBuilder()
            .setTitle(`WELCOME TO FAZZRI STORE`)
            .setDescription("Klik tombol di bawah untuk membuat ticket support")
            .setColor(COLOR)
            .setImage(imageUrl)
            .addFields(
                {
                    name: "📝 Cara Membuat Ticket",
                    value: "1. Klik tombol **Create Ticket** di bawah\n2. Sistem akan membuat channel private untuk Anda\n3. Jelaskan masalah Anda kepada admin\n4. Admin akan membantu menyelesaikan masalah Anda",
                    inline: false
                },
                {
                    name: "⏱️ Response Time",
                    value: "Admin akan merespon dalam 1x24 jam",
                    inline: false
                }
            )
            .setTimestamp();

        // Buat button
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("create_ticket")
                .setLabel("📮 Create Ticket")
                .setStyle(ButtonStyle.Primary)
        );

        // Send message
        await channel.send({
            embeds: [embed],
            components: [row],
        });

        console.log(`✅ Ticket panel berhasil dikirim ke channel!`);
        process.exit(0);

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
});

client.login(config.TOKEN);
