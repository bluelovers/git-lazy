/**
 * Created by user on 2017/3/21.
 */

'use strict';

const child_process = require('../async/child_process');
const fs = require('../async/fs');
const path = require('upath2');

const self = module.exports = Object.assign(require("."), {

		async notepad(filename)
		{
			let options = {
				throw_error: true,
				git_commit: true,
			};

			filename = path.normalize(filename);
			let _filename = self.fix_path(filename);

			//_filename = path.normalize(fs.realpathSync(_filename));

			let data = await fs.openAsync(_filename, 'w')
				.then(() =>
					{
						return child_process.execFileAsync(`notepad.exe`, [_filename], options);
					}
				)
				.then(() =>
					{
						return fs.readFileAsync(_filename);
					}
				)
				.then((input) =>
					{
						input = self.stdout_trim(input, options);

						if (input == '')
						{
							return Promise.reject(`fatal: input empty`);
						}

						return fs.writeFileAsync(_filename, input).then(() =>
							{
								return {
									file: filename,
									_file: _filename,
									data: input,
								}
							}
						);
					}
				)
				.catch((err) =>
					{
						err = new Error(err);
						err.message += `\n\tinput:\t${filename}`;
						if (filename != _filename)
						{
							err.message += `\n\tpath:\t${_filename}`;
						}

						try
						{
							let _real = path.normalize(fs.realpathSync(_filename));

							if (_real != _filename)
							{
								err.message += `\n\treal:\t${_real}`;
							}
						}
						catch(e)
						{}

						//console.error(err);
						throw err;
						//return err;
					}
				)
				;

			return data;
		}

	}
);
