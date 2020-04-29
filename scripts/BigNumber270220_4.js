

var notation = 1;


function BigNum(base, power) {
	this.base = base;
	this.power = power;
}

function big(number) {
	return new BigNum(number, 0);
}


var scalePrefixesFULL = ["yocto", "zepto", "atto", "femto", "pico", "nano", "micro", "milli", "", "kilo", "mega", "giga", "tera", "peta", "exa", "zetta", "yotta"];
var scalePrefixes2FULL = ["", "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta", "iota", "kappa"];

var scalePrefixes = ["y", "z", "a", "f", "p", "n", "μ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
var scalePrefixes2 = ["", "α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ"];


var firstPrefixes = ["", " K", " Mil", " Bil", " Tril", " Qa", " Qi", " Sx", " Sp", " Oc", " No"];

var prefixes = ["Dc","Vg","Tg","Qag","Qig","Sxg","Spg","Ocg","Nog"];
var prefixes2 = ["","U","D","T","Qa","Qi","Sx","Sp","Oc","No"];

var option = 1;



function plus(one, two) {
	if (one.power == two.power) {
		var temp = new BigNum(one.base + two.base, one.power);
	} 
	else if (one.power == two.power + 1) {
		var temp = new BigNum(one.base + two.base / Math.pow(10, 150), one.power);
	}
	else if (one.power > two.power + 1) {
		var temp = new BigNum(one.base, one.power);
	}
	else if (two.power > one.power) {
		var temp = plus(two, one);
	}
	normalize(temp);
	return temp;
}

function minus(one, two) {
	return plus(one , new BigNum(-1 * two.base , two.power) );
}


function multiply(one, two) {
	var temp = new BigNum(one.base , one.power);
	temp.base *= two.base;
	temp.power += two.power;
	normalize(temp);
	return temp;
}


function divide(one, two) {
	var temp = new BigNum(one.base , one.power);
	temp.base /= two.base;
	temp.power = Math.max(-1, temp.power - two.power);
	normalize(temp);
	return temp;
}


function pow_func(one, pow) {
	var temp = new BigNum(one.base , one.power);
	if (pow == Infinity) {
		pow = 1;
	}
	if (isNaN(pow)) {
		pow = 1;
	}
	if (pow <= 1) {
		temp.base = Math.pow(temp.base, pow);
		temp.power *= pow;
		normalize(temp);
		return temp;
	}
	else if (pow % 1 != 0) {
		var t_power = pow % 1;
		pow = Math.floor(pow);
		return multiply(pow_func(temp , pow), pow_func(one, t_power));
	}
	else if (pow % 2 == 1) {
		pow = Math.floor(pow / 2);
		temp = multiply(temp, temp);
		return multiply(pow_func(temp , pow), one);
	}
	else {
		pow = pow / 2;
		temp = multiply(temp, temp);
		return pow_func(temp , pow);
	}
}




function ascend(number) {
	if (Math.abs(number.base) > Math.pow(10, 150)) {
		number.base /= Math.pow(10, 150);
		number.power += 1;
	}
}

function descend(number) {
	if (Math.abs(number.base) < 0.9999 && number.power > 0) {
		number.base *= Math.pow(10, 150);
		number.power -= 1;
	}
}

function normalize(number) {
	if (number.power % 1 != 0) {
		number.base *= Math.pow(Math.pow(10, 150), (number.power % 1));
		number.power = Math.floor(number.power);
	}
	ascend(number);
	descend(number);
}


function bigger(num1 , num2) {
	if (num1.power > num2.power) {
		if (num1.base > 0) {
			return true;
		}
		else if (num1.base < 0) {
			return false;
		}
	}
	else if (num1.power < num2.power) {
		if (num1.base > 0) {
			return false;
		}
		else if (num1.base < 0) {
			return true;
		}
		else {
			if (num2.base >= 0) {
				return false;
			}
			else if (num2.base < 0) {
				return true;
			}
		}
	}
	else {
		return num1.base > num2.base;
	}
}

function eq(num1, num2) {
	if (num1.power == num2.power && num1.base == num2.base) {
		return true;
	}
	else return false;
}

function bigger_eq(num1 , num2) {
	return (bigger(num1, num2) || eq(num1, num2));
}

function lower(num1, num2) {
	return bigger(num2, num1);
}

function lower_eq(num1, num2) {
	return bigger_eq(num2, num1);
}

function not_eq(num1, num2) {
	return !eq(num1, num2);
}

function b_min(num1, num2) {
	if (lower(num1, num2)) {
		return num1;
	} else return num2;
}

function b_max(num1, num2) {
	if (bigger(num1, num2)) {
		return num1;
	} else return num2;
}

function b_absmin(num1, num2) {
	if (lower(b_abs(num1), b_abs(num2))) {
		return num1;
	} else return num2;
}

function b_absmax(num1, num2) {
	if (bigger(b_abs(num1), b_abs(num2))) {
		return num1;
	} else return num2;
}

function getVal(num) {
	if (num.power == 0) {
		return Math.min(num.base , 1000000000000);
	}
	else if (num.power > 0) {
		return 1000000000000;
	}
}

function b_abs(num) {
	return new BigNum(Math.abs(num.base), num.power);
}



function logof(a, b) {
	if (a != 0) {
		return Math.log(a) / Math.log(b);
	} else return -999999999;
}

function b_logof(a, b) {
	var log10_1 = a.power*150 + logof(a.base, 10);
	var log10_2 = b.power*150 + logof(b.base, 10);

	return log10_1 / log10_2;
}


function shortD(number) {
	if (number.base > 1 || number.power > 0) {
		var mantise = getVal(divide(number,pow_func(new BigNum(10,0), Math.floor(b_logof(b_abs(number),new BigNum(10, 0)))-2)));
		mantise = Math.round(mantise);
		var _1kpower = Math.floor(b_logof(divide(b_abs(number),big(1.001)), new BigNum(1000,0)));
		var _10power = Math.floor(b_logof(divide(b_abs(number),big(1.001)), new BigNum(10,0)));

		var pref1type = _1kpower % 17;
		var pref2type = Math.floor(_1kpower / 17);
		
		var prefNew = "e" + short_mini(_1kpower*3 - 24);
		var prefNew2 = "e" + short_mini(_10power - 24);

		var pref1 = scalePrefixesFULL[pref1type];
		if (pref2type <= 10) {
			var pref2 = scalePrefixes2FULL[pref2type];
		}
		else {
			var pref2 = "+" + pref2type-10 + "+";
		}
		if (notation == 1) {
			var name = " " + pref2 + pref1 + "meters";
		}
		else if (notation == 3) {
			var name = prefNew + " meters";
		}
		if (notation != 2) {
			if (_10power%3 == 0) {
				return (mantise/100)  + name;
			}
			else if (_10power%3 == 1) {
				return (mantise/10)  + name;
			}
			else if (_10power%3 == 2) {
				return mantise + name;
			}
		}
		else {
			var name = prefNew2 + " meters";
			return (mantise/100) + " " + name;
		}
	}
	else {
		if (notation == 1) {
			return Math.round(number.base*100)/100 + " yoctometers";
		}
		else if (notation == 2) {
			return Math.round(number.base*100)/100 + " e-24 meters";
		}
		else if (notation == 3) {
			return Math.round(number.base*1000)/100 + " e-25 meters";
		}
	}
}


function veryShortD(number) {
	if (number.base > 1 || number.power > 0) {
		var mantise = getVal(divide(number,pow_func(new BigNum(10,0), Math.floor(b_logof(b_abs(number),new BigNum(10, 0)))-2)));
		mantise = Math.round(mantise);
		var _1kpower = Math.floor(b_logof(divide(b_abs(number),big(1.001)), new BigNum(1000,0)));
		var _10power = Math.floor(b_logof(divide(b_abs(number),big(1.001)), new BigNum(10,0)));

		var pref1type = _1kpower % 17;
		var pref2type = Math.floor(_1kpower / 17);
		
		var prefNew = "e" + short_mini(_1kpower*3 - 24);
		var prefNew2 = "e" + short_mini(_10power - 24);

		var pref1 = scalePrefixes[pref1type];
		if (pref2type <= 10) {
			var pref2 = scalePrefixes2[pref2type];
		}
		else {
			var pref2 = "+" + pref2type-10 + "+";
		}

		if (notation == 1) {
			var name = " " + pref2 + pref1 + "m";
		}
		else if (notation == 3) {
			var name = prefNew + "m";
		}
		if (notation != 2) {
			if (_10power%3 == 0) {
				return (mantise/100) + name;
			}
			else if (_10power%3 == 1) {
				return (mantise/10) + name;
			}
			else if (_10power%3 == 2) {
				return mantise + name;
			}
		}
		else {
			var name = prefNew2 + "m";
			return (mantise/100) + name;
		}
	}
	else {
		if (notation == 1) {
			return Math.round(number.base*100)/100 + " ym";
		}
		else if (notation == 2) {
			return Math.round(number.base*100)/100 + "e-24m";
		}
		else if (notation == 3) {
			return Math.round(number.base*1000)/100 + "e-25m";
		}
	}
}


function short(number) {
	if (option == 1) {
		if (number.base > 1 || number.power > 0) {
			var mantise = getVal(divide(number,pow_func(new BigNum(10,0), Math.floor(b_logof(b_abs(number),new BigNum(10, 0)))-2)));
			mantise = Math.floor(mantise);
			if (mantise == 1000) {
				mantise = mantise / 1000;
			}
			if (mantise < 0.9) {
				mantise *= 1000;
			}
			var _1kpower = Math.floor(b_logof(b_abs(number), new BigNum(1000,0)));
			var _10power = Math.floor(b_logof(b_abs(number), new BigNum(10,0)));

			if (notation == 1) {
				if (_1kpower < 11) {
					var pref = firstPrefixes[_1kpower];
					if (_10power%3 == 0) {
						return (mantise/100) + pref;
					}
					else if (_10power%3 == 1) {
						return (mantise/10) + pref;
					}
					else if (_10power%3 == 2) {
						return mantise + pref;
					}
				}
				else {
					var n_1kpower = _1kpower - 11;
					var pref1type = n_1kpower % 10;
					var pref2type = Math.floor(n_1kpower / 10);
					var pref1 = prefixes2[pref1type];
					if (pref2type <= 8) {
						var pref2 = prefixes[pref2type];
					}
					else {
						var pref2 = "#" + short_mini(pref2type-8);
					}
					var name = pref1 + pref2;
					if (_10power%3 == 0) {
						return (mantise/100) + " " + name;
					}
					else if (_10power%3 == 1) {
						return (mantise/10) + " " + name;
					}
					else if (_10power%3 == 2) {
						return mantise + " " + name;
					}
				}
			}
			else if (notation == 3) {
				if (_10power > 3) {
					var prefNew = "e" + short_mini(_1kpower*3);
					if (_10power%3 == 0) {
						return (mantise/100) + prefNew;
					}
					else if (_10power%3 == 1) {
						return (mantise/10) + prefNew;
					}
					else if (_10power%3 == 2) {
						return mantise + prefNew;
					}
				}
				else {
					return Math.round(number.base*100)/100;
				}
			}
			else if (notation == 2) {
				if (_10power > 3) {
					var prefNew2 = "e" + short_mini(_10power);
					if (mantise >= 100) {
						return (mantise/100) + prefNew2;
					}
					else if (mantise >= 10) {
						return (mantise/10) + prefNew2;
					}
					else if (mantise > 1) {
						return mantise + prefNew2;
					}
					else  {
						prefNew2 = "e" + short_mini(_10power+1);
						return mantise + prefNew2;
					}
				}
				else {
					return Math.round(number.base*100)/100;
				}
			}
		}
		else {
			return Math.round(number.base*100)/100;
		}
	}
}




function short_mini(num) {
	if (num < 10000) {
		return num;
	}
	else if (num < 100000) {
		return Math.round(num/100)/10 + "K";
	}
	else if (num < 1000000) {
		return Math.round(num/1000) + "K";
	}
	else if (num < 10000000) {
		return Math.round(num/10000)/100 + "M";
	}
	else if (num < 100000000) {
		return Math.round(num/100000)/10 + "M";
	}
	else if (num < 1000000000) {
		return Math.round(num/1000000) + "M";
	}
	else if (num < 10000000000) {
		return Math.round(num/10000000)/100 + "B";
	}
	else if (num < 100000000000) {
		return Math.round(num/100000000)/10 + "B";
	}
	else if (num < 1000000000000) {
		return Math.round(num/1000000000) + "B";
	}
	else if (num < 10000000000000) {
		return Math.round(num/10000000000)/100 + "T";
	}
	else if (num < 100000000000000) {
		return Math.round(num/100000000000)/10 + "T";
	}
	else {
		return Math.round(num/1000000000000) + "T";
	}
}
