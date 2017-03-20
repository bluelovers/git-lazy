/**
 * Created by user on 2017/3/20.
 */

'use strict';

const child_process = require('../async/child_process');

const LF = "\n";

const self = module.exports = Object.assign(require("."), {

		async exec(cmd, options = {})
		{
			options = Object.assign({
					throw_error: false,
				}, options
			);

			const data = await child_process.execAsync(cmd, options);

			if ((options.throw_error && data.error) || !data.stdout && (data.error || data.stderr))
			{
				throw (data.stderr ? new Error(data.stderr) : data.error);
			}

			//return data.stdout.replace(/\r\n|\r/g, LF).trim(LF);
			return self.stdout_trim(data.stdout);
		},

	}
);
