let client = require('../../index.js');
let axios = require("axios");
let {
    ActivityType,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
} = require("discord.js");
let mt = require("../../Schema/mt.js");
let channelo = require("../../Schema/Channel.js");
let Bal = require("../../Schema/balance.js");
let { Money, RedFinger, Clock, imageUrl, COLOR, Watermark, Status, Online, Offline, Box } = require("../../config/configEmoji.json");
let { API_ID, API_KEY, SECRET_KEY } = require("../../config/configGrowTech.json");
let list = require('../../Schema/list.js');

module.exports = {
    name: "ready"
}

client.once("ready", async (client) => {
    try {
        let activities = [`type /help To See How To Buy`, `Using Slide Option To Order Product`], i = 0;
        let chanel = await channelo.findOne({}).catch((err) => console.error(err));
        let checkdelay = chanel?.Delay ? chanel?.Delay : "60";
        let delayleader = chanel?.DelayLeaderboard ? chanel?.DelayLeaderboard : "60";

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
            let response = await axios.post("https://growtechcentral.site/api/services",
                new URLSearchParams({
                    api_id: API_ID,
                    api_key: API_KEY,
                    secret_key: SECRET_KEY
                }),
                {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                }
            );
            let format = `<t:${Math.floor(new Date().getTime() / 1000)}:R>`;
            let MT = await mt.findOne({}).then((d) => { return d?.mt }).catch(console.error);
            let embed = new EmbedBuilder()
                .setTitle(`${RedFinger} RedFinger Cloud Phone ${RedFinger}`)
                .setColor(COLOR)
                .setThumbnail(`https://cdn.discordapp.com/attachments/1026011513296797728/1446890315641389107/unnamed.png?ex=6935a11d&is=69344f9d&hm=4433b75c7d0778fc7de82e18cbac03fa6fdfb9d7c7f0586f387b8965b6fff812&`)
                .setImage("https://cdn.discordapp.com/attachments/1026011513296797728/1447192743536361588/WALL_DECOR_4.png?ex=6936bac5&is=69356945&hm=c3476819934790463e18f2b33544e9274645e19e2e92768c792c1bb2d6bfc656&");
            let haveStock = 0;
            //console.log(response.data.response);
            if (response.data.response === true) {
                if (MT) {
                    await mt.findOneAndUpdate({}, { mt: false }, { upsert: true }).catch(console.error);
                }
                let products = Array.isArray(response.data.data) ? response.data.data : [];
                let activeProducts = products.filter(p => p.product_status === "Active" && p.sub_category === "RedFinger");
                //console.log(activeProducts);
                if (activeProducts.length > 0) {
                    for (let p of activeProducts) {
                        let sold = await list.findOne({ product_id: p.id }).catch(console.error);
                        let prices = sold?.product_price ? `Rp ${new Intl.NumberFormat().format(sold.product_price)}` : `Not Set`;
                        let solds = sold?.sold ? sold.sold : 0;
                        haveStock += Number(solds);
                        embed.addFields({
                            name: `\n\n${RedFinger} ${p.product_name}`,
                            value: `╰┈➤ *${Money} ${prices} | Stock: ${p.stock} | Terjual: ${solds}*`,
                            inline: false
                        });
                    }
                } else {
                    embed.setDescription("Tidak ada produk aktif saat ini.");
                }
            } else {
                await mt.findOneAndUpdate({}, { mt: true }, { upsert: true }).catch(console.error);
            }

            let row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Membeli Produk")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("🛒")
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

            let channelos = await channelo.findOne({}).catch((err) => console.error(err));
            let garis = `**------------------------------------------**`;
            if (channelos?.ChannelStock) {
                let channel = await client.channels.fetch(channelos?.ChannelStock);
                let messageid = await channel.messages.fetch(channelos?.MessageID);
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
            }
        }, checkdelay * 1000);

        setInterval(async () => {
            let Data = "";
            let format = `<t:${Math.floor(new Date().getTime() / 1000)}:R>`;
            let chanelas = await channelo.findOne({}).catch(console.error);
            await Bal.find({})
                .sort({ TotalBuying: -1 })
                .limit(5)
                .then(async (data) => {
                    data.forEach((d, index) => {
                        Data += `*${index + 1}. Discord User: **<@${d.DiscordID}>** ➤ Total Membeli: **${d.TotalBuying}** ${Box}***\n\n`;
                    });
                });

            let embed = new EmbedBuilder()
                .setTitle(`Leaderboard Top 5 Player`)
                .setDescription(`**Terakhir Update: ${format}**\n\n${Data}`)
                .setColor(COLOR)
                .setImage(imageUrl);

            if (chanel?.ChannelLeaderboard) {
                let channel = await client.channels.fetch(chanelas?.ChannelLeaderboard);
                let messageid = await channel.messages.fetch(chanelas?.MessagIDLeaderboard);
                await messageid.edit({ content: `**${Watermark}**`, embeds: [embed] }).catch((err) => console.error(err));
            }
        }, delayleader * 1000);

        console.log(`[BOT DISCORD]`.bgBlue.bold, `${client.user.tag} is up and ready to start.`.green.bold);
    } catch (err) {
        console.error(err);
    }
});