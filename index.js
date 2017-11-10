const Discord = require('discord.js');
const client = new Discord.Client();
const music = require('./discord-music.js');

//This Function receives a http request from uptimerobot.com to keep the application running on glitch.com

const request = require('superagent');
var express = require('express');
var app = express();
app.get("/wake", function (request, response) {
  console.log('Your application has awaken!');
})

//Bot code starts here

client.on('ready', () => 
{
  console.log('I\' Running!');
  client.user.setPresence
	({
		game: 
		{
			name: 'Say $help', type: 0
		}
	});
});

client.on('message', message =>
{
  switch(message.content)
  {
    case '$clearchannel':
      if (message.member.hasPermission("MANAGE_MESSAGES"))
      {
        message.channel.fetchMessages({limit: 100})
          .then(function(list)
          {
            message.channel.bulkDelete(list);
            message.channel.send('Messages deleted successfully!');
          }, function(err){message.channel.send("Error.");})
      }
      else
      {
        message.reply('You are not authorized to use this!');
      }
      message.delete(60000);
      break;
    case '$summon':
      var channel = message.member.voiceChannel;
      var guild = message.guild.voiceConnection;
      if(guild != null)
        {
          if(channel.id != guild.channel.id)
            {
              message.reply('I\' already being used at another Voice Channel!');
              message.delete(60000);
            }
          else
            {
              return 0;
            }
        }
      else{
        channel.join()
        .then(connection => console.log('Connected!'))
        .catch(console.error);   
        message.reply('I just entered your voice channel!');
      }
      break;
    case '$disconnect':
      var channel = message.member.voiceChannel;
      channel.leave();
      break;
    case '$about':
      message.author.send("BadaloBot is a Discord bot that helps keep channels clean " +
                          "while also serving as a Music Bot. It deletes his and other bots " +
                          "messages, as well as the messages that invoked them, 1 minute after they were sent.");
      break;
    case '$help':
      message.author.send("```Commands:\n " +
				    "$help           : Shows this message.\n" + 
					  "$about          : About.\n" + 
				    "$clearchannel   : Clears the last 100 messages in a text channel (messages older than 2 weeks can not be deleted).\n" + 
				    "$play           : Plays music from the given name or URL.\n" + 
				    "$summon         : Summons the bot to your voice channel.\n" + 
				    "$disconnect     : Disconnect the bot from the voice channel it is in.\n" +
				    "$skip [number]  : Skip some number of songs. Will skip 1 song if a number is not specified." +
				    "$queue          : Display the current queue." +
				    "$pause          : Pauses music playback (requires music manager)." + 
				    "$resume       	 : Resumes music playback (requires music manager)." +
				    "$volume [number]: Adjust the playback volume between 1 and 200 (requires music manager)." +
				    "$clearqueue     : Clears the song queue. Can also be used with \"$clear\"" +
				    "$leave          : Clears the song queue and leaves the channel." + 
				    "```");
      message.delete(60000);
      break;
    default:
      break;
  }
  if(message.channel.type != 'dm' && message.author.bot || message.content.startsWith("$") || message.content.startsWith("!") || message.content.startsWith(";") || message.content.startsWith(";;") || message.content.startsWith(".") || message.content.startsWith(">"))
    {
      message.delete(60000);
    }
});

// Music Function from Discord.js-Music
music(client, {
	prefix: '$',     // Prefix of '-'.
	global: false,   // False = Server-specific queues. True = Global shared queue.
	maxQueueSize: 20, // Maximum queue size of 20.
	clearInvoker: true, // If permissions applicable, allow the bot to delete the messages that invoke it (start with prefix)
	anyoneCanSkip: true // If anyoneCanSkip is false then only admins and the user that requested the song can skip it.
});

client.login(process.env.SECRET); // Bot Token. More info at the .env file.
