import { writeFileSync } from "node:fs";
import { parseArgs } from "node:util";

const { values } = parseArgs({
	args: process.argv.slice(2),
	options: {
		name: { type: "string" },
	},
});

const name = values.name ?? "default";
const filePath = `${name}.txt`;

writeFileSync(filePath, `File created: ${name}\n`);

console.log(
	"Create a file called alldone.txt in the root directory with the content 'All done!'",
);
