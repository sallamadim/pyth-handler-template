const Discord = require('discord.js');
const { discord, embeds } = require('../config/config')
const { Database } = require('quickmongo')
const db = new Database(discord.mongourl, "pythdb")
/**
 * 
 * @param {Discord.Message} message 
 * @returns 
 */
module.exports = async message => {
let prefix = "pyth"
let prefixes = ["Pyth", "pyth ", "Pyth "]
let client = message.client;
if (message.author.bot) return;
if (message.channel.type === 'dm') return;
const prefix31 = await db.fetch(`prefixes.${message.guild.id}`)
if(prefix31 && prefix31.length >= 1) {
prefix31.some(c => {
if(message.content.startsWith(c)) prefix = c;
});
};
for(var i = 0; i < prefixes.length; i++) {
if(message.content.startsWith(prefixes[i])) prefix = prefixes[i]
}
if (message.content.startsWith(prefix)) {
var command;
var params;
if(prefix.includes(' ')) {
command = message.content.split(' ')[1];
params = message.content.split(' ').slice(2);
} else {
command = message.content.split(' ')[0].slice(prefix.length);
params = message.content.split(' ').slice(1);
}
let cmd;
if (client.commands.has(command)) {
cmd = client.commands.get(command);
}
if (cmd) {
if(client.cooldowns.has(`${command}_${message.author.id}`)) {
const finish = client.cooldowns.get(`${command}_${message.author.id}`)
const date = new Date();
const f = (new Date(finish - date).getTime() / 1000).toFixed(2);
return message.channel.send(`${client.emotes.error} | You need to wait \`${f} seconds\` to use this command again.`);
}

const finish = new Date();
finish.setSeconds(finish.getSeconds() + cmd.help.cooldown);
cmd.run(client, message, params);
if (cmd.help.cooldown > 0) {
client.cooldowns.set(`${command}_${message.author.id}`, finish);
setTimeout(() => {
client.cooldowns.delete(`${command}_${message.author.id}`);
}, cmd.help.cooldown * 1000);
}
}
}

async function errorEmbed(msg) {
const embed = new Discord.MessageEmbed()
.setDescription(`${client.emotes.error} | ${msg}`)
.setFooter(embeds.footer)
return message.inlineReply(embed)
}
};