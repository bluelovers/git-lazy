/**
 * Created by user on 2017/4/9.
 */

'use strict';

const LF = "\n";
const fs = require('../async/fs');
const path = require('upath2');

const self = module.exports = Object.assign(require("."), {

	git_gc2()
	{
		return self.execEach([
				`git count-objects`,
				// FIXME git gc, git fsck --full output is empty
				`git gc`,
				`git fsck --full`,
				`git count-objects`,
			], {
				throw_error: false,
				allow_empty: true,
			}
		)
		.then((res) =>
			{
				//return res.res.join(LF + LF);
				return `Before: ${res.res.shift()}; After: ${res.res.pop()}`;
			}
		);
	},

});
