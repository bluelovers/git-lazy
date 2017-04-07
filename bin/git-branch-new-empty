#!/usr/bin/env node

/**
 * Created by user on 2017/3/22.
 */

require('../src/bin');

const Promise = require("bluebird");
const child_process = require('../src/async/child_process');

const cli = meow();

//const shelljs = require('shelljs');

const console = lazyConsole;

branch_name = cli.input[0];

const options = {
	fallback_stderr: true,
};

console.info(`git-Lazy Create a new empty orphan branch '${branch_name}'`);
console.log(`
Start...
`);

let output = gitlazy.git_branch_new_empty(cli.input[0], branch_name)
//gitlazy.exec(`git checkout --orphan "${branch_name}"`, options)
//child_process.execAsync(`git checkout --orphan "${branch_name}"`, {
//	fallback_stderr: true,
//})
.then((data) =>
{
	console.log(data);

	console.log(`\n...Done.`);
})
.catch((err) =>
	{
		//console.error(err.code);
		console.error(`${err}`);
		process.exit(err.code || 1);
		//throw err;
	}
);
