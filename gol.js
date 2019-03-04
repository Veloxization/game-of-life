var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var startButton = document.getElementById("startButton");
var started = false; // Keeps track if simulation is started or stopped

// Creates a table of cells, each containing its status (false = dead, true = alive) and the number of neighbors (counted in simulation)
var cells = [];

for (var i = 0; i < 80; i++) {
    cells[i] = [];
}

for (var x = 0; x < 80; x++) {
    for (var y = 0; y < 80; y++) {
        cells[x][y] = { status: false, neighbors: 0 };
    }
}

// Draws a cell, changing its presentation to black
function drawCell(x, y) {
    cells[x][y].status = true;
    ctx.beginPath();
    ctx.fillRect(x*5, y*5, 5, 5);
    ctx.fillStyle = "black";
    ctx.closePath();
}

// Kills a cell, changing its presentation to white
function killCell(x, y) {
    cells[x][y].status = false;
    ctx.beginPath();
    ctx.fillRect(x*5, y*5, 5, 5);
    ctx.fillStyle = "white";
    ctx.closePath();
}

// Kills and draws random cells
function randomize() {
    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            cells[x][y].status = Math.random() >= 0.5;
            if (cells[x][y].status) drawCell(x, y);
            else killCell(x, y);
        }
    }
}

// Runs when start/stop button is pressed, starting or stopping the simulation accordingly
var interval;
function start() {
    started = !started;
    if (started) {
        startButton.innerHTML = "Stop";
        interval = setInterval(simulate, 100);
    } else {
        startButton.innerHTML = "Start";
        clearInterval(interval);
    }
}

function simulate() {
    // Check number of neighbors
    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            // Checks that cells are properly drawn or killed
            if (cells[x][y].status) drawCell(x, y);
            else killCell(x, y);

            cells[x][y].neighbors = 0;
            // Upper left neighbor, ignore if x = 0 or y = 0
            if (x != 0 && y != 0) {
                if (cells[x-1][y-1].status) cells[x][y].neighbors += 1;
            }
            // Left neighbor, ignore if x = 0
            if (x != 0) {
                if (cells[x-1][y].status) cells[x][y].neighbors += 1;
            }
            // Lower left neighbor, ignore if x = 0 or y = 79
            if (x != 0 && y != 79) {
                if (cells[x-1][y+1].status) cells[x][y].neighbors += 1;
            }
            // Lower neighbor, ignore if y = 79
            if (y != 79) {
                if (cells[x][y+1].status) cells[x][y].neighbors += 1;
            }
            // Lower right neighbor, ignore if x = 79 or y = 79
            if (x != 79 && y != 79) {
                if (cells[x+1][y+1].status) cells[x][y].neighbors += 1;
            }
            // Right neighbor, ignore if x = 79
            if (x != 79) {
                if (cells[x+1][y].status) cells[x][y].neighbors += 1;
            }
            // Upper right neighbor, ignore if x = 79 or y = 0
            if (x != 79 && y != 0) {
                if (cells[x+1][y-1].status) cells[x][y].neighbors += 1;
            }
            // Upper neighbor, ignore if y = 0
            if (y != 0) {
                if (cells[x][y-1].status) cells[x][y].neighbors += 1;
            }
        }
    }

    for (var x = 0; x < 80; x++) {
        for (var y = 0; y < 80; y++) {
            // Kill live cells with less than two or more than three neighbors
            if (cells[x][y].status && (cells[x][y].neighbors < 2 || cells[x][y].neighbors > 3)) killCell(x, y);
            // Create cell on an empty cell with three neighbors
            else if (!cells[x][y].status && cells[x][y].neighbors === 3) drawCell(x, y);
        }
    }
}