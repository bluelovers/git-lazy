/**
 * Created by user on 2017/3/20.
 */

'use strict';

const path = require('upath2');
const fs = require('../async/fs');
const ospath = require('ospath');

const self = module.exports = Object.assign(require("."), {

	_paths: {
		'COMMIT_EDITMSG': '~/COMMIT_EDITMSG',
	},

	async repo_dir_git()
	{
		let stdout = await self.exec("git rev-parse --git-dir");
		stdout = path.normalize(stdout);

		return stdout;
	},

	async repo_is_index_locked(repo_dir_git = null)
	{
		if (repo_dir_git === null)
		{
			repo_dir_git = await self.repo_dir_git();
		}
		else if (repo_dir_git instanceof Promise)
		{
			repo_dir_git = await repo_dir_git;
		}

		if (!fs.existsSync(repo_dir_git))
		{
			throw new Error(`ENOENT: "${repo_dir_git}" not exists!`);
		}

		let file = path.join(repo_dir_git, 'index.lock');
		//let file = path.join(repo_dir_git, 'index');

		//console.log(repo_dir_git, file);

		let exists_bool = null;

		exists_bool = fs.existsSync(file);

		return exists_bool;
	},

	get_path(name)
	{
		if (name in self._paths)
		{
			name = self._paths[name];
		}
		
		name = name.replace(/^~\//, ospath.home() + '/');

//		return name;
		return path.normalize(name);
	},

});
