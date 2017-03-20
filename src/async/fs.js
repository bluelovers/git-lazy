/**
 * Created by user on 2017/3/20.
 */

const _fs = require('fs');
const Promise = require("bluebird");

const fs = module.exports = Object.assign(Promise.promisifyAll(_fs), {

});
