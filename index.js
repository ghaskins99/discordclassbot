const ClassBot = require(`./bot.js`);
const fsp = require(`fs`).promises;
const readline = require(`readline`);
const puppeteer = require(`puppeteer`);

const coursesFile = `./courses.json`
const courses = require(coursesFile);

const timeoutMins = 5;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function check(browser, term, crn) {
	const page = await browser.newPage();
	await page.goto(`https://central.carleton.ca/prod/bwysched.p_select_term?wsea_code=EXT`);
	await page.select(`#term_code`, term);

	await sleep(2000);
	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[type="submit"]`),
	]);

	await sleep(2000);

	await page.$eval(`#crn_id`, (el, value) => el.value = value, crn);

	await sleep(2000);
	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[value="Search"]`),
	]);

	await sleep(2000);

	const msg = await page.$eval(`table tr:nth-child(4) td:nth-child(2)`, el => el.textContent);
	const courseCode = (await page.$eval(`table tr:nth-child(4) td:nth-child(4)`, el => el.textContent)).trim();

	await page.close();
	return [msg, courseCode];
};

async function processCourses(bot, browser)
{
	Object.keys(courses).forEach(term => {
		courses[term].forEach(async course => {
			const [currentStatus, courseName] = await check(browser, term, course.code);

			console.log(`${new Date().toISOString()}: ${currentStatus}`);

			if (currentStatus != course.status) {
				console.log(`Sending new status ${courseName}: ${currentStatus}`);
				await bot.sendSuccessMessage(course.status, currentStatus, courseName);
				course.status = currentStatus;
				fsp.writeFile(coursesFile, JSON.stringify(courses));
			}
		})
	})
}

(async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on(`line`, (msg) => {
		if (msg == `q`) { process.exit(0); }
	});

	const resetFlag = process.argv.slice(2)[0];
	if (resetFlag === "--reset") {
		Object.values(courses).forEach(term => {
			term.forEach(course => {
				course.status = "";
			})
		})
		fsp.writeFile(coursesFile, JSON.stringify(courses));
	}

	const bot = new ClassBot();
	await bot.initBot();
	const browser = await puppeteer.launch({ args: [ `--no-sandbox` ] });
	// const browser = await puppeteer.launch({
	// 	executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	// 	headless: false,
	// 	args: [
	// 		'--auto-open-devtools-for-tabs',
	// 	]
	// });
	console.log(`startup ok`);

	await processCourses(bot, browser);

	setInterval(async () => {
		await processCourses(bot, browser)
	}, timeoutMins * 60000);

})().catch(e => console.error(e));
