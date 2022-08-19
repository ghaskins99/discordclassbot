import { ApplicationCommandOptionType } from "discord.js";

const commands = [
	{
		name: `ping`,
		description: `Replies with Pong!`,
	},
	{
		name: `addsub`,
		description: `add yourself to the course`,
		options: [
			{
				type: ApplicationCommandOptionType.String,
				name: `crn`,
				description: `the CRN found from central, usually 5 digits`,
				required: true,
			},
			{
				type: ApplicationCommandOptionType.String,
				name: `semester`,
				description: `Semester: one of [w, s, f] + last 2 digits of year, i.e., w23, s22, f22`,
				required: true,
			},
		],
	},
];

export default commands;
