# discordclassbot

bot checks class status and pings me in discord when a class is available

# setup

[Install Node](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-debian-10#installing-node-js-with-apt-using-a-nodesource-ppa)

[Install dependencies for puppeteer](https://gist.github.com/tavinus/7effd4b3dac87cb4366e3767679a192f)

[Install gh for auth fun woo](https://github.com/cli/cli/blob/trunk/docs/install_linux.md), then `gh auth login` with whatever token ur using

needs a file `botconfig.json` which includes `{ "token": "insert discord bot access token here" }`

add `discordbot.service` to `/etc/systemd/system` and `systemctl enable discordbot.service`
