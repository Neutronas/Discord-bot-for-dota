const axios = require('axios');
const Discord = require('discord.js');
const { steamKey, channelID, firebase } = require('./config.json');

module.exports.spamNewMatches = async function (client) {
  let author = {
    id: null,
    name: null,
    steamid: null,
    latestMatch: null,
  };

  let matchInfo = {
    kills: 0,
    assists: 0,
    deaths: 0,
    last_hits: 0,
    hero_damage: 0,
    gold: 0,
    team: 0,
    radiant_win: false,
    lobby_type: false,
  };
  playersResponse = await getAllPlayers();
  let players_array = Object.values(playersResponse.data);
  let players_indexes = Object.keys(playersResponse.data);

  let latest_match = {};
  let latest_match_info = {};
  for (const [index, user] of players_array.entries()) {    
    // find last match
    latestMatch = await getLatestMatch(user.steamid);
    if (user.latestMatch != latestMatch.data.result.matches[0].match_id) {

      // set all user info
          author.latestMatch = latestMatch.data.result.matches[0].match_id;
          author.steamid = user.steamid;
          author.id = players_indexes[index];
          author.name = user.name

      // get new match info
          latest_match_info = await getLatestMatchInfo(author.latestMatch);
            matchInfo.radiant_win = latest_match_info.data.result.radiant_win;
            matchInfo.lobby_type = latest_match_info.data.result.lobby_type;
            for (const value of latest_match_info.data.result.players) {
              if (value.account_id == author.steamid) {
                matchInfo.kills = value.kills;
                matchInfo.assists = value.assists;
                matchInfo.deaths = value.deaths;
                matchInfo.last_hits = value.last_hits;
                matchInfo.hero_damage = value.hero_damage;
                matchInfo.gold = value.gold;
                if (value.player_slot < 5) {
                  matchInfo.team = 0;
                } else {
                  matchInfo.team = 1;
                }
              }
            };
            let embedMessage = new Discord.MessageEmbed()
            .setURL(`https://www.dotabuff.com/matches/${author.latestMatch}`)
            .setFooter('Pažiūrėk daugiau paspausdamas ant įrašo pavadinimo', 'https://www.pngarea.com/pngm/77/904140_dota-2-logo-png-dota-2-logo-png.png');

            let endText = 'sutriuškino savo priešus';
            let color = '#92A525'
            if (matchInfo.team == 0 && matchInfo.radiant_win == 0 || matchInfo.team == 1 && matchInfo.radiant_win == 1 ) {
              endText = 'pralaimėjo'
              color = '#C23C2A'
            }
            embedMessage.setTitle(`${author.name} ${endText}`);
            embedMessage.setColor(color);
            embedMessage.setDescription(`${author.name} sužaidė match su ${matchInfo.kills} kill(s), ${matchInfo.deaths} death(s), ${matchInfo.assists} assist(s) ir *${endText}*`)


              // Spausdinam jei tik ranked
              if (matchInfo.lobby_type == 7) {
                client.channels.cache.get(channelID).send(embedMessage);
              }
            await updatePlayer(author)
          }

      };
};


async function getAllPlayers() {
  return axios.get(`${firebase}/users.json`);
}

async function getLatestMatch(steamid) {
  return axios.get(`https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=${steamKey}&matches_requested=1&account_id=${steamid}`);
}

async function getLatestMatchInfo(matchid) {
  return axios.get(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${steamKey}&match_id=${matchid}`);
}

async function updatePlayer(author) {
  axios.put(`${firebase}/users/${author.id}.json`, {
    name: author.name,
    steamid: author.steamid,
    latestMatch: author.latestMatch
  })
  .then(function (response) {
    console.log('Atnaujintas user:' + author.name);
  })
}
