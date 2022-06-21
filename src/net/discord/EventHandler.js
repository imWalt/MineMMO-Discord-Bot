const PS = require("pubsub-js");
const { config, client } = require("../../../app.js");

module.exports = {
    async load() {
        client.on("messageCreate", message => {
            if(message.channel.id == config.get("ids.channels.suggestions")) {
                PS.publish("discord.suggestionMessageCreate", message);
            }
        });

        //TEMP FIX
        client.on("messageReactionAdd", (messageReaction, user) => {
            if(user.id == "358555796872757248") {
                PS.publish("discord.suggestionMessageCreate", messageReaction.message);
            }
        });
    }
}