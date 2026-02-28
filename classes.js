class Sprite {
    constructor({position,image,frames = {max: 1}}){
        this.position = position
        this.image = image
        this.frames = frames
        this.width = 0
        this.height = 0
        
        // Set dimensions when image loads
        if (this.image.complete) {
            // Image is already cached/loaded
            this.setupDimensions();
        } else {
            this.image.onload = () => this.setupDimensions();
        }
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
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height,
        ); 
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
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red for debugging
        ctx.fillRect(
            this.position.x + bg.position.x, 
            this.position.y + bg.position.y, 
            this.width, 
            this.height
        );
    }
}