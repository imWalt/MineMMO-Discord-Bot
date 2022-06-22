const PS = require("pubsub-js");
const { config } = require("../../../app");

module.exports = {
    async load() {
        /*if(!config.exists(".sgt.positiveEmojiId") || !config.exists(".sgt.negativeEmojiId") || !config.exists(".sgt.suggestionsChannelId")) {
            console.error("[SGT] Not properly configurated! SGT not loaded!");
            return;
        }*/
        PS.subscribe("discord.suggestionMessageCreate", async (ps, message) => {
            await message.react(config.get("sgt.positiveEmojiId")).catch(e=>console.error(e));
            message.react(config.get("sgt.negativeEmojiId")).catch(e=>console.error(e));
        })
        console.log("[SGT] SGT loaded!");
    }
}