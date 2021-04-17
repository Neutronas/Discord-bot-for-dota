const axios = require('axios');
const { steamKey, firebase } = require('../config.json');
const { getLatestMatch } = require('../helpers.js');

module.exports = {
	name: 'link',
	description: 'Link your steam with discord',
	execute(message, args) {
    let author = {
      id: message.author.id,
      name: message.author.username,
      steamid: null,
      latestMatch: null
    }
    if (args[0]) {
      // Remove trailing space
      if(args[0].substr(-1) === '/') {
        args[0] = args[0].substr(0, args[0].length - 1);
      }

      // Take nickname
      let parts = args[0].split('/');
      let stringName = parts[parts.length-1];

      // Take Steam id 32
      axios.get(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${steamKey}&vanityurl=${stringName}`)
      .then(function (response) {
        author.steamid = response.data.response.steamid-76561197960265728+2;
        axios.get(`https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=${steamKey}&matches_requested=1&account_id=${author.steamid}`)
        .then(function (response) {
          if(response.data.result.status == 15) {
            message.channel.send(`Tavo Dotos match istorija nėra vieša.`);
          }
          author.latestMatch = response.data.result.matches[0].match_id;
          axios.put(`${firebase}/users/${author.id}.json`, {
              name: author.name,
              steamid: author.steamid,
              latestMatch: author.latestMatch
            })
            .then(function (response) {
              message.channel.send(`${author.name}: Sėkmingai sujungtas tavo Steam account`);
            })
        })            
      })
      // message.channel.send(`Tavo nickas: ${stringName}`);
    } else {
      message.channel.send('Nurodyk ir savo profilį. Pvz: !link https://steamcommunity.com/id/NeuTronas/');
    }
    // https://steamcommunity.com/id/neutronas
		// message.channel.send(args[0]);
	},
};