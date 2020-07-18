const ClassBot = require(`./bot.js`);
const fsp = require(`fs`).promises;
const readline = require(`readline`);
const puppeteer = require(`puppeteer`);

const termcode = `202110`;
const CRN = `14791`;
const lastFile = `last.txt`;
const timeoutMins = 5;

const check = async (browser, term, crn) => {
	const page = await browser.newPage();
	await page.goto(`https://central.carleton.ca/prod/bwysched.p_select_term?wsea_code=EXT`);
	await page.select(`#term_code`, term);
	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[type="submit"]`),
	]);

	await page.$eval(`#crn_id`, (el, value) => el.value = value, crn);
	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[value="Search"]`),
	]);

	const msg = await page.$eval(`table tr:nth-child(4) td:nth-child(2)`, el => el.textContent);
	const courseCode = (await page.$eval(`table tr:nth-child(4) td:nth-child(4)`, el => el.textContent)).trim();

	await page.close();
	return [msg, courseCode];
};

(async () => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.on(`line`, (msg) => {
		if (msg == `q`) {process.exit(0);}
	});

	const resetFlag = process.argv.slice(2)[0];
	let lastKnown = await fsp.readFile(lastFile, { encoding: `utf8`, flag: resetFlag && resetFlag === `--reset` ? `w+` : `a+` });

	const bot = new ClassBot();
	await bot.initBot();
	const browser = await puppeteer.launch();
	console.log(`startup ok`);

	setInterval(async () => {
		const [currentStatus, course] = await check(browser, termcode, CRN);
		console.log(`${new Date(Date.now()).toISOString()}: ${currentStatus}`);

		if (currentStatus != lastKnown) {
			console.log(`Sending new status ${currentStatus}`);

			await fsp.writeFile(lastFile, currentStatus);
			await bot.sendSuccessMessage(lastKnown, currentStatus, course);
			lastKnown = currentStatus;
		}
		process.exit(0);
	}, timeoutMins * 1000);

})().catch(e => console.error(e));