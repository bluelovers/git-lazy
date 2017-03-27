/**
 * Created by user on 2017/3/22.
 */

const ansiStyles = require('ansi-styles');
const escapeStringRegexp = require('escape-string-regexp');
//const chalk = require('chalk');
const supportsColor = require('supports-color');

const isSimpleWindowsTerm = process.platform === 'win32' && !/^xterm/i.test(process.env.TERM);

class lazyConsole extends console.Console
{

	constructor(stdout = process.stdout, stderr = process.stderr, options = {})
	{
		super(stdout, stderr);

		this.enabled = !options || options.enabled === undefined ? supportsColor : options.enabled;

		//this._colors = this._colors;
	}

	static create(...argv)
	{
		return new lazyConsole(...argv);
	}

}

{
	const defineProps = Object.defineProperties;

	let styles = (function ()
	{
		let ret = {};

		Object.keys(ansiStyles).forEach(function (key)
			{
				ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
				ansiStyles[key].name = key;

				//console.log(ansiStyles[key]);

				ret[key] = {
					get: function ()
					{
						return build.call(this, this._styles.concat(key));
					}
				};
			}
		);

		return ret;
	})();

	//console.log(chalk.styles);

	let proto = defineProps(lazyConsole, styles);

	let methods_skip = ['constructor', 'Console', 'time', 'timeEnd',];

	let methods = Object.keys(console).reduce((a, method) =>
		{
			if (typeof console[method] == "function" && !methods_skip.includes(method))
			{
				lazyConsole.prototype['__' + method] = lazyConsole.prototype[method];
				proto['__' + method] = lazyConsole.prototype['__' + method];

				a.push(method);
			}

			return a;

		}, []
	);

	function build(_styles)
	{
		var builder = function (...argv)
		{
			return applyStyle.call(builder, '__' + 'log', argv);
		};

		//this.log(888, arguments.callee.caller.caller, _styles);

		let self = this;

		builder._self = self;

		builder._stdout = self._stdout;
		builder._stderr = self._stderr;

		builder._styles = _styles;
		builder.enabled = this.enabled;

		/*
		builder._open = function ()
		{
			//
		};

		builder._close = function ()
		{
			//
		};
		*/

		//builder._ = this._;
		// __proto__ is used because we must return a function, but there is
		// no way to create a function with a different prototype.
		/* eslint-disable no-proto */

		methods.forEach((method) =>
			{
				//builder['__' + method] = self.__proto__[method];

				builder[method] = function (...argv)
				{
					//console.log(888, arguments.callee.caller.caller, _styles);

					return applyStyle.call(builder, '__' + method, argv);
				};

				//builder[method].__proto__ = proto;
			}
		);

		builder.__proto__ = proto;

		return builder;
	}

	function applyStyle(method, argv)
	{
		if (!this.enabled || !argv.length)
		{
			//console.log(this._self, method, this._self[method], this._self.__info, this.__info);

			return this._self[method](...argv);
		}

		let nestedStyles = this._styles;
		let i = 0;

		let originalDim = ansiStyles.dim.open;
		if (isSimpleWindowsTerm && (nestedStyles.indexOf('gray') !== -1 || nestedStyles.indexOf('grey') !== -1))
		{
			ansiStyles.dim.open = '';
		}

		for (i = 0; i < nestedStyles.length; i++)
		{
			let code = ansiStyles[nestedStyles[i]];

			//console.dir(code.open);

			this._self._stdout.write(code.open);
		}

		//console.log(this._self, method, this._self[method]);

		let ret = this._self[method](...argv);

		i--;

		for (i; i >= 0; i--)
		{
			let code = ansiStyles[nestedStyles[i]];

			this._self._stdout.write(code.close);
		}

		ansiStyles.dim.open = originalDim;

		return ret;
	}

	function init()
	{
		var ret = {};

		let self = this;

		Object.keys(styles).forEach(function (name)
			{
				ret[name] = {
					get: function ()
					{
						return build.call(this, [name]);
					}
				};
			}
		);

		return ret;
	}

	defineProps(lazyConsole.prototype, init());

	lazyConsole.prototype._colors = {
		warn: 'yellow',
		error: 'red',
		//log: 'white',
		//log: 'reset',
		info: 'white',
		debug: 'cyan',
		success: 'green',
		stress: 'magenta',
	};

	// fix color bug
	methods.forEach((method) =>
		{
			if (!lazyConsole.prototype._colors[method])
			{
				lazyConsole.prototype._colors[method] = 'reset';
			}
		}
	);

	Object.keys(lazyConsole.prototype._colors).forEach((method) =>
		{
			lazyConsole.prototype[method] = function (...argv)
			{
				if (this.enabled && this._colors[method])
				{
					return this[this._colors[method]].apply(this, argv);
				}

				return this[method].apply(this, argv);
			};
		}
	);

	lazyConsole.prototype.Console = lazyConsole;

	module.exports.styles = ansiStyles;
	lazyConsole.prototype.styles = module.exports.styles;

	//console.log(lazyConsole.prototype);
}

module.exports.Console = lazyConsole;
module.exports.isSimpleWindowsTerm = isSimpleWindowsTerm;
//module.exports.chalk = chalk;
module.exports.supportsColor = supportsColor;

