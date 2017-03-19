/**
 * Created by user on 2017/3/19.
 */

'use strict';

const lib = {

	input2argv: require('./cli/argv.js').parse,

	exec2spawn: (input, to_array = false) =>
	{
		let argv = lib.input2argv(input);

		let file = argv.shift();

		return to_array ? [file, argv] : {
				file: file,
				argv: argv,
			};
	},

};

Object.assign(module.exports, lib);
