const animateBuilding1 = new Image();
animateBuilding1.src = './game-assets/map-indoors.png';
animateBuilding1.onload = () => console.log('Animate Building 1 image loaded:', animateBuilding1.width, 'x', animateBuilding1.height);
animateBuilding1.onerror = () => console.error('Failed to load Animate Building 1 image:', animateBuilding1.src);

const indoorsBg = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: animateBuilding1,
});

let indoorsAnimationRunning = false;
let indoorsAnimationID = null;
let indoorsKeys = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};
let indoorsLastKey = '';

// Set up indoor key listeners
window.addEventListener('keydown', (e) => {
    if (!indoorsAnimationRunning) return;
    
    switch(e.key) {
        case 'w': indoorsKeys.w.pressed = true; indoorsLastKey = 'w'; break;
        case 'a': indoorsKeys.a.pressed = true; indoorsLastKey = 'a'; break;
        case 's': indoorsKeys.s.pressed = true; indoorsLastKey = 's'; break;
        case 'd': indoorsKeys.d.pressed = true; indoorsLastKey = 'd'; break;
    }
});

window.addEventListener('keyup', (e) => {
    if (!indoorsAnimationRunning) return;
    
    switch(e.key) {
        case 'w': indoorsKeys.w.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 'a': indoorsKeys.a.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 's': indoorsKeys.s.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 'd': indoorsKeys.d.pressed = false; player.moving = false; player.frames.val = 0; break;
    }
});

function animateIndoorsFrame() {
    try {
        if (!indoorsAnimationRunning) {
            return; // Don't continue if not running
        }
        
        indoorsAnimationID = window.requestAnimationFrame(animateIndoorsFrame);
        
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw indoors map image with camera offset (same as outdoor map)
        if (animateBuilding1.complete && animateBuilding1.naturalHeight !== 0) {
            ctx.drawImage(
                animateBuilding1,
                0, // sx
                0, // sy
                animateBuilding1.width,
                animateBuilding1.height,
                bg.position.x, // dx - apply camera offset to match player position
                bg.position.y, // dy - apply camera offset to match player position
                animateBuilding1.width,
                animateBuilding1.height
            );
        }

        // TODO: Draw indoor boundaries collision blocks when we have them defined
        // boundariesIndoors.forEach(boundary => {
        //     boundary.draw();
        // });

        // Draw indoor travel points
        travelPointsIndoors.forEach(travelPoint => {
            travelPoint.draw();
        });

        player.draw();

        indoor_fg.draw();

        indoor_fg2.draw();
        
        // Apply indoor movement (same system as outdoor)
        if (indoorsKeys.w.pressed && indoorsLastKey === 'w') {
            player.moving = true;
            player.image = playerUp;
            movables.forEach(movable => movable.position.y += 4);
        } else if (indoorsKeys.a.pressed && indoorsLastKey === 'a') {
            player.moving = true;
            player.image = playerLeft;
            movables.forEach(movable => movable.position.x += 4);
        } else if (indoorsKeys.s.pressed && indoorsLastKey === 's') {
            player.moving = true;
            player.image = playerDown;
            movables.forEach(movable => movable.position.y -= 4);
        } else if (indoorsKeys.d.pressed && indoorsLastKey === 'd') {
            player.moving = true;
            player.image = playerRight;
            movables.forEach(movable => movable.position.x -= 4);
        }
        
        // Check collision with indoor boundaries AFTER moving
        for (let i = 0; i < boundariesIndoors.length; i++) {
            const boundary = boundariesIndoors[i];
            
            // Convert boundary world position to screen position
            const screenBoundary = {
                position: {
                    x: boundary.position.x + bg.position.x,
                    y: boundary.position.y + bg.position.y
                },
                width: boundary.width,
                height: boundary.height
            };
            
            // Create a smaller hitbox for the player (same as outdoor)
            const playerHitbox = {
                position: {
                    x: player.position.x + player.width * 0.25,
                    y: player.position.y + player.height * 0.25
                },
                width: player.width * 0.35,
                height: player.height * 0.35
            };
            
            // Check if player collides with this boundary
            if (rectangularCollision({
                rectangle1: playerHitbox,
                rectangle2: screenBoundary,
            })) {
                // Undo the movement that caused the collision
                if (indoorsKeys.w.pressed && indoorsLastKey === 'w') {
                    movables.forEach(movable => movable.position.y -= 4);
                } else if (indoorsKeys.a.pressed && indoorsLastKey === 'a') {
                    movables.forEach(movable => movable.position.x -= 4);
                } else if (indoorsKeys.s.pressed && indoorsLastKey === 's') {
                    movables.forEach(movable => movable.position.y += 4);
                } else if (indoorsKeys.d.pressed && indoorsLastKey === 'd') {
                    movables.forEach(movable => movable.position.x += 4);
                }
                break;
            }
        }
        
        // Check indoor travel point collisions (for exiting the building)
        if (!window.indoorsTravelInProgress) {
            for (let i = 0; i < travelPointsIndoors.length; i++) {
                const travelPoint = travelPointsIndoors[i];
                
                // Convert travel point world position to screen position
                const screenTravelPoint = {
                    position: {
                        x: travelPoint.position.x + bg.position.x,
                        y: travelPoint.position.y + bg.position.y
                    },
                    width: travelPoint.width,
                    height: travelPoint.height
                };
                
                // Create a smaller hitbox for the player
                const playerHitbox = {
                    position: {
                        x: player.position.x + player.width * 0.25,
                        y: player.position.y + player.height * 0.25
                    },
                    width: player.width * 0.35,
                    height: player.height * 0.35
                };
                
                // Check if player collides with this travel point
                const isColliding = rectangularCollision({
                    rectangle1: playerHitbox,
                    rectangle2: screenTravelPoint
                });
                const overlappingArea = Math.max(0, Math.min(playerHitbox.position.x + playerHitbox.width, 
                                                    screenTravelPoint.position.x + screenTravelPoint.width) - Math.max(playerHitbox.position.x, screenTravelPoint.position.x)) *
                                        Math.max(0, Math.min(playerHitbox.position.y + playerHitbox.height, 
                                                    screenTravelPoint.position.y + screenTravelPoint.height) - Math.max(playerHitbox.position.y, screenTravelPoint.position.y));
                if (isColliding && overlappingArea > (playerHitbox.width * playerHitbox.height) * 0.8) {
                    if (!window.indoorsTravelInProgress) {
                        window.indoorsTravelInProgress = true;
                        indoorsAnimationRunning = false;
                        
                        // Store the exit door position for multi-door support
                        window.exitDoorPosition = {
                            x: travelPoint.position.x,
                            y: travelPoint.position.y
                        };
                        
                        // Move player down 80 pixels to spawn below the door exit
                        movables.forEach(movable => movable.position.y -= 60);
                        
                        // Reset player animation state
                        player.frames.val = 0;
                        player.frames.elapsed = 0;
                        player.moving = false;
                        player.image = playerDown;
                        
                        // Recalculate player dimensions based on new image
                        if (playerDown.complete) {
                            player.width = playerDown.width / player.frames.max;
                            player.height = playerDown.height;
                        }
                        
                        // GSAP animation for exit transition
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.4,
                            onComplete() {
                                // Cancel indoor loop
                                window.cancelAnimationFrame(indoorsAnimationID);
                                // Resume outdoor animation after delay
                                setTimeout(() => {
                                    window.indoorsTravelInProgress = false;
                                    window.travelInProgress = false;
                                    // Reset outdoor animation flag
                                    if (window.frameCount !== undefined) window.frameCount = 0;
                                    // Restart outdoor animation
                                    animate();
                                }, 100);
                                // Fade out overlay
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                });
                            }
                        });
                    }
                    break;
                }
            }
        }
        
        // Log indoor player position every 30 frames
        if (window.indoorFrameCount === undefined) window.indoorFrameCount = 0;
        window.indoorFrameCount++;
        if (window.indoorFrameCount % 30 === 0) {
            console.log(`[INDOORS] Player position - x: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}`);
        }
    } catch (error) {
        console.error('Error in animateIndoorsFrame:', error);
    }
    
}

// Start the indoors animation
function startIndoorsAnimation() {
    console.log('Entered building');
    
    // Spawn player 60 pixels below door so they can exit easily
    movables.forEach(movable => movable.position.y += 60);
    
    // Set flag BEFORE calling animateIndoorsFrame so it doesn't return early
    indoorsAnimationRunning = true;
    animateIndoorsFrame();
}
