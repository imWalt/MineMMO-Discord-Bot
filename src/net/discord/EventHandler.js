const PS = require("pubsub-js");
const { config, client } = require("../../../app");
module.exports = {
    async load() {
        client.on("messageCreate", message => {
            if(message.channel.id == config.get("sgt.suggestionsChannelId")) {
                PS.publish("discord.suggestionMessageCreate", message);
            }
        });
        client.on("guildMemberAdd", member => {
            PS.publish("discord.guildMemberAdd", member);
        });
        client.on("guildCreate", guild => {
            PS.publish("discord.guildCreate", guild);
        });
        client.on("interactionCreate", interaction => {
            if(interaction.type == "APPLICATION_COMMAND") {
                PS.publish("discord.commandCreate", interaction);
            }
        })
    }
}