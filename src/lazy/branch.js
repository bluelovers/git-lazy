/**
 * Created by user on 2017/3/22.
 */

'use strict';

const LF = "\n";
const fs = require('../async/fs');
const path = require('upath2');

const self = module.exports = Object.assign(require("."), {

		git_branch_current_name()
		{
			return self.exec("git rev-parse --abbrev-ref HEAD", {
				throw_error: true,
			});
		},

		async git_branch_new_empty(branch_name, options = {})
		{
			options = Object.assign({
					_deep: 2,
					/*
					 * @BUG
					 { error: null,
					 stdout: '',
					 stderr: 'Switched to a new branch \'123\'\n' }
					 */
					fallback_stderr: true,
				}, options
			);

			if (!branch_name)
			{
				throw new TypeError(`fatal: '${branch_name}' is not a valid branch name.`);
			}

			const cwd = process.cwd();

			return self.repo_dir_root()
			.then((dir_root) =>
				{
					let p = path.relative(cwd, dir_root);

					// safe check
					if (p == '' || p == '.' || (options._deep > 1 && p.split('/').length < options._deep))
					{
						if (p == '')
						{
							p = '.';
						}

						return p;
					}
					else
					{
						throw new Error(`cwd must near root="${dir_root}"`)
					}
				}
			)
			.then((path_relative) =>
				{

					return self.execEach([
							`git checkout --orphan "${branch_name}"`,
							`git rm -r --cached "${path_relative}"`,
						], options
					)
					.then((res) =>
						{
							//res.push(`Create a new empty orphan branch '${branch_name}'`);

							return res.res.join(LF + LF);
						}
					);

					/*
					 let res = [];

					 return self.exec(`git checkout --orphan "${branch_name}"`, {
					 fallback_stderr: true,
					 }
					 )
					 .then((stdout) =>
					 {
					 res.push(stdout);

					 return self.exec(`git rm -r --cached "${path_relative}"`);
					 }
					 )
					 .then((stdout) =>
					 {
					 res.push(stdout);

					 return res.join(LF + LF);
					 }
					 );
					 */

				}
			)
			.catch((err) =>
				{
					throw err;
				}
			);
		},

	}
);
