const canvas = document.querySelector('canvas'); /// selecting the canvas element from the HTML document
const ctx = canvas.getContext('2d');

canvas.width = 1024;    /// setting the width and height of the canvas
canvas.height = 576;    /// Use 450x zoom in tiled

// IMPORT YOUR COLLISION DATA HERE - This should come from your Tiled map export
// Format: an array of collision IDs (e.g., [0, 0, 0, 4097, 0, ...])
// For now, using a placeholder - replace with your actual collision data
//const collisions = [];  // *** PLACEHOLDER: Add your collision data array here ***

const collisionsMap = []; /// creating an empty array to store the collision data for the map, this will be used to determine where the player can and cannot move on the map.
for (let i = 0; i < collisions.length; i+=70) {
    collisionsMap.push(collisions.slice(i, 70 + i)); /// using a for loop to iterate through the collisions array and push the data into the collisionsMap array in chunks of 70, this is because the map is 70 tiles wide, so each chunk of 70 represents one row of the map.
}

class Boundary {
    static width = 72;
    static height = 72;
    constructor({position}){
        this.position = position;
        this.width = 72;
        this.height = 72;
    }
    draw(){
        ctx.fillStyle = 'red';
        // *** KEY FIX: Draw boundaries relative to camera position (bg) ***
        ctx.fillRect(
            this.position.x + bg.position.x, 
            this.position.y + bg.position.y, 
            this.width, 
            this.height
        );
    }
}

const boundaries = []; /// creating an empty array to store the boundary objects for the map, this will be used to determine where the player can and cannot move on the map.
const offset = {
    x: 1325,
    y: 1100
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 4097)
        boundaries.push(
            new Boundary({position: {
                // *** FIX: Only use tile coordinates, camera offset is applied in draw() ***
                x: j * Boundary.width,
                y: i * Boundary.height
        }}))
    })
}); /// using a nested forEach loop to iterate through the collisionsMap array and create a new Boundary object for each tile that has a collision, the position of each boundary object is determined by its index in the collisionsMap array, multiplied by the size of each tile (72 pixels in this case). The boundary objects are then pushed into the boundaries array.



const image = new Image(); /// creating a new image object for the map
image.src = './game-assets/map-game.png'; /// Update this path if your image file is different
image.onload = () => console.log('Map image loaded');
image.onerror = () => console.error('Failed to load map image:', image.src);

const plyerImage = new Image(); /// creating a new image object for the player
plyerImage.src = './game-assets/player-assets/player-down.png'; /// Update this path if your image file is different
plyerImage.onload = () => console.log('Player image loaded');
plyerImage.onerror = () => console.error('Failed to load player image:', plyerImage.src);

class Sprite {
    constructor({position,image,frames = {max: 1}}){
        this.position = position
        this.image = image
        this.frames = frames
    }
    draw(){
        ctx.drawImage(
        this.image,
        0,
        0,
        this.image.width / this.frames.max, /// setting the width and height of the player image to be 1/7th of its original size, this is because we have 7 sprites
        this.image.height,
        this.position.x, /// *** FIX: Use this.position.x instead of hardcoded center position ***
        this.position.y, /// *** FIX: Use this.position.y instead of hardcoded center position ***
        this.image.width / this.frames.max,
        this.image.height,
    ); 
    }
}



const bg = new Sprite({
    position: {
        x: -offset.x,
        y: -offset.y
    },
    image: image
});

const player = new Sprite({
    position: {
        x: canvas.width/2 - plyerImage.width/(2 * 7),
        y: canvas.height/2 - plyerImage.height/2
    },
    image: plyerImage,
    frames: { max: 7 }
});

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false} /// creating obj to keep track on key presses
};

const testBoundary = new Boundary({
    position: {
        x: 1500,
        y: 1300
    }
});


function animate() {
    // AI FIX: The entire animation loop was fixed
    // Why: animate() was defined but never called - loop never started!
    window.requestAnimationFrame(animate);
    
    // AI FIX: Clear canvas at start of frame
    // Why: Without clearing, previous frames leave visual artifacts (ghosting)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render order matters: background > boundaries > player (background to foreground)
    bg.draw();           // Background tiles (moves with camera)
    testBoundary.draw(); // Collision boundaries (debug visualization)
    player.draw();       // AI FIX: Was missing - player now renders. Why: draw() must be called!
    ///boundaries.forEach(boundary => boundary.draw()); /// calling the draw method of each boundary object to draw the collision boundaries onto the canvas
    

    
    // AI NOTE: Camera system - moving bg.position creates illusion of player movement
    // Why: Player stays centered, camera moves around player to simulate movement
    if (keys.w.pressed && lastKey === 'w') bg.position.y += 4;      // Move camera down = see up
    else if (keys.a.pressed && lastKey === 'a') bg.position.x += 4; // Move camera right = see left
    else if (keys.s.pressed && lastKey === 's') bg.position.y -= 4; // Move camera up = see down
    else if (keys.d.pressed && lastKey === 'd') bg.position.x -= 4; // Move camera left = see right   
    /// setup the character movement by changing the position of the background image when the corresponding keys are pressed, this will create the illusion of the player moving around the map.

};
// AI FIX: CRITICAL - This call starts the animation loop
// Why: Without this, requestAnimationFrame is never triggered and nothing renders
animate(); 


let lastKey = ''; /// creating a variable to keep track of the last key pressed, this will be used to determine the direction of the player sprite when the corresponding key is pressed.
window.addEventListener('keydown', (e) => {
    
    switch (e.key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
}); /// adding an event listener for keydown events, which will allow the player to move around the map when the arrow keys are pressed.

window.addEventListener('keyup', (e) => {
    
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});

/// START THE ANIMATION LOOP



