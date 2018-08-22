const Discord = require('discord.js');
const robot = new Discord.Client();

robot.login("NDgxODYzNTcwNDE0NjMzMDEw.Dl8icA.E9TUutQ01MDkhuYlvVn0wVLpMGQ");

robot.on('message',(message)=>{
    if(message.content=="кто это"){
        message.reply("Я творение боженьки MaNiKeN-на, он пока только начал работать надо мной, НО КОГДА ОН ЗАКОНЧИТ СВОЙ ШЕДЕВР ВЫ БУДЕТЕ ПОВЕРЖЕНЫ МОЕЙ КРАСОТОЙ!!!!АЗАЗАЗАЗ");
    }
});