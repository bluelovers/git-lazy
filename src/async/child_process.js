/**
 * Created by user on 2017/3/19.
 */

'use strict';

const child_process = require('child_process');
const Promise = require("bluebird");

const cp = {

	//execAsync: _promisify(child_process.exec),
	//execFileAsync: _promisify(child_process.exec),

	_promisify: _promisify,

	exec2spawn: require('../util/exec2spawn').exec2spawn,

};

['exec', 'execFile'].forEach((fn) => cp[fn + 'Async'] = _promisify(child_process[fn]));

function _promisify(fn)
{
	return (...argv) =>
	{
		let options = {};

		if (argv.length > 1 && typeof argv[argv.length - 1] == "object")
		{
			options = argv[argv.length - 1];
		}

		return new Promise((resolve, reject) =>
			{
				const cb = (err, stdout, stderr) =>
				{
					(options.throw_error && err) ? reject(err) : resolve({
								error: err,
								stdout: stdout,
								stderr: stderr
							}
						);
				};

				argv.push(cb);

				const child = fn(...argv)
			}
		)
		.catch((err) =>
			{
				if (1 || options.throw_error && err)
				{
					//console.error(err);
					throw err;
				}

				//console.error(err.error);
				return err;
			}
		);
	};
}

Object.assign(module.exports, child_process, cp);
