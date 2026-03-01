const animateBuilding2 = new Image();
animateBuilding2.src = './game-assets/map-indoors.png';
animateBuilding2.onload = () => console.log('Animate Building 2 image loaded:', animateBuilding2.width, 'x', animateBuilding2.height);
animateBuilding2.onerror = () => console.error('Failed to load Animate Building 2 image:', animateBuilding2.src);

const indoorsBg2 = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: animateBuilding2,
});

let indoorsAnimationRunning2 = false;
let indoorsAnimationID2 = null;
let indoorsKeys2 = {
    w: { pressed: false },
    a: { pressed: false },
    s: { pressed: false },
    d: { pressed: false }
};
let indoorsLastKey2 = '';

// Set up indoor key listeners for building 2
window.addEventListener('keydown', (e) => {
    if (!indoorsAnimationRunning2) return;
    
    switch(e.key) {
        case 'w': indoorsKeys2.w.pressed = true; indoorsLastKey2 = 'w'; break;
        case 'a': indoorsKeys2.a.pressed = true; indoorsLastKey2 = 'a'; break;
        case 's': indoorsKeys2.s.pressed = true; indoorsLastKey2 = 's'; break;
        case 'd': indoorsKeys2.d.pressed = true; indoorsLastKey2 = 'd'; break;
    }
});

window.addEventListener('keyup', (e) => {
    if (!indoorsAnimationRunning2) return;
    
    switch(e.key) {
        case 'w': indoorsKeys2.w.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 'a': indoorsKeys2.a.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 's': indoorsKeys2.s.pressed = false; player.moving = false; player.frames.val = 0; break;
        case 'd': indoorsKeys2.d.pressed = false; player.moving = false; player.frames.val = 0; break;
    }
});

function animateIndoorsFrame2() {
    try {
        if (!indoorsAnimationRunning2) {
            return; // Don't continue if not running
        }
        
        indoorsAnimationID2 = window.requestAnimationFrame(animateIndoorsFrame2);
        
        // Clear canvas
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw indoors map image with camera offset (same as outdoor map)
        if (animateBuilding2.complete && animateBuilding2.naturalHeight !== 0) {
            ctx.drawImage(
                animateBuilding2,
                0, // sx
                0, // sy
                animateBuilding2.width,
                animateBuilding2.height,
                bg.position.x, // dx - apply camera offset to match player position
                bg.position.y, // dy - apply camera offset to match player position
                animateBuilding2.width,
                animateBuilding2.height
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
        if (indoorsKeys2.w.pressed && indoorsLastKey2 === 'w') {
            player.moving = true;
            player.image = playerUp;
            movables.forEach(movable => movable.position.y += 4);
        } else if (indoorsKeys2.a.pressed && indoorsLastKey2 === 'a') {
            player.moving = true;
            player.image = playerLeft;
            movables.forEach(movable => movable.position.x += 4);
        } else if (indoorsKeys2.s.pressed && indoorsLastKey2 === 's') {
            player.moving = true;
            player.image = playerDown;
            movables.forEach(movable => movable.position.y -= 4);
        } else if (indoorsKeys2.d.pressed && indoorsLastKey2 === 'd') {
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
                if (indoorsKeys2.w.pressed && indoorsLastKey2 === 'w') {
                    movables.forEach(movable => movable.position.y -= 4);
                } else if (indoorsKeys2.a.pressed && indoorsLastKey2 === 'a') {
                    movables.forEach(movable => movable.position.x -= 4);
                } else if (indoorsKeys2.s.pressed && indoorsLastKey2 === 's') {
                    movables.forEach(movable => movable.position.y += 4);
                } else if (indoorsKeys2.d.pressed && indoorsLastKey2 === 'd') {
                    movables.forEach(movable => movable.position.x += 4);
                }
                break;
            }
        }
        
        // Check indoor travel point collisions (for exiting the building)
        if (!window.indoorsTravelInProgress2) {
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
                    if (!window.indoorsTravelInProgress2) {
                        window.indoorsTravelInProgress2 = true;
                        indoorsAnimationRunning2 = false;
                        
                        // Store the exit door position for multi-door support
                        window.exitDoorPosition2 = {
                            x: travelPoint.position.x,
                            y: travelPoint.position.y
                        };
                        
                        // Move player down 80 pixels (reverse of the 80px up we did on entry)
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
                                window.cancelAnimationFrame(indoorsAnimationID2);
                                // Resume outdoor animation after delay
                                setTimeout(() => {
                                    window.indoorsTravelInProgress2 = false;
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
        if (window.indoorFrameCount2 === undefined) window.indoorFrameCount2 = 0;
        window.indoorFrameCount2++;
        if (window.indoorFrameCount2 % 30 === 0) {
            console.log(`[INDOORS-B2] Player position - x: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}`);
        }
    } catch (error) {
        console.error('Error in animateIndoorsFrame2:', error);
    }
    
}

// Start the indoors animation for building 2
function startIndoorsAnimation2() {
    console.log('Entered building 2');
    
    // Spawn player 60 pixels below door so they can exit easily
    movables.forEach(movable => movable.position.y += 60);
    
    // Set flag BEFORE calling animateIndoorsFrame2 so it doesn't return early
    indoorsAnimationRunning2 = true;
    animateIndoorsFrame2();
}
