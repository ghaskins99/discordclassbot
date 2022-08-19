import puppeteer from "puppeteer";

import ClassBot from "./bot.js";
import { check } from "./util/browser.js";
import { readCourses, writeCourses } from "./util/general.js";

const timeoutMins = 10;
let instant = false;

export const DI = {};

async function processCourses(bot, browser) {
	const courses = await readCourses();
	Object.keys(courses).forEach(term => {
		Object.keys(courses[term]).forEach(async courseId => {
			const [currentStatus, courseName] = await check(term, courseId, browser);

			const course = courses[term][courseId];

			console.log(`${new Date().toISOString()}: ${currentStatus}`);
			if (currentStatus != course.status) {
				console.log(`Sending new status ${courseName}: ${currentStatus}`);
				const channels = {};
				Object.keys(course.users).forEach(userId => {
					if (!channels[course.users[userId]]) {
						channels[course.users[userId]] = [];
					}
					channels[course.users[userId]].push(userId);
				});

				const promises = [];

				Object.keys(channels).forEach(channel => {
					promises.push(
						bot.sendSuccessMessage(
							course.status,
							currentStatus,
							courseName,
							channel,
							channels[channel]
						)
					);
				});

				await Promise.all(promises);

				course.status = currentStatus;
				await writeCourses(courses);
			}
		});
	});
}

(async () => {
	process.once(`SIGTERM`, () => {
		console.log(`SIGTERM recieved`);
		process.exit(0);
	});

	process.once(`SIGINT`, () => {
		console.log(`SIGINT recieved`);
		process.exit(0);
	});

	{
		const courses = await readCourses();
		process.argv.slice(2).forEach(async flag => {
			if (flag === `--reset`) {
				Object.values(courses).forEach(term => {
					term.forEach(course => {
						course.status = ``;
					});
				});
				await writeCourses(courses);
			} else if (flag === `--delete`) {
				for (const key in courses) {
					delete courses[key];
				}
				await writeCourses(courses);
			} else if (flag === `--instant`) {
				instant = true;
			}
		});
	}

	const bot = new ClassBot();
	await bot.initBot();

	DI.browser = await puppeteer.launch({ args: [`--no-sandbox`] });
	// DI.browser = await puppeteer.launch({
	// 	executablePath: `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe`,
	// 	headless: false,
	// 	args: [`--auto-open-devtools-for-tabs`],
	// });
	console.log(`startup ok`);

	if (instant) await processCourses(bot, DI.browser);

	setInterval(async () => {
		await processCourses(bot, DI.browser);
	}, timeoutMins * 60000);
})().catch(e => console.error(e));
