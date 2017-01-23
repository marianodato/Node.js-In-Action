var canadianDollar = 0.91;

function roundTwoDecimals(amount) {
  	return Math.round(amount * 100) / 100;
}

exports.canadianToUS = function(canadian) { //canadianToUS function is set in exports module so it can be used by code requiring this module
	return roundTwoDecimals(canadian * canadianDollar);
}

exports.USToCanadian = function(us) { //USToCanadian function is also set in exports module
	return roundTwoDecimals(us / canadianDollar);
}