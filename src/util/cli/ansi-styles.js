/**
 * Created by user on 2017/3/22.
 */

'use strict';

const ansiStyles = require('ansi-styles');

function assembleStyles()
{
	var styles = {
		colors: {
			black: [30, 39],
			red: [31, 39],
			green: [32, 39],
			yellow: [33, 39],
			blue: [34, 39],
			magenta: [35, 39],
			cyan: [36, 39],
			white: [37, 39],
			gray: [90, 39]
		},
		bgColors: {
			bgBlack: [40, 49],
			bgRed: [41, 49],
			bgGreen: [42, 49],
			bgYellow: [43, 49],
			bgBlue: [44, 49],
			bgMagenta: [45, 49],
			bgCyan: [46, 49],
			bgWhite: [47, 49]
		}
	};

	const plus = 'Plus';

	Object.keys(styles).forEach(function (groupName)
		{
			let group = ansiStyles[groupName + plus] = {};

			Object.keys(styles[groupName]).forEach(function (styleName)
				{
					var style = styles[groupName][styleName];

					if (31 <= style[0] && style[0] <= 37 || 40 <= style[0] && style[0] <= 47)
					{
						ansiStyles[styleName + plus] = group[styleName + plus] = {
							open: '\u001b[' + (style[0] + 60) + 'm',
							close: '\u001b[' + (style[1] + 0) + 'm'
						};
					}
				}
			);

			//console.log(group);

			Object.defineProperty(ansiStyles, groupName + plus, {
					value: group,
					enumerable: false
				}
			);
		}
	);

	return ansiStyles;
}

Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	}
);
