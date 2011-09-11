
define(['Base/Utility/typeOf', 'Base/Data/Accessor', 'Base/Host/Array'], function(typeOf, Accessor, Array){

var limit = function(num, min, max){
	return Math.min(max, Math.max(min, num));
};

var Color = function(color, type){

	switch(typeOf(color)){
		case 'string':
			var namedColor = Color.lookupColor(color);
			if (namedColor){
				color = namedColor;
				type = 'hex';
			} else if (!type){
				type = (type = color.match(/^rgb|^hsb/)) ? type[0] : 'hex';
			}
		break;
		case 'color': color = [color.red, color.green, color.blue, color.alpha]; type = null; break;
		case 'array': type = type || 'rgb'; color = color.toString(); break;
		case 'number': type = 'hex'; color = color.toString(16); break;
	}

	if (type) color = Color['parse' + type.toUpperCase()](color);
	this.red = color[0];
	this.green = color[1];
	this.blue = color[2];
	this.alpha = color[3];

};

Accessor.call(Color, 'Color');

Color.defineColors({
	maroon: '#800000', red: '#ff0000', orange: '#ffA500', yellow: '#ffff00', olive: '#808000',
	purple: '#800080', fuchsia: "#ff00ff", white: '#ffffff', lime: '#00ff00', green: '#008000',
	navy: '#000080', blue: '#0000ff', aqua: '#00ffff', teal: '#008080',
	black: '#000000', silver: '#c0c0c0', gray: '#808080'
});

var listMatch = /([-.\d]+)\s*,\s*([-.\d]+)\s*,\s*([-.\d]+)\s*,?\s*([-.\d]*)/,
	hexMatch = /^#?([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{0,2})$/i;

Color.parseRGB = function(color){
	return Array.map(color.match(listMatch).slice(1), function(bit, i){
		return (i < 3) ? Math.round(((bit %= 256) < 0) ? bit + 256 : bit) : limit((bit === '') ? 1 : Number(bit), 0, 1);
	});
};

Color.parseHEX = function(color){
	if (color.length == 1) color = color + color + color;
	return Array.map(color.match(hexMatch).slice(1), function(bit, i){
		if (i == 3) return (bit) ? parseInt(bit, 16) / 255 : 1;
		return parseInt((bit.length == 1) ? bit + bit : bit, 16);
	});
};

Color.parseHSB = function(color){
	var hsb = Array.map(color.match(listMatch).slice(1), function(bit, i){
		if (i === 0) return Math.round(((bit %= 360) < 0) ? (bit + 360) : bit);
		else if (i < 3) return limit(Math.round(bit), 0, 100);
		else return limit((bit === '') ? 1 : Number(bit), 0, 1);
	});

	var a = hsb[3];
	var br = Math.round(hsb[2] / 100 * 255);
	if (hsb[1] == 0) return [br, br, br, a];

	var hue = hsb[0];
	var f = hue % 60;
	var p = Math.round((hsb[2] * (100 - hsb[1])) / 10000 * 255);
	var q = Math.round((hsb[2] * (6000 - hsb[1] * f)) / 600000 * 255);
	var t = Math.round((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000 * 255);

	switch (Math.floor(hue / 60)){
		case 0: return [br, t, p, a];
		case 1: return [q, br, p, a];
		case 2: return [p, br, t, a];
		case 3: return [p, q, br, a];
		case 4: return [t, p, br, a];
		default: return [br, p, q, a];
	}
};

var toString = function(type, array){
	if (array[3] != 1) type += 'a';
	else array.pop();
	return type + '(' + array.join(', ') + ')';
};

Color.prototype = {

	toHSB: function(array){
		var red = this.red, green = this.green, blue = this.blue, alpha = this.alpha;

		var max = Math.max(red, green, blue), min = Math.min(red, green, blue), delta = max - min;
		var hue = 0, saturation = (max != 0) ? delta / max : 0, brightness = max / 255;
		if (saturation){
			var rr = (max - red) / delta, gr = (max - green) / delta, br = (max - blue) / delta;
			hue = (red == max) ? br - gr : (green == max) ? 2 + rr - br : 4 + gr - rr;
			if ((hue /= 6) < 0) hue++;
		}

		var hsb = [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100), alpha];

		return (array) ? hsb : toString('hsb', hsb);
	},

	toHEX: function(array){

		var a = this.alpha;
		var alpha = ((a = Math.round((a * 255)).toString(16)).length == 1) ? a + a : a;

		var hex = Array.map([this.red, this.green, this.blue], function(bit){
			bit = bit.toString(16);
			return (bit.length == 1) ? '0' + bit : bit;
		});

		return (array) ? hex.concat(alpha) : '#' + hex.join('') + ((alpha == 'ff') ? '' : alpha);
	},

	toRGB: function(array){
		var rgb = [this.red, this.green, this.blue, this.alpha];
		return (array) ? rgb : toString('rgb', rgb);
	}

};

Color.prototype.toString = Color.prototype.toRGB;

Color.hex = function(hex){
	return new Color(hex, 'hex');
};

Color.hsb = function(h, s, b, a){
	return new Color([h || 0, s || 0, b || 0, (a == null) ? 1 : a], 'hsb');
};

Color.rgb = function(r, g, b, a){
	return new Color([r || 0, g || 0, b || 0, (a == null) ? 1 : a], 'rgb');
};

return Color;

});
