const { PermissionFlagsBits } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
  description: "ping command for testing",

  type: CommandType.BOTH,
    guildOnly: true,
  permissions: [PermissionFlagsBits.Administrator],

  callback: () => {
    console.log("does shit run here lol")
    return {
      content: "Pong!",
    };
  },
};