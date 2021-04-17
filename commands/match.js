const axios = require('axios');
const { steamKey, firebase } = require('../config.json');

module.exports = {
	name: 'match',
	description: 'Show your match ID',
	execute(message, args) {

    let author = {
      id: message.author.id,
      name: message.author.username,
      steamid: null,
      latestMatch: null,
    };

    var matchInfo = {
      kills: 0,
      assists: 0,
      deaths: 0,
      last_hits: 0,
      hero_damage: 0,
      gold: 0,
      team: 0,
      radiant_win: false,
    };
    
    axios.get(`${firebase}/users/${author.id}.json`)
    .then(function (response) {
      // console.log(response);
      author.steamid = response.data.steamid;

      axios.get(`https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=${steamKey}&matches_requested=1&account_id=${author.steamid}`)
      .then(function (response) {
        author.latestMatch = response.data.result.matches[0].match_id;
        axios.get(`http://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/v1/?key=${steamKey}&match_id=${author.latestMatch}`)
          .then(function (response) {
            matchInfo.radiant_win = response.data.result.radiant_win;
            response.data.result.players.forEach((value, key) => {
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
            });
            if (matchInfo.team == 0 && matchInfo.radiant_win == 0) {
              message.channel.send(`${author.name} sužaidė match su kills: ${matchInfo.kills}, deaths: ${matchInfo.deaths}, assists: ${matchInfo.assists} score ir *pralaimėjo*. Match link: https://www.dotabuff.com/matches/${author.latestMatch}`);
            } else {
              message.channel.send(`${author.name} sužaidė match su kills: ${matchInfo.kills}, deaths: ${matchInfo.deaths}, assists: ${matchInfo.assists} score ir *sutriuškino* savo priešus. Match link: https://www.dotabuff.com/matches/${author.latestMatch}`);
            }
            
          });
      });
    })
  },
};