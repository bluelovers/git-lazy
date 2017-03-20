/**
 * Created by user on 2017/3/20.
 */

'use strict';

const glob = require("glob");
const self = module.exports;

glob.sync("./*.js", {
	ignore: [
		"./index.js"
	],
	cwd: __dirname,
}).forEach((file) => {
	//console.log(file);
	require(file);
});
