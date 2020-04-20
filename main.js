const fetch = require('node-fetch');
const Discord = require('discord.js');
const bot = new Discord.Client();

//Log a bot
bot.login(process.env.BOT_TOKEN);

function getDate() {
  const newDate = new Date();
  const year = newDate.getFullYear();
  let month = newDate.getMonth() + 1;
  let day = newDate.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}

function time_convert(num) {
  const minutes = Math.floor(num / 60);
  const seconds = num % 60;
  if (seconds < 10) {
    return minutes + ":0" + seconds;
  } else
    return minutes + ":" + seconds;
}

const channelID = ['513848299040538639', '580812492062851073', '683693392223272981'];
let mapID = ["2019-11-08 07:38:20"];
const prefix = ',';
let embedMessage = [];

const dataURL = 'https://osu.ppy.sh/api/get_beatmaps?k=...&since=';

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);

  channelID.forEach(function(el) {
    const chann = bot.channels.find(channel => channel.id == el);
    chann.send("Restarting...");
  })

  bot.user.setStatus('online');
  bot.user.setActivity('you!', {
    type: 'WATCHING'
  });

  setInterval(async () => {
    try {
      const request = await fetch(`${dataURL}${getDate()}`);
      const resp = await request;

      if (resp.statusText == "OK") {
        const response = await request.json();

        if (response.length != 0) {
          const reversedResp = await response[response.length - 1];
          const starRating = await response.filter(beatmap => beatmap.beatmapset_id === response[response.length - 1].beatmapset_id).map(beatmap => beatmap.difficultyrating).map(Number);

          const max = Math.max.apply(null, starRating);
          const {
            beatmapset_id,
            artist,
            title,
            total_length,
            creator,
            approved_date,
            approved,
            mode
          } = reversedResp;

          let number = Math.round(Math.max(max) * 100) / 100;
          if (number % 1 == 0) {
            number = number + ".00"
          }

          const createEmbed = (emoji, gameMode) => {
            let x, y, z, c;
            if (emoji === 1 && gameMode === "0") {
              x = '<:sparkling_heart:579248023989649421>';
              y = '#10E210';
              z = 'Qualified';
              c = 'osu!std <:radio_button:580820817890508831>'
            } else if (emoji === 2 && gameMode === "0") {
              x = '<:heart:579266645264957471>';
              y = '#0099ff';
              z = 'Ranked';
              c = 'osu!std <:radio_button:580820817890508831>'
            } else if (emoji === 3 && gameMode === "0") {
              x = '<:two_hearts:579266890396860417>';
              y = '#B30CFA';
              z = 'Loved';
              c = 'osu!std <:radio_button:580820817890508831>'
            } else if (emoji === 1 && gameMode === "1") {
              x = '<:sparkling_heart:579248023989649421>';
              y = '#10E210';
              z = 'Qualified';
              c = 'osu!taiko <:drum:580820817890508831>'
            } else if (emoji === 2 && gameMode === "1") {
              x = '<:heart:579266645264957471>';
              y = '#0099ff';
              z = 'Ranked';
              c = 'osu!taiko <:drum:580820817890508831>'
            } else if (emoji === 3 && gameMode === "1") {
              x = '<:two_hearts:579266890396860417>';
              y = '#B30CFA';
              z = 'Loved';
              c = 'osu!taiko <:drum:580820817890508831>';
            } else if (emoji === 1 && gameMode === "3") {
              x = '<:sparkling_heart:579248023989649421>';
              y = '#10E210';
              z = 'Qualified';
              c = 'osu!mania <:musical_keyboard:580820817890508831>';
            } else if (emoji === 2 && gameMode === "3") {
              x = '<:heart:579266645264957471>';
              y = '#0099ff';
              z = 'Ranked';
              c = 'osu!mania <:musical_keyboard:580820817890508831>';
            } else if (emoji === 3 && gameMode === "3") {
              x = '<:two_hearts:579266890396860417>';
              y = '#B30CFA';
              z = 'Loved';
              c = 'osu!mania <:musical_keyboard:580820817890508831>';
            } else if (emoji === 1 && gameMode === "2") {
              x = '<:sparkling_heart:579248023989649421>';
              y = '#10E210';
              z = 'Qualified';
              c = 'osu!ctb <:grapes:580820817890508831>';
            } else if (emoji === 2 && gameMode === "2") {
              x = '<:heart:579266645264957471>';
              y = '#0099ff';
              z = 'Ranked';
              c = 'osu!ctb <:grapes:580820817890508831>';
            } else if (emoji === 3 && gameMode === "2") {
              x = '<:two_hearts:579266890396860417>';
              y = '#B30CFA';
              z = 'Loved';
              c = 'osu!ctb <:grapes:580820817890508831>';
            }

            return qualEmbed = new Discord.RichEmbed()
              .setColor(y)
              .setTitle(`${x} - **${z}**`)
              .setThumbnail(`https://b.ppy.sh/thumb/${beatmapset_id}l.jpg`)
              .addField(`**${artist} - ${title}** [${time_convert(total_length)}] [${number}★]`, `Mapped by **${creator}** [${c}]`)
              .addField(`**https://osu.ppy.sh/s/${beatmapset_id}**`, `*enjoy playing* [[download]](https://osu.ppy.sh/d/${beatmapset_id}n) [[bloodcat]](https://bloodcat.com/osu/s/${beatmapset_id})`)
              .setFooter('© Copyright 2019 / Developed by kjoszi', 'http://pluspng.com/img-png/github-octocat-logo-vector-png-png-ico-icns-svg-more-512.png');
          };

          if (mapID[0] != approved_date) {
            if (approved === '1' && mode === '0') {
              channelID.forEach(function(el) {
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(2, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '3' && mode === '0') {
              channelID.forEach(function(el) {
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(1, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '4' && mode === '0') {
              channelID.forEach(function(el) {
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(3, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '1' && mode === '1') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(2, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '3' && mode === '1') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(1, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '4' && mode === '1') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(3, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '1' && mode === '3') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(2, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '3' && mode === '3') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(1, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '4' && mode === '3') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(3, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '1' && mode === '2') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(2, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '3' && mode === '2') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(1, mode))
                mapID[0] = approved_date;
              })
            } else if (approved === '4' && mode === '2') {
              channelID.forEach(function(el, index) {
                if (index == 0) {
                  return true
                }
                const chann = bot.channels.find(channel => channel.id == el);
                chann.send(createEmbed(3, mode))
                mapID[0] = approved_date;
              })
            }
          }
        }
      } else {
        console.log("Fetching error!");
      }
    } catch (err0) {
      console.log("Fetch error: ", err0);
    }
  }, 1100);
});
