/**
 * Created by user on 2017/3/21.
 */

((_global_) => {

	const gitlazy = require('../lazy');
	const meow = require('meow');

	require('dotenv').config();

	_global_.gitlazy = gitlazy;
	_global_.meow = meow;

})(global);