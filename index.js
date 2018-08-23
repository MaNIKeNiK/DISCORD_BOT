const Discord = require('discord.js');
const robot = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

const sql = require("sqlite");
sql.open("./sqlite/score.sqlite");

robot.login(config.token);

robot.on("ready", () => {
    console.log(`Bot has started.`); 
    robot.user.setActivity(`сасание писоса`);
  });

robot.on('message', (message) => {

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (message.author.bot) return; // Ignore bots.
    if (message.channel.type === "dm") return; // Ignore DM channels.

    //if (!message.content.startsWith(config.prefix) || message.author.bot) return;

   sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) {
      sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
    } else {
      let curLevel = Math.floor(0.1 * Math.sqrt(row.points + 1));
      if (curLevel > row.level) {
        row.level = curLevel;
        sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${message.author.id}`);
        message.reply(`Воу, воу да ты апнул свой лвл до **${curLevel}**! Ты хочешь стать новым Батиславом??`);
      }
      sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
       }
     }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, level INTEGER)").then(() => {
        sql.run("INSERT INTO scores (userId, points, level) VALUES (?, ?, ?)", [message.author.id, 1, 0]);
      });
     });

     if (!message.content.startsWith(config.prefix)) return;

     if (message.content.startsWith(config.prefix + "lvl")) {
      sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
        if (!row) return message.reply("Сейчас ты днищеброд с 0-лвлом");
        message.reply(`Твой текущий лвл ${row.level}`);
     });
     } else
     if (message.content.startsWith(config.prefix + "pts")) {
     sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
          if (!row) return message.reply("ты еще не преложил свои клешни к клавиатуре и у тебя нет птсов!");
          message.reply(`на твоем счету сейчас ${row.points} птсов, так держать! не останавливайся!`);
     });
    }

    const commands = {
        'play': (msg) => {
            if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
            if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
            if (queue[msg.guild.id].playing) return msg.channel.sendMessage('Already Playing');
            let dispatcher;
            queue[msg.guild.id].playing = true;
    
            console.log(queue);
            (function play(song) {
                console.log(song);
                if (song === undefined) return msg.channel.sendMessage('Queue is empty').then(() => {
                    queue[msg.guild.id].playing = false;
                    msg.member.voiceChannel.leave();
                });
                msg.channel.sendMessage(`Playing: **${song.title}** as requested by: **${song.requester}**`);
                dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : config.passes });
                let collector = msg.channel.createCollector(m => m);
                collector.on('message', m => {
                    if (m.content.startsWith(config.prefix + 'pause')) {
                        msg.channel.sendMessage('paused').then(() => {dispatcher.pause();});
                    } else if (m.content.startsWith(config.prefix + 'resume')){
                        msg.channel.sendMessage('resumed').then(() => {dispatcher.resume();});
                    } else if (m.content.startsWith(config.prefix + 'skip')){
                        msg.channel.sendMessage('skipped').then(() => {dispatcher.end();});
                    } else if (m.content.startsWith('volume+')){
                        if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                        dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
                        msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    } else if (m.content.startsWith('volume-')){
                        if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                        dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
                        msg.channel.sendMessage(`Volume: ${Math.round(dispatcher.volume*50)}%`);
                    } else if (m.content.startsWith(config.prefix + 'time')){
                        msg.channel.sendMessage(`time: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
                    }
                });
                dispatcher.on('end', () => {
                    collector.stop();
                    play(queue[msg.guild.id].songs.shift());
                });
                dispatcher.on('error', (err) => {
                    return msg.channel.sendMessage('error: ' + err).then(() => {
                        collector.stop();
                        play(queue[msg.guild.id].songs.shift());
                    });
                });
            })(queue[msg.guild.id].songs.shift());
        },
        'join': (msg) => {
            return new Promise((resolve, reject) => {
                const voiceChannel = msg.member.voiceChannel;
                if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('I couldn\'t connect to your voice channel...');
                voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
            });
        },
        'add': (msg) => {
            let url = msg.content.split(' ')[1];
            if (url == '' || url === undefined) return msg.channel.sendMessage(`You must add a YouTube video url, or id after ${config.prefix}add`);
            yt.getInfo(url, (err, info) => {
                if(err) return msg.channel.sendMessage('Invalid YouTube Link: ' + err);
                if (!queue.hasOwnProperty(msg.guild.id)) queue[msg.guild.id] = {}, queue[msg.guild.id].playing = false, queue[msg.guild.id].songs = [];
                queue[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
                msg.channel.sendMessage(`added **${info.title}** to the queue`);
            });
        },
        'queue': (msg) => {
            if (queue[msg.guild.id] === undefined) return msg.channel.sendMessage(`Add some songs to the queue first with ${config.prefix}add`);
            let tosend = [];
            queue[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
            msg.channel.sendMessage(`__**${msg.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
        },
        'help': (msg) => {
            let tosend = ['```xl', config.prefix + 'join : "Join Voice channel of msg sender"',	config.prefix + 'add : "Add a valid youtube link to the queue"', config.prefix + 'queue : "Shows the current queue, up to 15 songs shown."', config.prefix + 'play : "Play the music queue if already joined to a voice channel"', '', 'the following commands only function while the play command is running:'.toUpperCase(), config.prefix + 'pause : "pauses the music"',	config.prefix + 'resume : "resumes the music"', config.prefix + 'skip : "skips the playing song"', config.prefix + 'time : "Shows the playtime of the song."',	'volume+(+++) : "increases volume by 2%/+"',	'volume-(---) : "decreases volume by 2%/-"',	'```'];
            msg.channel.sendMessage(tosend.join('\n'));
        },
        'reboot': (msg) => {
            if (msg.author.id == config.adminID) process.exit(); //Requires a node module like Forever to work.
        }
    };
    
    robot.on('message', msg => {
        if (!msg.content.startsWith(config.prefix)) return;
        if (commands.hasOwnProperty(msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(config.prefix.length).split(' ')[0]](msg);
    });



    /*if(command!="pts" && command!="lvl"){
        try {
             let commandFile = require(`./commands/${command}.js`);
            commandFile.run(robot, message, args);
        }catch (err) {
            message.reply("Ты шо дурак??? Такой команды я не знаю!!! проверяй все мои скилзы в ///info!!!");
    }
    }*/
});
