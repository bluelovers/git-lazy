/**
 * Created by user on 2017/3/20.
 */

'use strict';

const child_process = require('../async/child_process');
const Promise = require("bluebird");

const LF = "\n";

const self = module.exports = Object.assign(require("."), {

		_exec_options(...options)
		{
			return Object.assign({
					throw_error: false,
					allow_empty: false,

					fallback_stderr: false,

				}, ...options
			);
		},

		async exec(cmd, options = {})
		{
			/*
			options = Object.assign({
					throw_error: false,
					allow_empty: false,
				}, options
			);
			*/
			options = self._exec_options(options);

			const data = await child_process.execAsync(cmd, options)
				.then((data) =>
					{
						if ((options.throw_error && data.error) || (!options.allow_empty && !data.stdout) && (data.error || (!options.fallback_stderr && data.stderr)))
						{
							throw (data.stderr ? new Error(data.stderr) : data.error);
						}
						else if (!data.stdout && options.fallback_stderr)
						{
							if (data.error || !data.stderr)
							{
								throw (data.stderr ? new Error(data.stderr) : data.error);
							}
							else
							{
								return data.stderr;
							}
						}

						//return data;
						return data.stdout;
					}
				)
				.then((data) =>
				{
					return self.stdout_trim(data);
				})
				.catch((err) =>
					{
						throw err;
					}
				)
				;

			//return data.stdout.replace(/\r\n|\r/g, LF).trim(LF);
			//return self.stdout_trim(data.stdout);
			//return self.stdout_trim(data);
			return data;
		},

		async execEach(cmds, options = {})
		{
			options = self._exec_options(options);

			return Promise.mapSeries(cmds, (cmd, index) =>
			{
				return self.exec(cmd, options);
			}).then((res) =>
			{
				return {
					cmds: cmds,
					res: res,
				};
			});
		},

	}
);
