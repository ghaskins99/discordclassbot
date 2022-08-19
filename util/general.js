import { promises as fsp } from "fs";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const coursesFile = `courses.json`;
const botconfigFile = `botconfig.json`;

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const readCourses = async () => {
	const data = await fsp.readFile(join(__dirname, `..`, coursesFile), `utf-8`);
	return JSON.parse(data);
};

export const writeCourses = async courses =>
	fsp.writeFile(
		join(__dirname, `..`, coursesFile),
		JSON.stringify(courses),
		`utf-8`
	);

export const readConfig = async () => {
	const data = await fsp.readFile(
		join(__dirname, `..`, botconfigFile),
		`utf-8`
	);
	return JSON.parse(data);
};

const mapTerm = term => {
	switch (term) {
	case `W`:
		return `10`;
	case `S`:
		return `20`;
	case `F`:
		return `30`;
	}
};

export const mapSemester = semester =>
	`20${semester.slice(1)}${mapTerm(semester[0])}`;
