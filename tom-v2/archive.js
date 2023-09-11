const { Client, IntentsBitField, Partials, PermissionsBitField } = require("discord.js");
const path = require("path");
const config = require('./config.json');
const { log } = require("console");
const fs = require('fs');

const json = fs.readFileSync('./data.json', 'utf-8');
const data = JSON.parse(json);

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel],
  presence: {
    status: 'online',
    activity: {
     name: '!help',
     type: 'PLAYING',
    }
}
});
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`)
});
client.on('messageCreate', async (message) => {
    const repliedMessageId = message.reference.messageId;
    const content = message.content;
    const member = message.member;
    if (content.startsWith('!')){
        const args = content.split(' ');
        console.log("Command Entered:" + args + ". length:" + args.length)
        console.log(member.permissions.toArray())
        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          message.reply('You need to be an Administrator to use this command.')
      } else {
         //command creation
         if (args.length === 2 && args[1] === "ping") {
          ping();
         }
         if (args.length === 3 && args[1] === "startgame") {
          startgame();
         } 
         if (args.length === 2 && args[1] === "stopgame") {
          stopgame();
         }
         if (args.length === 2 && args[1] === "json") {
          json();
         }
         if (args.length > 4 && args[1] === "json" && args[2] === "set") {
          setjson(args);
         }
         if (args.length === 2 && args[1] === "help") {
          help();
         }
         if (args.length === 5 && args[1] === "killfeed" && args[2] === "add") {
          killfeedadd();
         }
         if (args.length === 4 && args[1] === "killfeed" && args[2] === "remove") {
          killfeedremove();
         }
         if (args.length === 3 && args[1] === "killfeed" && args[2] === "clear") {
          killfeedclear();
         }
      }
      //command logic as a function
      function ping() {
        message.reply('pong')
      };
      function startgame() {
        data.game = true;
        const gamemodes = ['Supercharged', 'Frenzy', 'Teams', 'Oxfords', 'Zombies', 'Chaos', 'Stealth', 'Last Man Standing', 'Minigame'];
        const input = args[2].toLowerCase(); // Convert the input to lowercase for non-case-sensitive comparison

        if (gamemodes.some(mode => mode.toLowerCase() === input)) {
          data.gamemode = args[2];
          message.reply('Game started, gamemode is ' + args[2]);

        } else {
          message.reply('Invalid gamemode')
        }
        fs.writeFileSync('data.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            message.reply('Game started, gamemode is ' + args[2]);

        });
    
    }
    function stopgame() {
      data.game = false;
      fs.writeFileSync('data.json', JSON.stringify(data), (err) => {
          if (err) {
              console.error(err);
              return;
          }
          console.log('game stopped');
      });
      message.reply('game stopped')
  }
 function json() {
  message.reply(fs.readFileSync('./data.json', 'utf-8'))
 }
 function setjson(args) {
  const dataToAppend = args.slice(3).join(' ');
  fs.writeFileSync('data.json', dataToAppend);
  message.reply('Data appended to data.json successfully.');
}
function help() {
  embed = {
    description: 'undefined',
  };
  availableCommands = '**Commands**:\n *Prefix*: `!tom`\n- `ping`: pings the bot. replies "pong" if successful \n- `startgame <gamemode>`: starts a new game\n- `killfeed add <attacker> <victim>`: adds an entry to the killfeed\n- `killfeed remove <number>`: removes <number> of killfeed entries from the bottom\n- `stopgame`: stops current game if applicable\n- `json`: show current contents of data.json\n- `json set <data>`: set the contents of data.json to <data>. IRREVERSIBLE, BE CAREFUL WHILE USING!';
  embed.description = '\n\n' + availableCommands;
  message.reply({ embeds: [embed] });
}
function killfeedadd() {
  var attacker = args[3];
  var victim = args[4];
  const data = fs.readFileSync('data.json');
  const jsonData = JSON.parse(data);
   const entry = `${attacker}-${victim}`;
   jsonData.killfeed.push(entry);
   fs.writeFileSync("data.json", JSON.stringify(jsonData, null, 2));
   message.reply(`Entry "${entry}" added to the killfeed.`);
}
function killfeedremove() {
  var removeAmt = args[3]
  const data = fs.readFileSync('data.json');
  const jsonData = JSON.parse(data);
  const killfeed = jsonData.killfeed;
  const removedEntries = killfeed.splice(-removeAmt);
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
}
function killfeedclear() {
  // Read the JSON data from file
  const data = fs.readFileSync('data.json');
  const jsonData = JSON.parse(data);

  // Clear the "killfeed" array
  jsonData.killfeed = [];

  // Write the updated JSON data back to file
  fs.writeFileSync('data.json', JSON.stringify(jsonData, null, 2));
}
}});
client.login(config.token);