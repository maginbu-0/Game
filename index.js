const canvas = document.querySelector('canvas'); /// selecting the canvas element from the HTML document
const ctx = canvas.getContext('2d');

canvas.width = 1024;    /// setting the width and height of the canvas
canvas.height = 576;    /// Use 450x zoom in tiled

ctx.fillStyle = 'white'; /// setting the fill color to white and filling the entire canvas with it
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image(); /// creating a new image object for the map
image.src = './game-assets/map-game.png'; /// Update this path if your image file is different
image.onload = () => console.log('Map image loaded');
image.onerror = () => console.error('Failed to load map image:', image.src);

const plyerImage = new Image(); /// creating a new image object for the player
plyerImage.src = './game-assets/player-assets/player-down.png'; /// Update this path if your image file is different
plyerImage.onload = () => console.log('Player image loaded');
plyerImage.onerror = () => console.error('Failed to load player image:', plyerImage.src);

class Sprite {
    constructor({position,image}){
        this.position = position
        this.image = image
    }
    draw(){
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }
}

const bg = new Sprite({
    position: {
        x: -1325,
        y: -1100
    },
    image: image
});

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false} /// creating obj to keep track on key presses
};

function animate() {
    window.requestAnimationFrame(animate);
    bg.draw(); /// calling the draw method of the bg object to draw the map image onto the canvas
    ctx.drawImage(
        plyerImage,
        0,
        0,
        plyerImage.width/7, /// setting the width and height of the player image to be 1/7th of its original size, this is because we have 7 sprites
        plyerImage.height,
        canvas.width/2 - plyerImage.width/14, /// here to set the player image at the center of the canvas, we need to subtract half of the width of the player image from half of the width of the canvas, and for the height we need to subtract half of the height of the player image from half of the height of the canvas
        canvas.height/2 - plyerImage.height/2,
        plyerImage.width/7,
        plyerImage.height,
    ); /// once the map image is loaded, it is drawn onto the canvas at a specific position, and then the player image is drawn on top of it at the center of the canvas.

    if (keys.w.pressed && lastKey === 'w') bg.position.y += 4;
    else if (keys.a.pressed && lastKey === 'a') bg.position.x += 4; /// using += and -= to change the position of the background image when the corresponding keys are pressed, this will create the illusion of the player moving around the map.
    else if (keys.s.pressed && lastKey === 's') bg.position.y -= 4;
    else if (keys.d.pressed && lastKey === 'd') bg.position.x -= 4;   
    /// setup the character movement by changing the position of the background image when the corresponding keys are pressed, this will create the illusion of the player moving around the map.

};
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



