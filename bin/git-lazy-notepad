#!/usr/bin/env node

/**
 * Created by user on 2017/3/21.
 */

require('../src/bin');

const cli = meow();

let output = gitlazy.notepad(cli.input[0])
.then((data) =>
{
	console.log(data.data);
})
.catch((err) =>
	{
		console.error(`${err}`);
		process.exit(err.code || 1);
		//throw err;
	}
);
