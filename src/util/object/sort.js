/**
 * Created by user on 2017/3/19.
 */

'use strict';

module.exports.sort_by_key_order = sort_by_key_order;

function sort_by_key_order(arr, keys, safe)
{
	if (safe)
	{
		let temp = {};
		let ks = Object.keys(arr);

		ks.forEach(function (v)
			{
				temp[v] = arr[v];
				delete arr[v];
			}
		);

		[].concat(keys, ks).forEach(function (v)
			{
				if (v in temp)
				{
					arr[v] = temp[v];
					delete temp[v];
				}
			}
		);

		return arr;
	}

	return Object.assign(keys.reduce((a, b) =>
		{
			if (b in arr)
			{
				a[b] = undefined;
			}

			return a;
		}, {}
		), arr
	)
}
