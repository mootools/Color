define(['Color'], function(Color){
	
	var color = new Color('#F90');
	var outputters = [
		'getHex', 
		'getRGB', 
		'getPRGB', 
		'getRGBA', 
		'getPRGBA', 
		'getHSL', 
		'getHSLA', 
		'red', 
		'green', 
		'blue', 
		'alpha', 
		'hue', 
		'saturation', 
		'lightness', 
		'brightness', 
		'decimal'
	];
	
	var log = function(message){
		console.log('Parsing ' + JSON.stringify(message));
		for(var i = 0, l = outputters.length; i < l; i++){
			var method = outputters[i];
			console.log('-- ' + method + '=' + color[method]());
		};
	};
	
	var inputs = [
		'#FF0000',
		'FF0000', 
		'#F00', 
		'F00', 
		123456, 
		'rgb(255, 103, 0)', 
		'rgb(100%, 60%, 0%)',
		'rgba(255, 103, 0, 0.5)', 
		'rgba(100%, 60%, 0, 0.5)',
		'hsl(360, 100%, 73%)', 
		'hsla(360, 100%, 73%, 0.5)',
		'orange',
		{
			red : 255,
			green : 153,
			blue: 0
		}
	];
	
	for(var i = 0, l = inputs.length; i < l; i++){
		var input = inputs[i];
		color.parse(input);
		log(input);
	};
	
	
	console.log('Updating unrelated components will automatically update all other component values...');
	console.log('setting to purplish...  7766CC');
	color.parse('#7766CC');
	console.log('brightness is ' + color.brightness());
	console.log('lightness is ' + color.lightness());
	console.log('now increase the red component to max...');
	color.red(255);
	console.log('and both brightness and lightness will have been updated, even though only the red component has been set');
	console.log('brightness is ' + color.brightness());
	console.log('lightness is ' + color.lightness());	
	
	
	console.log('Color will attempt to understand the format of input, and reproduct that format in subsequent calls to toString');
	console.log('--instancing Color with rgba: rgba(255, 100, 0, 0.5)');
	color = new Color('rgba(255, 100, 0, 0.5)');
	console.log('--' + color.toString());
	console.log('--' + color.getHex());
	
	
});