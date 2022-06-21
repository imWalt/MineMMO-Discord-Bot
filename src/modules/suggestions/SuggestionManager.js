const PS = require("pubsub-js");
const { config } = require("../../../app");

module.exports = {
    async load() {
        PS.subscribe("discord.suggestionMessageCreate", async (ps, message) => {
            await message.react(config.get("ids.emojis.stonks"));
            message.react(config.get("ids.emojis.not_stonks"));
        })
    }
}