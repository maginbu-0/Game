class Sprite {
    constructor({position,image,frames = {max: 1}}){
        this.position = position
        this.image = image
        this.frames = {...frames, val:0, elapsed:0}
        this.width = 0
        this.height = 0
        
        // Set dimensions when image loads
        if (this.image.complete) {
            // Image is already cached/loaded
            this.setupDimensions();
        } else {
            this.image.onload = () => this.setupDimensions();
        }
        this.moving = false;
    }
    
    setupDimensions() {
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        console.log(`Sprite dimensions: ${this.width}x${this.height} (raw: ${this.image.width}x${this.image.height})`);
    }
    
    draw(){
        if (this.width === 0 || this.height === 0) return; // Don't draw until image is loaded
        
        ctx.drawImage(
            this.image,
            this.frames.val * this.width, // In my case with 7 frames, I want to start at the first frame (0), but you can adjust this for animation to 1008/7=144
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        ); 
        
        if (!this.moving) return; // Only animate frames if the sprite is moving

        if (this.frames.max > 1){
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % 5 === 0){
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
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
        ctx.fillStyle = 'rgba(255, 0, 0, 0)'; // Semi-transparent red for debugging
        ctx.fillRect(
            this.position.x + bg.position.x, 
            this.position.y + bg.position.y, 
            this.width, 
            this.height
        );
    }
}

class TravelPoint {
    static width = 72;
    static height = 72;
    constructor({position, id}){
        this.position = position;
        this.width = 72;
        this.height = 72;
        this.id = id || 0; // Store the travel point ID (98, 99, etc.)
    }
    draw(){
        ctx.fillStyle = 'rgba(0, 0, 255, 0)'; // Semi-transparent blue for travel points
        ctx.fillRect(
            this.position.x + bg.position.x, 
            this.position.y + bg.position.y, 
            this.width, 
            this.height
        );
    }
}