const PS = require("pubsub-js");
const { config } = require("../../../app");

module.exports = {
    async load() {
        /*if(!config.exists(".jin.joinMessageChannelId")) {
            console.error("[JIN] No Join Message Channel specified in config! JIN not loaded!");
            return;
        } else if(!config.exists(".jin.joinMessages")) {
            console.error("[JIN] No Join Messages specified in config! JIN not loaded!");
            return;
        } else if(config.get("jin.joinMessages").length == 0) {
            console.error("[JIN] No Join Messages specified in config! JIN not loaded!");
            return;
        }*/
        const joinMessages = config.get("jin.joinMessages");
        PS.subscribe("discord.guildMemberAdd", async (ps, member) => {
            member.guild.channels.fetch(config.get("jin.joinMessageChannelId")).then(channel => {
                channel.send(joinMessages[Math.floor(Math.random() * joinMessages.length)].replace("%member%", member));
            });
        })
        console.log("[JIN] JIN loaded!");
    }
}