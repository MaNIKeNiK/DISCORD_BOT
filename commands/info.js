exports.run = (robot, message, args) => {
    message.channel.send({embed: {
        color: 3447003,
        author: {
            name: robot.user.username,
            icon_url: robot.user.avatarURL
          },
        title: "Основной список команд",
        description: "До сегоднешнего дня у меня небыло команд, ноооооо там внизу уже что-то появилось!",

        fields: [{
          name: "!!!Команды!!!",
          value: "///pts - каждый клацкает своими клешнями сообщения в чатик,теперь за это вы будете получать еще и птсики! гыыы",
          value: "///lvl - когда вы наклацкали своими рукаклешнями достаточно птсов вы получие новый лвл, этой командой во можете его проверить!"
        },
        {
          name: "Главный создатель передавал вам всем ---->",
          value: "Я(БОТ) творение боженьки [MaNiKeN](https://steamcommunity.com/id/manikenik)-на, он пока только начал работать надо мной, НО КОГДА ОН ЗАКОНЧИТ СВОЙ ШЕДЕВР ВЫ БУДЕТЕ ПОВЕРЖЕНЫ МОЕЙ КРАСОТОЙ!!!!АЗАЗАЗАЗ"
        },
        {
          name: "Главный помогатель моему создателю ---->",
          value: "[Стасиславыч](https://steamcommunity.com/profiles/76561198038852889)."
        },
        {
          name: "Главный рофланГениратор проекта ---->",
          value: "[Владиславыч](https://steamcommunity.com/profiles/76561198210237831)."
        },
        {
          name: "Главный Удав проекта ---->",
          value: "[Санчес](https://steamcommunity.com/profiles/76561198336255317)."
        },
        {
          name: "Главный Вызыватель на ПУСТЫРЬ ---->",
          value: "[Пашеславыч](https://steamcommunity.com/profiles/76561198339708123)."
        }
      ],

      timestamp: new Date(),
      footer: {
        icon_url: robot.user.avatarURL,
        text: "© Batislav aka MaNiKeN corp."
      }
    }});
}