
/** --------------------------------------------
 * Globals
 -------------------------------------------- */

// grid size
g = 20;
grid = [];

// background
background = document.getElementById('background');
backgroundCtx = background.getContext('2d');

background.width = ww = window.innerWidth;
background.height = wh = window.innerHeight;

// get element and context
canvas = document.getElementById('c');
c = canvas.getContext('2d');

// set size
canvas.width = w = 600;
canvas.height = h = 400;

// game elements
objects = [];
currentObject = 'table';
buttons = [];

/** --------------------------------------------
 * Functions
 * ------------------------------------------ */

function rand(min, max) {
	return ~~(Math.random() * (max - min + 1) + min);
}

function randomNoise() {

    x = 0;
    y = 0;

    width = w;
    height = h;
    alpha = 90;

    var imageData = c.getImageData(x, y, width, height),
        pixels = imageData.data,
        n = pixels.length,
        i = 0;

    while (i < n) {
        pixels[i++] = pixels[i++] = pixels[i++] = (Math.random() * 256) | 0;
        pixels[i++] = alpha;
    }

    c.putImageData(imageData, x, y);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF',
    	color = '#';

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function fillGrid() {

	for (var i = 0; i < w / g; i++) {
		for (var j = 0; j < h / g; j++) {

			grid.push({
				x: i,
				y: j,
				hover: false,
				used: false
			});
		}
	}
}

function drawGrid() {

	c.fillStyle = 'hsla(190, 40%, 50%, .5)'; // light blue
	c.lineWidth = 0.5;

	grid.forEach(function(square) {
		c.strokeStyle = 'hsla(0, 0%, 1%, 0.1)'; // black with low opacity
		c.strokeRect(g * square.x, g * square.y, g, g);

		if (square.hover) {
			c.strokeStyle = 'hsla(214, 44%, 30%, 1)'; // light blue
			c.strokeRect(g * square.x, g * square.y, g, g);
			c.fillRect(g * square.x, g * square.y, g, g);
		}
	});
};

function drawObject(object, x, y) {

	var obj = objectsType[object];

	if (!obj) {
		return;
	}

	obj.art.forEach(function(color, position) {

		c.fillStyle = obj.colors[color];

		c.fillRect(
			(y * g) + ~~(position % obj.width),
			(x * g) + ~~(position / obj.width) - obj.height,
			1, 1);
	});
}

function drawObjectBackground(object, x, y) {

	var obj = objectsType[object];

	if (!obj) {
		return;
	}

	obj.art.forEach(function(color, position) {

		backgroundCtx.fillStyle = obj.colors[color];

		backgroundCtx.fillRect(
			y + ~~(position % obj.width),
			x + ~~(position / obj.width),
			1, 1);
	});
}

function drawRoom(x, y, w, h) {

	c.fillStyle = '#ccc'; // light grey
	c.strokeStyle = '#000'; // black
	c.lineWidth = 2;

	c.fillRect(x * g, y * g, w * g, h * g);
	c.strokeRect(x * g, y * g, w * g, h * g);
}

function getGrid(x, y) {

	var currentGrid;

	grid.map(function(square) {

		if (square.x === x && square.y === y) {
			currentGrid = square;
		}
	});

	return currentGrid;
}

function getMouseGrid(event) {
	var rect = canvas.getBoundingClientRect(),
		x = event.clientX - rect.left,
		y = event.clientY - rect.top;

	return getGrid(~~(x / g), ~~(y / g));
}

function hover(e) {
	grid.forEach(function(square) {
		square.hover = false;
	});

	var mouseSquare = getMouseGrid(e);

	if (mouseSquare) {
		mouseSquare.hover = true;
	}
}

function click(e) {
	var square = getMouseGrid(e);
	newObject(currentObject, square.x, square.y);
}

function newObject(type, x, y) {

	objects.push({
		type: type,
		x: x,
		y: y
	});
}

function drawObjects() {

	objects.sort(function(a, b) {
		return a.y - b.y;
	});

	objects.forEach(function(object) {
		drawObject(object.type, object.y, object.x);
	});
}

function changeObject(object) {
	console.log(object);
	currentObject = object;
}

function createObjectsButtons() {

	for (var obj in objectsType) {
		var i = buttons.length;

		var x = (i * 90) + 30;

		backgroundCtx.fillStyle = '#aaa';
		console.log(i * 100);
		backgroundCtx.fillRect(x, 20, 70, 70);

		backgroundCtx.fillStyle = '#000';
		backgroundCtx.fillText(objectsType[obj].name, x + 10, 40);
		drawObjectBackground(obj, 50, x + 10);

		buttons.push(obj);
	}
}

function drawBackground() {

	var roadH = 70;
	var sideRoadH = 24;

	backgroundCtx.fillStyle = '#87b06b';
	backgroundCtx.fillRect(0, 0, ww, wh);

	backgroundCtx.fillStyle = '#333';
	backgroundCtx.fillRect(0, wh - roadH, ww, roadH);

	backgroundCtx.fillStyle = '#111';
	backgroundCtx.fillRect(0, wh - (roadH + 2), ww, 2);

	backgroundCtx.fillStyle = '#ddd';
	backgroundCtx.fillRect(0, wh - (roadH + 2 + sideRoadH), ww, sideRoadH);

	backgroundCtx.fillStyle = '#ccc';
	backgroundCtx.fillRect(0, wh - (roadH + 2 + sideRoadH + 2), ww, 2);

	for (var i = 0; i < 90; i++) {
		backgroundCtx.fillStyle = 'yellow';
		backgroundCtx.fillRect(i * 100, wh - 10, 35, 2);

		backgroundCtx.fillStyle = '#ccc';
		backgroundCtx.fillRect(i * 30, wh - (roadH + 2 + sideRoadH), 2, sideRoadH);
	}

	// noise
	var noiseSize = 10;

	for (var i = 0; i < ww / noiseSize; i++) {
		for (var j = 0; j < wh / noiseSize; j++) {
			backgroundCtx.fillStyle = 'hsla(0, 0%, 0%, ' + rand(1, 5) / 100 + ')';
			backgroundCtx.fillRect(noiseSize * i, noiseSize * j, noiseSize, noiseSize);
		}	
	}
}

/** --------------------------------------------
 * Update
 * ------------------------------------------ */

function update() {

	// background color
	c.clearRect(0, 0, w, h);

	// room
	drawRoom(9, 2, 18, 16);

	// grid
	drawGrid();

	// objects
	drawObjects();

	// loop again
	requestAnimationFrame(function() {
		update();
	});
}

/** --------------------------------------------
 * Start
 * ------------------------------------------ */

canvas.addEventListener('mousemove', function(e) {
	hover(e);
}, false);

canvas.addEventListener('click', function(e) {
	click(e);
}, false);

backgroundCtx.font = "13px cursive";
c.font = "13px cursive";

drawBackground();
createObjectsButtons();
newObject('stove', 1, 1);
newObject('table', 1, 3);
fillGrid();
update();
