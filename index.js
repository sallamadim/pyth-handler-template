const Discord = require('discord.js')
const client = new Discord.Client({partials:['MESSAGE','REACTION']})
const fs = require('fs')
const config = require('./src/config/config')
require('./src/config/inline')
const mongoose = require('mongoose')
const { Database } = require('quickmongo')
const db = new Database(config.discord.mongourl, "pythdb")
mongoose.connect(config.discord.mongourl, {
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false
})
db.on("ready", async() => {
console.log("Quickmongo connected to the database.")
})
mongoose.connection.on("connected", () => {
console.log("Mongoose connected to the database.")
})
client.discord = config.discord //client.discord.token or other yes
client.emotes = config.emojis //client.emotes.error
client.embed = config.embeds //client.embed.footer 
client.cooldowns = new Discord.Collection()
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
require('./src/events/eventLoader')(client)
fs.readdir("./src/commands/", (err, files) => {
if (err) console.error(err)
files.forEach(f => {
fs.readdir(`./src/commands/${f}/`, (err, filess) => {
if (err) console.error(err)
console.log(`[COMMAND LOADER]: Loaded ${filess.length} command in ${f} category.`)
filess.forEach(fs => {
if(!fs.endsWith(".js")) return
let props = require(`./src/commands/${f}/${fs}`)
client.commands.set(props.help.name, props)
})
})
})
})
client.on("ready", async() => {
console.log("Pyth ready to launch.")
})
client.login(client.discord.token)