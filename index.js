const canvas = document.querySelector('canvas'); /// selecting the canvas element from the HTML document
const ctx = canvas.getContext('2d');

canvas.width = 1024;    /// setting the width and height of the canvas
canvas.height = 576;    /// Use 450x zoom in tiled

// COLLISION DATA is loaded from collisions.js in HTML before this script runs
// The collisions array is now available from the global scope

const collisionsMap = []; /// creating an empty array to store the collision data for the map, this will be used to determine where the player can and cannot move on the map.
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, 70 + i)); /// using a for loop to iterate through the collisions array and push the data into the collisionsMap array in chunks of 70, this is because the map is 70 tiles wide, so each chunk of 70 represents one row of the map.
}

const travelMap = []; /// creating an empty array to store the travel data for the map, this will be used to determine where the player can and cannot move on the map.
for (let i = 0; i < travel.length; i+=70) {
    travelMap.push(travel.slice(i, 70 + i)); /// using a for loop to iterate through the travel array and push the data into the travelMap array in chunks of 70, this is because the map is 70 tiles wide, so each chunk of 70 represents one row of the map.
}

const boundaries = []; /// creating an empty array to store the boundary objects for the map, this will be used to determine where the player can and cannot move on the map.
const offset = {
    x: 1325,
    y: 1100
}

function populateBoundaries() {
    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol !== 0) // Any non-zero value is a collision
            boundaries.push(
                new Boundary({position: {
                    // *** FIX: Only use tile coordinates, camera offset is applied in draw() ***
                    x: j * Boundary.width,
                    y: i * Boundary.height
            }}))
        })
    }); /// using a nested forEach loop to iterate through the collisionsMap array and create a new Boundary object for each tile that has a collision, the position of each boundary object is determined by its index in the collisionsMap array, multiplied by the size of each tile (72 pixels in this case). The boundary objects are then pushed into the boundaries array.
}

// Populate boundaries after collision map is ready
populateBoundaries();


const travelPoints = []; /// creating an empty array to store the travel point objects for the map, this will be used to determine where the player can and cannot move on the map.

function populateTravelPoints() {
    travelMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol !== 0) // Any non-zero value is a travel point
            travelPoints.push(
                new TravelPoint ({position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
            }}))
        })
    }); /// using a nested forEach loop to iterate through the travelMap array and create a new TravelPoint object for each tile that has a travel point, the position of each travel point object is determined by its index in the travelMap array, multiplied by the size of each tile (72 pixels in this case). The travel point objects are then pushed into the travelPoints array.
}

// Populate travel points after travel map is ready
populateTravelPoints();



const image = new Image(); /// creating a new image object for the map
image.src = './game-assets/map-game.png'; /// Update this path if your image file is different
image.onload = () => console.log('Map image loaded');
image.onerror = () => console.error('Failed to load map image:', image.src);

const fgimage = new Image(); /// creating a new image object for the map
fgimage.src = './game-assets/foregroundobj.png'; /// Update this path if your image file is different
fgimage.onload = () => console.log('Foreground image loaded');
fgimage.onerror = () => console.error('Failed to load foreground image:', fgimage.src);

const fgimage2 = new Image(); /// creating a new image object for the map
fgimage2.src = './game-assets/foregroundobj-2.png'; /// Update this path if your image file is different
fgimage2.onload = () => console.log('Foreground-2 image loaded');
fgimage2.onerror = () => console.error('Failed to load foreground-2 image:', fgimage2.src);





// Load directional player sprites
const playerDown = new Image();
playerDown.src = './game-assets/player-assets/player-down.png';

const playerUp = new Image();
playerUp.src = './game-assets/player-assets/player-up.png';

const playerLeft = new Image();
playerLeft.src = './game-assets/player-assets/player-left.png';

const playerRight = new Image();
playerRight.src = './game-assets/player-assets/player-right.png';

// Keep track of the current player image
let plyerImage = playerDown;
plyerImage.onload = () => console.log('Player image loaded');
plyerImage.onerror = () => console.error('Failed to load player image:', plyerImage.src);





const bg = new Sprite({
    position: {
        x: -offset.x,
        y: -offset.y
    },
    image: image
});

const player = new Sprite({
    position: {
        x: canvas.width/2 - 1008/(2 * 7),
        y: canvas.height/2 - 80/2
    },
    image: plyerImage,
    frames: { max: 7 }
});

const fg2 = new Sprite({
    position: {
        x: -offset.x,
        y: -offset.y
    },
    image: fgimage2
});

const fg = new Sprite({
    position: {
        x: -offset.x,
        y: -offset.y
    },
    image: fgimage
});



const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false} /// creating obj to keep track on key presses
};



const movables = [bg,fg,fg2]; /// creating an array to store all the objects that can be moved on the map, this will be used to move the background and boundaries when the player moves, creating the illusion of the player moving around the map while actually moving the world around them.

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    );
}



let lastKey = ''; /// creating a variable to keep track of the last key pressed, this will be used to determine the direction of the player sprite when the corresponding key is pressed.
window.addEventListener('keydown', (e) => {
    
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            player.image = playerUp;
            player.moving = true;
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            player.image = playerLeft;
            player.moving = true;
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            player.image = playerDown;
            player.moving = true;
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            player.image = playerRight;
            player.moving = true;
            break;
    }
}); /// adding an event listener for keydown events, which will allow the player to move around the map when the arrow keys are pressed.

window.addEventListener('keyup', (e) => {
    
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            player.moving = false;
            player.frames.val = 0; // Reset to first frame of player-up
            player.frames.elapsed = 0; // Reset animation timer
            break;
        case 'a':
            keys.a.pressed = false;
            player.moving = false;
            player.frames.val = 0; // Reset to first frame of player-left
            player.frames.elapsed = 0; // Reset animation timer
            break;
        case 's':
            keys.s.pressed = false;
            player.moving = false;
            player.frames.val = 0; // Reset to first frame of player-down
            player.frames.elapsed = 0; // Reset animation timer
            break;
        case 'd':
            keys.d.pressed = false;
            player.moving = false;
            player.frames.val = 0; // Reset to first frame of player-right
            player.frames.elapsed = 0; // Reset animation timer
            break;
    }
});


animate();
