/**
 * Created by user on 2017/3/20.
 */

const lib = Object.assign(module.exports, {

	iifv(...a)
	{
		for (let v of a)
		{
			if (typeof v != "undefined")
			{
				return v;
			}
		}

		return void(0);
	},

	sort_by_key_order: require("./object/sort.js").sort_by_key_order,

});
