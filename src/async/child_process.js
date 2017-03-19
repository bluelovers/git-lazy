/**
 * Created by user on 2017/3/19.
 */

'use strict';

const child_process = require('child_process');
//const Promise = require("bluebird");

const cp = {

	/*
	async execAsync(command, options)
	{
		return new Promise((resolve, reject) =>
		{
			const child = child_process.exec(cmd, opts, (err, stdout, stderr) =>
			{
				err ? reject({
					error: err,
					stdout: stdout,
					stderr: stderr
				}
				) : resolve({
					error: err,
					stdout: stdout,
					stderr: stderr
				}
				);
			}
			)
		}
		).catch(function (err)
		{
			return {
				error: err
			};
		}
		);
	},
	*/

	//execAsync: _promisify(child_process.exec),
	//execFileAsync: _promisify(child_process.exec),

	_promisify: _promisify,

};

['exec', 'execFile'].forEach((fn) => cp[fn + 'Async'] = _promisify(child_process[fn]));

function _promisify(fn)
{
	return (...argv) =>
	{
		return new Promise((resolve, reject) =>
		{
			const cb = (err, stdout, stderr) =>
			{
				err ? reject({
					error: err,
					stdout: stdout,
					stderr: stderr
				}
				) : resolve({
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
			//console.error(err.error);
			return err;
		}
		)
		;
	};
}

Object.assign(module.exports, child_process, cp);
