export const check = async (term, crn, browser) => {
	const page = await browser.newPage();
	await page.goto(
		`https://central.carleton.ca/prod/bwysched.p_select_term?wsea_code=EXT`
	);
	await page.select(`#term_code`, term);

	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[type="submit"]`),
	]);

	await page.$eval(`#crn_id`, (el, value) => (el.value = value), crn);

	await Promise.all([
		page.waitForNavigation(),
		await page.click(`input[value="Search"]`),
	]);

	const msg = await page.$eval(
		`table tr:nth-child(4) td:nth-child(2)`,
		el => el.textContent
	);

	const courseCode = (
		await page.$eval(
			`table tr:nth-child(4) td:nth-child(4)`,
			el => el.textContent
		)
	).trim();

	await page.close();
	return [msg, courseCode];
};
