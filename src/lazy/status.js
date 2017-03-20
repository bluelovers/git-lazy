/**
 * Created by user on 2017/2/24.
 */

'use strict';

const self = module.exports = Object.assign(require("."), {

		Symbol: Symbol.for('_'),

		async _git_status(mode)
		{
			let stdout = '';

			if (mode > 1)
			{
				stdout = await self.exec("git commit -m . --dry-run --short");
			}
			else if (mode < 0)
			{
				await self.exec("git add -A .");
				stdout = await self.exec("git commit -m . --dry-run --short -o .");
				await self.exec("git reset HEAD");
			}
			else
			{
				stdout = await self.exec("git status -s .");
			}

			//console.log(666, stdout);

			return stdout;
		},

		async git_status(mode)
		{
			const stdout = await self._git_status(mode);

			const data = self.parse_status(stdout);

			return data;
		},

		async _git_status_renames()
		{
			let stdout = await self._git_status(-1);

			let data = self.parse_status(stdout, {
					renames_only: true,
				}
			);

			return data;
		},

		async git_status_renames(data)
		{
			if (!data || !data instanceof Promise)
			{
				data = await self.git_status(0);
			}

			let data_rename = await self._git_status_renames();

			let arr_rename = self._get_status_rename_list(data_rename);

			data = self.status_filter(data, {
				ignore_untracked: true,
				ignore_not_staged: true,
			});

			for (let k in data)
			{
				data[k] = data[k].filter((value) =>
				{
					if (arr_rename.old.includes(value) || arr_rename.new.includes(value))
					{
						return false;
					}

					return true;
				});

				if (!data[k].length)
				{
					delete data[k];
				}
			}

			let ret = Object.assign({}, data_rename, data);

			ret[self.Symbol] = arr_rename;

			return ret;

			/*
			//return [Object.assign({}, data_rename, data), arr_rename];
			////return data;

			arr_rename.data = Object.assign({}, data_rename, data);
			return arr_rename;
			*/
		},

		_get_status_rename_list(data_rename)
		{
			if (!Array.isArray(data_rename))
			{
				data_rename = self.status_filter(data_rename, {
						renames_only: true,
					}
				);

				data_rename = Object.values(data_rename).reduce((a, b) =>
					{
						return a.concat(b);
					}, []
				);
			}

			let data = {
				old: [],
				new: [],

				map: {},
			};

			for (let row of data_rename)
			{
				let a = row.split(' -> ');

				a[0] = self.str_unwrap(a[0]);
				a[1] = self.str_unwrap(a[1]);

				data.old.push(a[0]);
				data.new.push(a[1]);

				data.map[a[0]] = a[1];
			}

			return data;
		},

	}
);
