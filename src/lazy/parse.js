/**
 * Created by user on 2017/3/20.
 */

'use strict';

const LF = "\n";
const lazy_util = require("../util");
const lazy_crypt = require("../crypt/git");

const self = module.exports = Object.assign(require("."), {

	status_map: {
		'R ': 'renamed',
		'M ': 'modified',
		'A ': 'new file',
		'AM': 'new file - modified',
		'D ': 'deleted',
		' R': 'renamed - Changes not staged for commit',
		' M': 'modified - Changes not staged for commit',
		' A': 'new file - Changes not staged for commit',
		' D': 'deleted - Changes not staged for commit',
		'??': 'Untracked files',
	},

	status_map_sort: ['R ', 'M ', 'A ', 'AM', 'D ', ' R', ' M', ' A', ' D', '??'],

	status_map2: {
		'R': 'renamed',
		'M': 'modified',
		'A': 'new file',
		'D': 'deleted',
		' ': 'Changes not staged for commit',
		'?': 'Untracked files',
	},

	status_map2_sort: ['R', 'M', 'A', 'D', ' ', '?'],

	git_decode: lazy_crypt.decode,
	git_encode: lazy_crypt.encode,
	str_split: lazy_crypt.split,

	get_status_desc(s)
	{
		let ret = '';

		if (s in self.status_map)
		{
			return self.status_map[s];
		}

		if (s[0] in self.status_map2)
		{
			ret += self.status_map2[s[0]];
		}
		else
		{
			throw `unknow ${s[0]} at ${s}`;
		}

		if (s[1] != ' ' && s[1] != '?')
		{
			if (s[1] in self.status_map2)
			{
				ret += ' - ' + self.status_map2[s[1]];
			}
			else
			{
				throw `unknow ${s[1]} at ${s}`;
			}
		}

		return ret;
	},

	stdout_trim(stdout)
	{
		return stdout.replace(/\r\n|\r/g, LF).replace(/^[\s\n]*\n+|[\n\s]+$/g, '');
	},

	str_unwrap(s, c = '"')
	{
		if (s.indexOf(c) == 0 && s.indexOf(c, s.length - c.length) != -1)
		{
			return s.substr(c.length, s.length - (c.length * 2));
		}

		return s;
	},

	str_wrap(s, c = '"')
	{
		if (s.indexOf(' ') != -1 && !/^["']/.test(s))
		{
			return c + s + c;
		}

		return s;
	},

	parse_status(stdout, options = {}, sort = false)
	{
		options = Object.assign({

				ignore_untracked: false,
				ignore_not_staged: false,

				renames_only: false,

			}, options
		);

		options.sort = lazy_util.iifv(options.sort, sort);

		let data = {};

		//console.log(777, stdout);

		self.stdout_trim(stdout).split(LF).forEach(function (v)
			{
				let m = v.match(/^(?:\s{2}|\t)*([\s\S]{2})\s+(.+)\s*$/);

				if (m)
				{
					if (m[2].match(/^\"(.+)\"\s*$/))
					{
						m[2] = self.git_decode(RegExp.$1);
					}

					(m[1] in data || (data[m[1]] = []), data[m[1]]).push(m[2]);
				}
				else
				{
					console.error([v]);
				}
			}
		);

		/*
		if (options.renames_only)
		{
			let data2 = {};

			Object.keys(data).forEach(function (v)
				{
					if (v.indexOf('R') != -1)
					{
						data2[v] = data[v];
					}
				}
			);

			data = data2;
		}
		else
		{
			if (options.ignore_untracked)
			{
				delete data['??'];
			}

			if (options.ignore_not_staged)
			{
				Object.keys(data).forEach(function (v)
					{
						if (v.indexOf(' ') == 0)
						{
							delete data[v];
						}
					}
				);
			}
		}

		if (options.sort)
		{
			data = lazy_util.sort_by_key_order(data, self.status_map_sort);
		}
		*/
		data = self.status_filter(data, options);

		return data;
	},

	status_filter(data, options = {})
	{
		options = Object.assign({

				ignore_untracked: false,
				ignore_not_staged: false,

				renames_only: false,

			}, options
		);

		let data2 = {};

		if (options.renames_only)
		{
			data2 = {};

			Object.keys(data).forEach(function (v)
				{
					if (v.indexOf('R') != -1)
					{
						data2[v] = data[v];
					}
				}
			);
		}
		else
		{
			data2 = Object.assign({}, data);

			if (options.ignore_untracked)
			{
				delete data2['??'];
			}

			if (options.ignore_not_staged)
			{
				Object.keys(data2).forEach(function (v)
					{
						if (v.indexOf(' ') == 0)
						{
							delete data2[v];
						}
					}
				);
			}
		}

		if (options.sort)
		{
			data2 = lazy_util.sort_by_key_order(data2, self.status_map_sort);
		}

		return data2;
	},

	status_stringify(data, options = {})
	{
		options = Object.assign({
			ignore_untracked: true,
			ignore_not_staged: false,
		}, options, {
			sort: true,
		});

		//data = lazy_util.sort_by_key_order(data, self.status_map_sort);

		data = self.status_filter(data, options);

		let output = '';

		for (let k in data)
		{
			if (!data[k].length)
			{
				continue;
			}

			let desc = self.get_status_desc(k);

			output += `[${k}] ${desc} (${data[k].length}):\n\n`;

			for (let v of data[k])
			{
				output += `\t${v}\n`;
			}

			output += LF;
		}

		return output;
	},

});
