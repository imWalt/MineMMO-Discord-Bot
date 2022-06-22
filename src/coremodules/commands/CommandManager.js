const PS = require("pubsub-js");
module.exports = {
    async load() {
        PS.subscribe("discord.guildCreate", (ps, guild) => {
            guild.commands.create({
                "name": "poll",
                "description": "Create a poll!",
                "options": [{
                    "type": 3,
                    "name": "poll_question",
                    "description": "Question for you poll!",
                    "required": true
                }, {
                    "type": 3,
                    "name": "poll_description",
                    "description": "Description for you poll!",
                    "required": false
                }, {
                    "type": 3,
                    "name": "option_a",
                    "description": "Name for option 1 (Provide an emoji in front!)",
                    "required": false
                }, {
                    "type": 3,
                    "name": "option_b",
                    "description": "Name for option 2 (Provide an emoji in front!)",
                    "required": false
                }, {
                    "type": 3,
                    "name": "option_c",
                    "description": "Name for option 3 (Provide an emoji in front!)",
                    "required": false
                }, {
                    "type": 3,
                    "name": "option_d",
                    "description": "Name for option 4 (Provide an emoji in front!)",
                    "required": false
                },{
                    "type": 3,
                    "name": "option_e",
                    "description": "Name for option 5 (Provide an emoji in front!)",
                    "required": false
                }]
            });
        })
        PS.subscribe("discord.commandCreate", (ps, commandInteraction) => {
            switch(commandInteraction.commandName) {
                case "poll": {
                    if(commandInteraction.memberPermissions.toArray().includes("ADMINISTRATOR")) { 
                        PS.publish("discord-commandCreate-poll", commandInteraction);
                    } else {
                        commandInteraction.reply({
                            ephemeral: true,
                            content: "**You need the permission `ADMINISTRATOR` to execute this command!**"
                        })
                    }
                    break;
                } default: {

                }
            }
        })
        console.log("[CMD] CMD loaded!");
    }
}