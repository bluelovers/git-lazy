#!/usr/bin/env node

/**
 * Created by user on 2017/3/19.
 *
 * https://git-scm.com/docs/git-mv
 */

'use strict';

//const argv = process.argv.slice(2);

const gitlazy = require('../src/lazy');
const meow = require('meow');

const cli = meow({
		help: `
Usage: git-rename [<options>] <source>... <destination>
	Move or rename a file, directory or symlink.
 
	Options:
		-f, --force		force move/rename even if target exists
`,

		pkg: {},

	}, {
		alias: {
			//f: '-force'
		},
	}
);

//console.log([process.argv, cli.input, cli.flags]);

if (1 && cli.input.length != 2)
{
	//console.error(cli.help);
	cli.showHelp();
}
else
{
	const src = cli.input[0];
	const dest = cli.input[1];

	const flag = Object.keys(cli.flags).reduce((a, b) =>
		{
			let k = b.length > 1 ? '--' : '-';

			if (typeof cli.flags[b] == 'boolean')
			{
				//console.log(typeof cli.flags[b]);
				if (cli.flags[b])
				{
					a.push(`${k}${b}`);
				}
			}
			else
			{
				a.push(`${k}${b}`);
				a.push(gitlazy.str_wrap(cli.flags[b]));
			}

			return a;
		}, []
	).join(' ');

	//console.log([flag.join(' ')]);

	try
	{
		gitlazy.git_rename(src, dest, flag)
		.then((stdout) =>
			{
				if (stdout === true)
				{
					console.log(`already did rename before!, source="${src}", destination="${dest}", flags=${flag}`);
				}
				else
				{
					console.log(stdout);
				}
			}
		)
		.catch((err) =>
			{
				console.error(err);
			}
		)
		;
	}
	catch (err)
	{
		console.error(err);
	}
}
