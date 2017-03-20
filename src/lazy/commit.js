/**
 * Created by user on 2017/3/20.
 */

'use strict';

const LF = "\n";
const fs = require('../async/fs');

const self = module.exports = Object.assign(require("."), {

		async git_add_file(path, flag = '')
		{
			/*
			if (path.indexOf(' ') != -1 && !/^".+"$/.test(path))
			{
				path = '"' + path + '"';
			}
			*/

			let stdout = await self.exec(`git add ${flag} --verbose "${path}"`);

			return stdout;
		},

		is_allow_file(file)
		{
			if (file && file != '.' && file != '..')
			{
				return true;
			}

			return false;
		},

		async git_rename(src, dest, flag = '')
		{
			//src = self.str_wrap(src);
			//dest = self.str_wrap(dest);

			let options = {
				throw_error: true,
			};

			let stdout = '';

			if (self.is_allow_file(src) && fs.existsSync(src))
			{
				stdout += await self.exec(`git mv --verbose ${flag} "${src}" "${dest}"`, options);
			}
			else if (self.is_allow_file(dest) && fs.existsSync(dest))
			{
				stdout += await self.exec(`git rm --ignore-unmatch ${flag} --cached "${src}"`, options);
				stdout += LF;
				stdout += await self.exec(`git add ${flag} --verbose "${dest}"`, options);
			}
			else
			{
				throw new TypeError(`fatal: bad source, source="${src}", destination="${dest}", flags=${flag}`);

				return false;
			}

			stdout = stdout.trim(LF);

			return stdout || true;
		},

	}
);
