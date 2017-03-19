/**
 * Created by user on 2017/3/19.
 */

'use strict';

const local_dev = require('./_local-dev.js');
const lib = require('../src/util/cli/argv.js');

describe(path_relative(__filename), function ()
{
	let map = [
		[
			[`my-test-node 1 23     46 7 "789"" " '77"7'' 4'`],
			['my-test-node', '1', '23', '46', '7', '789 ', '77"7 4'],
			`my-test-node 1 23 46 7 "789 " '77"7 4'`,
		],
	];

	describe('parse', function ()
	{
		const fn = lib[this.title];

		map.forEach(function (v)
		{
			it(`${v[1]} = ${v[0][0]}`, () =>
			{
				expect(fn(...v[0])).to.deep.equal(v[1]);
			}
			);
		}
		)
	}
	);

	describe('stringify', function ()
	{
		const fn = lib[this.title];

		map.forEach(function (v)
		{
			it(`${v[1]} = ${v[0][0]}`, () =>
			{
				expect(fn(v[1])).to.equal(v[2]);
			}
			);
		}
		)
	}
	);

	describe('parse = stringify', function ()
	{
		map.forEach(function (v)
		{
			it(`${v[1]} = ${v[0][0]}`, () =>
			{
				let r1 = lib.parse(...v[0]);
				assert.deepEqual(r1, lib.parse(lib.stringify(r1)));

				assert.deepEqual(r1, v[1]);

				let r2 = lib.stringify(v[1]);
				assert.deepEqual(r2, lib.stringify(lib.parse(r2)));

				assert.deepEqual(r2, v[2]);
			}
			);
		}
		)
	}
	);
}
);
