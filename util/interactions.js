import { DI } from "../index.js";
import { check } from "./browser.js";
import { mapSemester, readCourses, writeCourses } from "./general.js";

const ping = async interaction => {
	return interaction.reply(`pong`);
};

const addsub = async interaction => {
	await interaction.deferReply();
	const CRN = interaction.options.get(`crn`, true).value.toUpperCase();
	const semester = interaction.options
		.get(`semester`, true)
		.value.toUpperCase();
	const userId = interaction.user.id;
	const channelId = interaction.channelId;

	if (!/[0-9]{5}/.test(CRN)) {
		return interaction.editReply(`course code is wrong lol should be 5 digits`);
	}

	if (!/[WSF]{1}[0-9]{2}/.test(semester)) {
		return interaction.editReply(
			`semester is wrong lol should be like \`[w, s or f]xx\``
		);
	}

	const yearCode = mapSemester(semester);

	let res = [];

	try {
		res = await check(yearCode, CRN, DI.browser);
	} catch (e) {
		console.error(e);
		return interaction.editReply(`Checking course failed`);
	}

	const [currentStatus, courseName] = res;

	const courses = await readCourses();

	if (!courses[yearCode]) courses[yearCode] = {};
	if (!courses[yearCode][CRN]) {
		courses[yearCode][CRN] = { status: ``, users: {} };
	}

	const course = courses[yearCode][CRN];

	course.users[userId] = channelId;

	await writeCourses(courses);

	return interaction.editReply(
		`Subscription for \`${courseName}\` added! You'll see an update whenever the process runs next.
btw the current status is \`${currentStatus}\``
	);
};

export default { ping, addsub };
