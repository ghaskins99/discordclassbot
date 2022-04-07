const { Client, Intents } = require(`discord.js`);
const { token } = require(`./botconfig.json`);

module.exports = class ClassBot {
  #client = new Client({ intents: [Intents.FLAGS.GUILDS] });

  async initBot() {
    this.#client.once(`ready`, () => {
      console.log(`Ready!`);
    });

    await this.#client.login(token);
  }

  async sendSuccessMessage(last, current, courseName, user) {
    if (user === undefined || user === null) {
      user = "206476533135704064"; // me if not there
    }
    const channel = await this.#client.channels.fetch(`733183840813842473`);
    // channel.guild.ownerID is dead now so
    await channel.send(
      `<@${user}> Class \`${courseName}\` was \`${
        last ? last : `N/A`
      }\`, now is \`${current}\``
    );
  }
};
