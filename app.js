// node modules
// live config
const JsonDB = require("node-json-db").JsonDB; const JsonDBConfig = require("node-json-db/dist/lib/JsonDBConfig").Config;
// discord api
const { Client, Intents } = require("discord.js");
// pubsub
const PS = require("pubsub-js");

async function start() {
    // live config
    let config = new JsonDB(new JsonDBConfig("./src/config.json", true, true, '.'));
    config.get = (path) => config.getData(`.${path}`);
    exports.config = config;
    // discord client login
    const client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS
        ],
        partials: [
            "MESSAGE",
            "REACTION"
        ],
        retryLimit: Infinity,
        presence: {
            status: "online",
            activities: [{name: "over MineMMO", type: "WATCHING"}]
        }
    });
    client.login(config.get("bot.token"));
    await new Promise(r => {client.once("ready", r())});
    exports.client = client;
    console.log("Client ready!");
    // load connections
    const DiscordEventHandler = require("./src/net/discord/EventHandler.js"); await DiscordEventHandler.load();
    // load core modules
    // load modules
    const SuggestionManager = require("./src/modules/suggestions/SuggestionManager.js"); await SuggestionManager.load();
}
start();