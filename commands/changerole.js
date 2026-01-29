let {
    EmbedBuilder,
    Client,
    CommandInteraction,
    ChannelType,
    AttachmentBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ApplicationCommandOptionType,
} = require("discord.js");
let list = require("../Schema/list.js");
module.exports = {
    name: 'changerole',
    description: "Change Role Of Product",
    accessableby: "admin",
    options: [
        {
            name: "product_id",
            description: "Id Of Product",
            type: ApplicationCommandOptionType.Number,
            required: true,
            autocomplete: true
        },
        {
            name: "role",
            description: "Tag Role For Change Role",
            type: ApplicationCommandOptionType.Role,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let product_id = interaction.options.getNumber("product_id");
        let productRoles = interaction.options.getRole("role");
        let productRole = productRoles.id;
        let guild = client.guilds.cache.get(interaction.guild.id);
        await list.findOneAndUpdate({ product_id: product_id }, { $set: { role: productRole }})
            .then(async (d) => {
                let role = guild.roles.cache.get(getCode.role);
                await interaction.reply({ content: `*Role has been Changed **${role}** To **${productRoles} ✅***`, ephemeral: true }).catch((err) => console.error(err));
            })
            .catch(console.error);
    }
}