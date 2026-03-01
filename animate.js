let globalAnimationID = null;

function animate() {
    globalAnimationID = window.requestAnimationFrame(animate);
    
    // Don't run outdoor animation if indoors is active
    if (window.indoorsAnimationRunning === true || window.indoorsAnimationRunning2 === true) {
        return;
    }
    
    // Initialize travel flag if not already set
    if (window.travelInProgress === undefined) {
        window.travelInProgress = false;
    }
    
    // Clear canvas at start of frame
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render order matters: background > boundaries > player (background to foreground)
    
    bg.draw();

    boundaries.forEach(boundary => {
        boundary.draw();
    });

    travelPoints.forEach(travelPoint => {
        travelPoint.draw();
    });

    player.draw();

    fg.draw();

    fg2.draw();

    // Freeze player animation during travel
    if (window.travelInProgress) {
        player.moving = false;
    }

    // Log player position every 30 frames to avoid console spam
    //if (window.frameCount === undefined) window.frameCount = 0;
    //window.frameCount++;
    //if (window.frameCount % 30 === 0) {
    //    console.log(`Player position - x: ${Math.round(player.position.x)}, y: ${Math.round(player.position.y)}`);
    //}
    if (!window.travelInProgress) {
        if (keys.w.pressed && lastKey === 'w') {
            player.moving = true;
            movables.forEach(movable => movable.position.y += 4);
        } else if (keys.a.pressed && lastKey === 'a') {
            player.moving = true;
            movables.forEach(movable => movable.position.x += 4);
        } else if (keys.s.pressed && lastKey === 's') {
            player.moving = true;
            movables.forEach(movable => movable.position.y -= 4);
        } else if (keys.d.pressed && lastKey === 'd') {
            player.moving = true;
            movables.forEach(movable => movable.position.x -= 4);
        }
    }
    
    // Check collision AFTER moving, and undo if there's a collision
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i];
        
        // Convert boundary world position to screen position
        const screenBoundary = {
            position: {
                x: boundary.position.x + bg.position.x,
                y: boundary.position.y + bg.position.y
            },
            width: boundary.width,
            height: boundary.height
        };
        
        // Create a smaller hitbox for the player (50% of original size, centered)
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
            console.log('Collision detected - undoing movement');
            // Undo the movement that caused the collision
            if (keys.w.pressed && lastKey === 'w') {
                player.moving = true;
                movables.forEach(movable => movable.position.y -= 4);
            } else if (keys.a.pressed && lastKey === 'a') {
                player.moving = true;
                movables.forEach(movable => movable.position.x -= 4);
            } else if (keys.s.pressed && lastKey === 's') {
                player.moving = true;
                movables.forEach(movable => movable.position.y += 4);
            } else if (keys.d.pressed && lastKey === 'd') {
                player.moving = true;
                movables.forEach(movable => movable.position.x += 4);
            }
            break;
        }
    }

    // Check travel point collisions AFTER boundary collisions
    for (let i = 0; i < travelPoints.length; i++) {
        const travelPoint = travelPoints[i];
        
        // Convert travel point world position to screen position (same as boundaries)
        const screenTravelPoint = {
            position: {
                x: travelPoint.position.x + bg.position.x,
                y: travelPoint.position.y + bg.position.y
            },
            width: travelPoint.width,
            height: travelPoint.height
        };
        
        // Create a smaller hitbox for the player (same as boundary detection)
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
        if (isColliding && overlappingArea > (playerHitbox.width * playerHitbox.height) * 0.8) { // Require at least 80% overlap for travel point activation
            // Only trigger travel animation once
            if (!window.travelInProgress) {
                console.log('Travel point detected!', travelPoint.position, 'ID:', travelPoint.id);
                window.travelInProgress = true; // Stop player movement
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete() {
                        console.log('GSAP animation complete, canceling outdoor loop');
                        // Cancel the outdoor animation loop
                        window.cancelAnimationFrame(globalAnimationID);
                        // Small delay to ensure outdoor loop fully stops before starting indoors
                        setTimeout(() => {
                            console.log('Delay complete, starting indoors animation for building:', travelPoint.id);
                            // Route to correct building based on travel point ID
                            if (travelPoint.id === 4098) {
                                startIndoorsAnimation();
                            } else if (travelPoint.id === 4099) {
                                startIndoorsAnimation2();
                            }
                        }, 100);
                        // Fade out overlay
                        gsap.to('#overlappingDiv', {
                            opacity: 0,
                            duration: 0.4
                        });
                    }
                });
            }
        }
                
                

                // Create map change into building animation need to quit this animation file
            }
        }

