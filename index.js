const Discord = require('discord.js')
const client = new Discord.Client()
let prefix = "m!"
client.login('NzExNjc4MDk3NDQ2OTI4NDQ2.XsGf5w.I7PNMkoIkzIegGvublCTkGPnTXo')

client.on('ready', () => {
    client.user.setGame('m!help')
    client.user.setStatus('online')
});

client.on('message', function(message) {
    if (message.content === "mo mo") {
        message.channel.sendMessage('MOTUS !')
    }
});

//Modération
//mute
client.on("message", async message => {
  if (message.content.startsWith(prefix + "mute")) {
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas les droits pour muter un utilisateur !");
    let toMute = message.guild.member(message.mentions.users.first());
    if(!toMute) return message.channel.send("Merci d'entrer un utilisateur !");
    let role = message.guild.roles.find(r => r.name === "muted");
    if(!role){
      try {
        role = await message.guild.createRole({
          name: "MUTE",
          color:"#000000",
          permissions:[]
        });
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      } catch (e) {
        console.log(e.stack)
      }
    }
    if(toMute.roles.has(role.id)) return message.channel.send('Cet utilisateur est déjà muté !')
    await(toMute.addRole(role));
    message.channel.send("Je l'ai muté !");
    return;
  }
});

//unmute
client.on("message", async message => {

  if (message.content.startsWith(prefix + "unmute")) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas les droits pour muter un utilisateur !");

        let tounmute = message.guild.member(message.mentions.users.first());
        if(!tounmute) return message.channel.send("Merci d'entrer un utilisateur !");
    let role = message.guild.roles.find(r => r.name === "MUTE");
            if(tounmute.roles.has(role.id)) return tounmute.removeRole(role);
                message.channel.send("Je l'ai démuté !");
            }
        });

//kick 
client.on('message', message => {
  if (message.content.startsWith(prefix + 'kick')) {
  if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande")
    const member = message.mentions.members.first()

    if (!member) {
      return message.reply(
        `Il faut que je kick qui ?`
      )
    }

    if (!member.kickable) {
      return message.reply(`Vous ne pouvez pas kick cette utilisateur`)
    }

    return member
      .kick()
      .then(() => message.reply(`${member.user.tag} a été kick.`))
      .catch(error => message.reply(`Une érreure c'est produite.`))
  }
});

//ban
client.on('message', function (message) {
    if (!message.guild) return
    let args = message.content.trim().split(/ +/g)

    if (args[0].toLocaleLowerCase() === prefix + 'ban') {
       if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ;(")
       let member = message.mentions.members.first()
       if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
       if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur :x:")
       if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur :sunglass:")
       message.guild.ban(member, {days: 7})
       message.channel.send('**' + member.user.username + '** a été banni :white_check_mark:')
    }
});
