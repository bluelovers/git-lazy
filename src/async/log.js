/**
 * Created by user on 2017/3/20.
 */

module.exports.log = log;

function log(...ps)
{
	return Promise.mapSeries(ps, (item, index) => {
		return item
	}).then(res => {
		console.log(...res);
	}).catch((err) =>
		{
			//console.log(err);

			throw err;
		}
	);

	/*
	 let s = await p;

	 console.log(s);
	 */
}
