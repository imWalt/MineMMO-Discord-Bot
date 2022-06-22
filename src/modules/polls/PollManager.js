const PS = require("pubsub-js");
const EMOJI_REGEX = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
module.exports = {
    async load() {
        PS.subscribe("discord-commandCreate-poll", async (ps, commandInteraction) => {
            let poll = new Poll(
                commandInteraction.options.get("poll_question").value,
                commandInteraction.options.get("poll_description")?.value,
                [
                    commandInteraction.options.get("option_a")?.value,
                    commandInteraction.options.get("option_b")?.value,
                    commandInteraction.options.get("option_c")?.value,
                    commandInteraction.options.get("option_d")?.value,
                    commandInteraction.options.get("option_e")?.value
                ].filter(e=>{return e!==undefined}),
                commandInteraction.channel
            );
            await poll.validate();
            if(!poll.isValid) {
                commandInteraction.reply({
                    ephemeral: true,
                    content: `**Poll \`${poll.question}\` has invalid options!** :crossed_swords:`
                })
                return;
            }
            await commandInteraction.reply({
                ephemeral: true,
                content: `**Poll \`${poll.question}\` is being created!** :hourglass:`
            })
            await poll.publish();
            await poll.react();
            commandInteraction.editReply({
                ephemeral: true,
                content: `**Poll \`${poll.question}\` was succesfully created!** :bar_chart:`
            });
        });
        console.log("[PLL] PLL loaded!");
    }
}
class Poll {
    constructor(question, description, options, channel) {
        this.question = question;
        this.description = description;
        this.options = options;
        this.channel = channel;
        this.isValid = true;
    }
    async validate() {
        this.guildEmojis = await this.channel.guild.emojis.fetch();
        this.guildEmojis = this.guildEmojis.entries();
        this.reactions = [];
        for(let option of this.options) {
            let reaction;
            reaction = option.match(EMOJI_REGEX)?.[0];
            for(let emoji of this.guildEmojis) {
                if(option.includes(emoji[1].toString())) reaction = emoji[1].toString();
            }
            if(reaction === undefined) {
                this.isValid = false
                return;
            } else {
                this.reactions.push(reaction);
            }
        }
    }
    async publish() {
        this.message = await this.channel.send({
            content: null,
            embeds: [{
                title: this.question,
                description: ((this.description === undefined) ? ("") : (this.description + "\n\n")) + "**" + this.options.join("**\n**") + "**",
                color: 16757808
            }]
        });
        return;
    }
    async react() {
        for(let reaction of this.reactions) {
            await this.message.react(reaction).catch(e=>console.log(e));
        }
    }
}