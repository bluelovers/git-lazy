/**
 * Created by user on 2017/3/21.
 */

'use strict';

const child_process = require('../async/child_process');
const fs = require('../async/fs');
const path = require('upath2');
const lazyutil = require('../util');

const self = module.exports = Object.assign(require("."), {

		async notepad(filename, options = {})
		{
			options = Object.assign({
					throw_error: true,
					git_commit: true,

					//format_columns: true,

					write_file: true,

					cb_output: null,

				}, options
			);

			if (typeof filename != "string" || filename == '')
			{
				throw new TypeError('fatal: undefined filename.');
			}

			options.format_columns = lazyutil.iifv(options.format_columns, filename.indexOf('COMMIT_EDITMSG') != -1)

			if (options.format_columns == true)
			{
				options.format_columns = await self.exec(`git config format.commitmessagecolumns`, {
						allow_empty: true,
					}
				);
			}
			else if (typeof options.format_columns != "number")
			{
				options.format_columns = false;
			}

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

						if (options.format_columns > 1)
						{
							const word_wrap = require('word-wrap');
							input = word_wrap(input, {
									width: options.format_columns,
									indent: '',
								}
							);
						}

						if (typeof options.cb_output == "function")
						{
							input = options.cb_output(input);
						}

						let cb = () =>
						{
							return {
								file: filename,
								_file: _filename,
								data: input,
							}
						};

						if (!options.write_file)
						{
							return cb();
						}

						return fs.writeFileAsync(_filename, input).then(cb);
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
						catch (e)
						{
						}

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
