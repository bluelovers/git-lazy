/**
 * Created by user on 2017/3/19.
 */

'use strict';

const self = {

	split(s)
	{
		return (s).toString().split('');
	},

	encode(s)
	{
		return self.split(s).map(function (v)
			{
				let s = Buffer.from(v);

				if (s.length > 1 || (s.length == 1 && s[0] >= 0x7F))
				{
					let t = '';

					for (let b of s.entries())
					{
						t = t + '\\' + b[1].toString(8);
					}

					return t;
				}

				return v;
			}
		).join('');
	},

	decode(s)
	{
		var matches = [];

		let t = '';
		let i2 = 0
			, b = []
			;

		let arr;
		let r = /(?:\\(\d{3}))/g;

		while (arr = r.exec(s))
		{
			//let extras = arr.splice(-2);

			/*
			 arr.i2 = i2;
			 arr.lastIndex = r.lastIndex;
			 console.log([arr, s.length, t, b, s.substr(i2, arr.index)]);
			 */

			if (i2 != arr.index)
			{

				if (b.length)
				{
					t += Buffer.from(b).toString();
					b = [];
				}

				t += s.substr(i2, arr.index - i2);
			}

			//i2 = arr.index + arr[0].length;
			i2 = r.lastIndex;

			b.push(parseInt(arr[1], 8));
		}

		//console.log([t, b]);

		if (b.length)
		{
			t += Buffer.from(b).toString();
			b = [];
		}

		if (i2 > -1 && i2 < s.length)
		{
			t += s.substr(i2, s.length - i2);
		}

		return t;
	},

};

Object.assign(module.exports, self);
