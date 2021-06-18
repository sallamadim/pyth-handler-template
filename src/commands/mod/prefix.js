const Discord = require('discord.js');
const { discord, embeds } = require('../../config/config')
const { Database } = require('quickmongo')
const db = new Database(discord.mongourl, "pythdb")
/**
 * 
 * @param {Discord.Client} client 
 * @param {Discord.Message} message 
 * @param {String[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
let argslar = ['add', 'remove', 'set', 'clear'];
if(!args[0] || !argslar.includes(args[0])) {
let prefixes = [`**1.** **\`your prefix\`**`];
const prefixler = await db.fetch(`prefixes.${message.guild.id}`);
if(prefixler && prefixler.length >= 1) {
var i = 1;
for(const key in prefixler) {
i++
prefixes.push(`**${i}.** **\`${prefixler[key]}\`**`)
};
};
const embed = new Discord.MessageEmbed()
.setTitle('There is my prefixes:')
.setDescription(prefixes.join('   \n       \n'))
.addField(`To add a prefix type:`, `pythprefix add <prefix>`, true)
.addField(`To remove a prefix type:`, `pythprefix remove <prefix>`, true)
.addField(`To clear prefixes type:`, `pythprefix clear`, true)
.setFooter(embeds.footer)
return message.inlineReply(embed);
};
if(args[0] === 'add') {
if(!args[1]) return message.inlineReply(`${client.emotes.error} | You need to provide a args to add a prefix.`)
if(args[1].startsWith('"') && args[args.length-1].endsWith('"')) {
let arg = args.slice(1).join(' ').slice(1, args.slice(1).join(' ').length-1);
const prefixler = await db.fetch(`prefixes.${message.guild.id}`);
if(prefixler && prefixler.some(a => a === arg)) return message.inlineReply(`${client.emotes.success} | The prefix: **${arg}** added.`);  
await db.push(`prefixes.${message.guild.id}`, arg);
return message.inlineReply(`${client.emotes.success} | The prefix: **${arg}** added.`);
};
if(args[2]) return message.inlineReply(`${client.emotes.error} | You've given too many prefixes. Either quote it or only do it one by one.`);
const prefixler = await db.fetch(`prefixes.${message.guild.id}`);
if(prefixler && prefixler.some(a => a === args[1])) return message.inlineReply(`${client.emotes.success} | The prefix: **${args[1]}** added.`);  
await db.push(`prefixes.${message.guild.id}`, args[1]);
return message.inlineReply(`${client.emotes.success} | The prefix: **${args[1]}** added.`);
};
if(args[0] === 'remove') {
if(!args[1]) return message.inlineReply(`${client.emotes.error} | You need to provide a prefix to remove.`)
if(args[1] == "pyth".toLowerCase()) return message.inlineReply(`${client.emotes.error} | You cannot remove the main prefix.`) 
if(args[1].startsWith('"') && args[args.length-1].endsWith('"')) {
let arg = args.slice(1).join(' ').slice(1, args.slice(1).join(' ').length-1);
const prefixler = await db.fetch(`prefixes.${message.guild.id}`);
if(prefixler && !prefixler.some(a => a === arg)) return message.inlineReply(`${client.emotes.error} | I do not have this prefix registered.`);  
await db.set(`prefixes.${message.guild.id}`, prefixler.filter(a => a !== arg));
return message.inlineReply(`${client.emotes.success} | The prefix: **${arg}** removed.`);
};
if(args[2]) return message.inlineReply(`${client.emotes.error} | You've given too many prefixes. Either quote it or only do it one by one.`);
const prefixler = await db.fetch(`prefixes.${message.guild.id}`);
if(prefixler && !prefixler.some(a => a === args[1])) return message.inlineReply(`${client.emotes.error} | I do not have this prefix registered.`);  
await db.set(`prefixes.${message.guild.id}`, prefixler.filter(a => a !== args[1]));
return message.inlineReply(`${client.emotes.success} | The prefix: **${args[1]}** removed.`);
};
if(args[0] === 'clear') {
await db.delete(`prefixes.${message.guild.id}`);
return message.inlineReply('ALL prefixes removed.');
};
};
exports.help = {
name: 'prefix',
description: "You can add a prefix to a database or you can remove it.\nYou can clear all prefixes from database.",
usage: "pyth prefix add/remove/clear",
category: "Moderation",
cooldown: 5
};