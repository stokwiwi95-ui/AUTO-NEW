let {
    ActivityType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    MessageEmbed,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ApplicationCommandOptionType
} = require("discord.js");
let channelo = require("../Schema/Channel.js");
let axios = require("axios");
let mt = require("../Schema/mt.js");
let list = require("../Schema/list.js");
let { RedFinger, Status, Box, Clock, Money, imageUrl, COLOR, Watermark } = require("../config/configEmoji.json");

module.exports = {
    name: 'run',
    description: "Sending Realtime Product!",
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
        let chanel = await channelo.findOne({}).catch(console.error());
        await interaction.reply({ content: `*Started Editing The Realtime Stock Delay **${delay}s ✅***`, ephemeral: true }).catch((err) => console.error(err));

        let embed = new EmbedBuilder()
            .setTitle(`${RedFinger} PRODUCT LIST ${RedFinger}`)
            .setDescription(`*Started Editing The Realtime Stock Delay **${delay}s ✅***`)
            .setColor(COLOR)
            .setImage(imageUrl);

        let messageid = await channel.send({ embeds: [embed] }).catch((err) => console.error(err));
        await channelo.findOneAndUpdate({}, { $set: { ChannelStock: ChanelID, MessageID: messageid.id, Delay: delay } }, { upsert: true, new: true }).catch((err) => console.error(err));
        try {
            if (!chanel?.ChannelStock) {
                let activities = [`type /help To See How To Buy`, `Using Slide Option To Order Product`], i = 0;
                async function fetchProductsAPI() {
                    try {
                        const response = await axios.post("https://growtechcentral.site/api/services",
                            new URLSearchParams({
                                api_id: API_ID,
                                api_key: API_KEY,
                                secret_key: SECRET_KEY
                            }),
                            {
                                headers: { "Content-Type": "application/x-www-form-urlencoded" }
                            }
                        );
                        return Array.isArray(response.data.data) ? response.data.data : [];
                    } catch (err) {
                        console.error("Error fetching API products:", err.message);
                        return [];
                    }
                }

                setInterval(async () => {
                    client.user.setPresence({
                        activities: [{ name: `${activities[i++ % activities.length]}`, type: ActivityType.Custom }],
                        status: "dnd",
                    });
                    let MT = await mt.findOne({}).then((d) => { return d?.mt }).catch(console.error);
                    let format = `<t:${Math.floor(new Date().getTime() / 1000)}:R>`;
                    let products = await fetchProductsAPI();
                    let embed = new EmbedBuilder()
                        .setTitle(`${RedFinger} Daftar Produk ${RedFinger}`)
                        .setColor(COLOR)
                        .setImage(imageUrl);

                    let activeProducts = products.filter(p => p.product_status === "Active" && (p.sub_category === "RedFinger"));
                    //console.log(activeProducts);
                    if (activeProducts.length > 0) {
                        for (let p of activeProducts) {
                            let sold = await list.findOne({ product_id: p.id }).catch(console.error);
                            let prices = sold?.product_price ? `Rp ${new Intl.NumberFormat().format(sold.product_price)}` : `Not Set`;
                            let solds = sold?.sold ? sold.sold : 0;
                            embed.addFields({
                                name: `${RedFinger} ${p.product_name}`,
                                value: `╰┈➤ *${Money} ${prices} | Stock: ${p.stock} | Terjual: ${solds}*`,
                                inline: false
                            });
                        }
                    } else {
                        embed.setDescription("Tidak ada produk aktif saat ini.");
                    }

                    let row = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("Membeli Produk")
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji("<:emoji_72:1210797404731740181>")
                            .setCustomId("buyang")
                    );

                    let rowmt = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setLabel("Membeli Produk")
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setEmoji("<:emoji_72:1210797404731740181>")
                            .setCustomId("buyang")
                    );

                    if (!MT) {
                        await messageid.edit({
                            content: `**${Watermark}**`,
                            embeds: [embed.setDescription(`${garis}\n***[${Clock}] Produk Update: ${format}***\n***[${Status}] Status: Online ${Online}***\n***[${Box}] Total Penjualan: ${haveStock}***\n${garis}`)],
                            components: [row]
                        }).catch((err) => console.error(err));
                    } else {
                        await messageid.edit({
                            content: `**${Watermark}**`,
                            embeds: [embed.setDescription(`${garis}\n***[${Clock}] Produk Update: ${format}***\n***[${Status}] Status: Maintanance ${Offline}***\n***[${Box}] Total Penjualan: ${haveStock}***\n${garis}`)],
                            components: [rowmt]
                        }).catch((err) => console.error(err));
                    }
                }, delay * 1000);
            }
        } catch (err) {
            console.error(err);
        }
    }
}