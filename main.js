const fetch = require('node-fetch');
const rp = require('request-promise');
const Discord = require('discord.js');
const cheerio = require('cheerio');
const bot = new Discord.Client();
const client = new Discord.Client();

//Log a bot
bot.login(process.env.BOT_TOKEN);
client.login("...");

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

bot.on('message', message => {
  if (message.content.length !== 0 && !message.author.bot) {
    if (message.guild.id === "429377572498046996") {
      if (message.attachments.length > 0) {
        bot.channels.get("685832660924366905").send(`**${message.author.username}:** ${message.attachments.url}`);
      } else if (message.attachments.length > 0 && message.content.length > 0) {
        bot.channels.get("685832660924366905").send(`**${message.author.username}:** ${message.content}, ${message.attachments.url}`);
      } else if (message.content.includes('kantan') || message.content.includes('harusia')) {
        bot.channels.get("685832660924366905").send(`**${message.author.username}:** ${message.content} | <@176788987493613568>, <@497793836928729088>`);
      } else {
        bot.channels.get("685832660924366905").send(`**${message.author.username}:** ${message.content}`);
      }
    }
  }

  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(' ')
  const command = args.shift().toLowerCase();

  if (command == "plntogbp") {
    (async () => {
      try {
        const request = await fetch(`https://api.exchangeratesapi.io/latest?base=PLN&symbols=GBP`);
        const response = await request.json();

        const value = (response.rates.GBP * args).toFixed(2);

        message.channel.send(`**${args} PLN = ${value} GBP**`);

      } catch (err) {
        console.log(err)
      }
    })();
  }

  if (command == "plntousd") {
    (async () => {
      try {
        const request = await fetch(`https://api.exchangeratesapi.io/latest?base=PLN&symbols=USD`);
        const response = await request.json();

        const value = (response.rates.USD * args).toFixed(2);

        message.channel.send(`**${args} PLN = ${value} USD**`);

      } catch (err) {
        console.log(err)
      }
    })();
  }

  if (command == "plntoeur") {
    (async () => {
      try {
        const request = await fetch(`https://api.exchangeratesapi.io/latest?base=PLN&symbols=EUR`);
        const response = await request.json();

        const value = (response.rates.EUR * args).toFixed(2);

        message.channel.send(`**${args} PLN = ${value} EUR**`);

      } catch (err) {
        console.log(err)
      }
    })();
  }

  if (command == "yuantopln") {
    (async () => {
      try {
        const request = await fetch(`https://api.exchangeratesapi.io/latest?base=CNY&symbols=PLN`);
        const response = await request.json();

        const value = (response.rates.PLN * args).toFixed(2);

        message.channel.send(`**${args} ¥ = ${value} PLN**`);

      } catch (err) {
        console.log(err)
      }
    })();
  }

  if (command == "plntoyuan") {
    (async () => {
      try {
        const request = await fetch(`https://api.exchangeratesapi.io/latest?base=PLN&symbols=CNY`);
        const response = await request.json();

        const value = (response.rates.CNY * args).toFixed(2);

        message.channel.send(`**${args} PLN = ${value} ¥**`);

      } catch (err) {
        console.log(err)
      }
    })();
  }

  if (command == "img") {
    const argStr = args.toString();

    function makeSortString(s) {
      const translate = {
        "ą": "a",
        "ó": "o",
        "ż": "z",
        "ź": "z",
        "Ą": "a",
        "Ó": "o",
        "Ż": "z",
        "Ź": "z",
        "Ę": "e",
        "ę": "e",
        "Ą": "a",
        "Ł": "l",
        "ł": "l",
        "Ś": "s",
        "ś": "s",
        "Ć": "c",
        "ć": 'c',
        "ń": "n",
        "Ń": 'n'
      };
      const translate_re = /[ąóżźĄÓŻŹĘęĄŁłŚśĆćŃń]/g;
      return (s.replace(translate_re, function(match) {
        return translate[match];
      }));
    }
    async function send() {
      try {
        const request = await fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyDbs65FpjVrfBy5_3HK_EOqbojEBjCGJZ4&cx=016738891135948974521:fipagl7i2i0&q=${makeSortString(argStr)}&searchType=image`)
        const response = await request.json()
        let image = 0;
        let img1 = 1;
        const random = Math.floor(Math.random() * 100)
        let img = new Discord.RichEmbed()
          .setColor('#4B0082')
          .setAuthor(`${message.member.user.tag}`, `${message.author.avatarURL}`)
          .setTitle("Your results:")
          .setImage(`${response.items[0].link}`)
        img.setFooter(`Image ${img1} of ${response.items.length}`)

        message.channel.send(img)
          .then(msg => {
            msg.react('◀').then(r => {
              msg.react('▶')

              const backwardsFilter = (reaction, user) => reaction.emoji.name === "◀" && user.id === message.author.id;
              const forwardsFilter = (reaction, user) => reaction.emoji.name === "▶" && user.id === message.author.id;

              const backwards = msg.createReactionCollector(backwardsFilter);
              const forwards = msg.createReactionCollector(forwardsFilter);

              backwards.on('collect', r => {
                if (image < 1) return;
                else {
                  img1--
                  img.setImage(response.items[image = image - 1].link)
                  img.setFooter(`Image ${img1} of ${response.items.length}`)
                  msg.edit(img)
                }
              })

              forwards.on('collect', r => {
                if (image >= 9) return;
                else {
                  img1++
                  img.setImage(response.items[image = image + 1].link)
                  img.setFooter(`Image ${img1} of ${response.items.length}`)
                  msg.edit(img)
                }
              })
            })
          })
      } catch (err) {
        console.log(err)
      }
    }
    send()
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus("idle");
})
