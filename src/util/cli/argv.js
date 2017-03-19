/**
 * Created by user on 2017/3/19.
 */

module.exports.parse = parse;
module.exports.stringify = stringify;

function stringify(arr)
{
	let regexp_space = /[\s\uFEFF\xA0]+/u;

	return arr.reduce(function (a, b)
		{
			if (regexp_space.test(b))
			{
				let c = '"';
				if (/(?!\\)["]/u.test(b))
				{
					c = "'";
				}
				b = c + b + c;
			}

			if (a != '')
			{
				b = ' ' + b;
			}

			return a + b;
		}, ''
	)
}

function parse(input, options = {
	node_argv: 1
}
)
{
	let regexp = /(?!\\)["']|[\s\uFEFF\xA0]+/ug;
	let regexp_space = /[\s\uFEFF\xA0]+/u;

	let _do = true;
	let _c = {
		lastIndex: 0,
		in_string: null,
		s: null,
	};

	//console.log([input]);

	let arr = [];

	label_2: while (_do)
	{
		_c.s = null;

		let m = regexp.exec(input);

		_do = !!m;

		if (m)
		{
			switch (m[0])
			{
				case '"':
				case "'":
					if (!_c.in_string)
					{
						_c.in_string = m[0];
					}
					else if (_c.in_string == m[0])
					{
						_c.in_string = false;

						_c.s = input.substr(_c.lastIndex, m.index - _c.lastIndex);

						if (options.node_argv && _c.lastIndex_string
							&& (regexp.lastIndex - m.index) == 1
							&& (_c.lastIndex - _c.lastIndex_string) == 1
						)
						{
							arr[arr.length - 1] += _c.s;
						}
						else
						{
							arr.push(_c.s);
						}

						_c.lastIndex_string_old = _c.lastIndex_string;
						_c.lastIndex_string = regexp.lastIndex;
					}
					else if (_c.in_string)
					{
						continue label_2;
					}

					break;
				default:
					if (_c.in_string)
					{
						continue label_2;
					}
					else if (regexp_space.test(m[0]))
					{
						if (m.index - _c.lastIndex > 0)
						{
							_c.s = input.substr(_c.lastIndex, m.index - _c.lastIndex);

							arr.push(_c.s)
						}
						else
						{
							//regexp.lastIndex++;
						}
					}

					break;
			}

			_c.lastIndex_old = _c.lastIndex;
			_c.lastIndex = regexp.lastIndex;

			delete m.input;
		}

		//console.log([_do, m, _c]);
	}

	if (_c.lastIndex < input.length - 1)
	{
		_c.s = input.substr(_c.lastIndex);

		arr.push(_c.s)
	}

	//console.log(arr);

	return arr;
}
