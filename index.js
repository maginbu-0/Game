const canvas = document.querySelector('canvas'); /// selecting the canvas element from the HTML document
const ctx = canvas.getContext('2d');

canvas.width = 1024;    /// setting the width and height of the canvas
canvas.height = 576;

ctx.fillStyle = 'white'; /// setting the fill color to white and filling the entire canvas with it
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image(); /// creating a new image object for the map
image.src = './game-assets/map-game.png';

const plyerImage = new Image(); /// creating a new image object for the player
plyerImage.src = './game-assets/player-assets/player-down.png';

image.onload = () => {
    ctx.drawImage(image, -1325, -1100);
    ctx.drawImage(
        plyerImage,
        0,
        0,
        plyerImage.width/7,
        plyerImage.height,
        canvas.width/2 - plyerImage.width/14, 
        canvas.height/2 - plyerImage.height/2,
        plyerImage.width/7,
        plyerImage.height,
    );
} /// once the map image is loaded, it is drawn onto the canvas at a specific position, and then the player image is drawn on top of it at the center of the canvas.




