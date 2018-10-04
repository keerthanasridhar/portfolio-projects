var sketchContainer = "sketch";


var sketch = function (p) {
    // Global variables
    var fishes = [];
    var jellys = [];
    var whales = [];
    var hammers = [];
    var repulsionDist = 30;
    var alignDist = 50;
    var attractionDist = 150;
    var huntDist = 200;
    var limitDist = 200;
    var maxVel = 4;
    var repulsionDistSq = p.sq(repulsionDist);
    var alignDistSq = p.sq(alignDist);
    var attractionDistSq = p.sq(attractionDist);
    var huntDistSq = p.sq(huntDist);
    var limitDistSq = p.sq(limitDist);
    var maxVelSq = p.sq(maxVel);
    var paintLines = false;
    var paintLimits = false;
    var paintDetails = true;
    var bgImg;

    // Initial setup
    p.setup = function () {
        // Create the canvas
    var canvas = p.createCanvas(850, 750);

        // Create the water-like image to be used as the background
        bgImg = createWaterImage(p.width, p.height);

        // Create all the species
        createFishes(200);
        createWhales(4);
    };

    
    // Execute the sketch
    p.draw = function () {
        var i, fish, whale;

        // Paint the water-like image
        p.background(bgImg);

        // Fishes
        for (i = 0; i < fishes.length; i++) {
            fish = fishes[i];

            // Update the fish properties
            fish.evaluateInteractions(fishes, true, true, true, false, false);
            fish.evaluateInteractions(whales, false, false, false, true, false);
            fish.evaluateInteractions(hammers, false, false, false, true, false);
            fish.keepClose();
            fish.update();

            // Paint the fish
            if (paintDetails) {
                fish.paintDetail();
            } else {
                fish.paint();
            }

            // Paint the limits if necessary
            if (paintLimits && i === 0) {
                fish.paintLimits();
            }
        }

        // Killer whales
        for (i = 0; i < whales.length; i++) {
            whale = whales[i];

            // Update the killer whale properties
            whale.evaluateInteractions(whales, true, false, false, false, false);
            whale.evaluateInteractions(fishes, false, false, false, false, true);
            whale.evaluateInteractions(jellys, false, false, false, false, true);
            whale.evaluateInteractions(hammers, true, false, false, false, false);
            whale.keepClose();
            whale.update();

            // Paint the killer whale
            if (paintDetails) {
                whale.paintDetail();
            } else {
                whale.paint();
            }
        }
    };

    //
    // Creates the water-like image
    //
    function createWaterImage(imgWidth, imgHeight) {
        var x, y, dx, dy, dist, ang, red, pixel;

        // Create the image and fill the pixel colors
        var img = p.createImage(imgWidth, imgHeight);
        var xCenter = 0.5 * imgWidth;
        var yCenter = 0.5 * imgHeight;

        img.loadPixels();

        for (x = 0; x < imgWidth; x++) {
            for (y = 0; y < imgHeight; y++) {
                dx = x - xCenter;
                dy = y - xCenter;
                dist = Math.sqrt(p.sq(dx) + p.sq(dy));
                ang = Math.abs(p.atan2(dy, dx));
                red = (3 + 0.04 * dist) * Math.random();
                pixel = 4 * (x + y * imgWidth);
                img.pixels[pixel] = red;
                img.pixels[pixel + 1] = red + 15 * p.noise(ang, 0.01 * dist) + 0.07 * dist;
                img.pixels[pixel + 2] = red + 20 * p.noise(ang, 0.03 * dist) + 0.07 * dist + 20;
                img.pixels[pixel + 3] = 255;
            }
        }

        img.updatePixels();

        // Return the image
        return img;
    }

    //
    // Fills the fishes array
    //
    function createFishes(n) {
        var oldSize = fishes.length;

        if (n < oldSize) {
            fishes.splice(n, Number.MAX_VALUE);
        } else if (n > oldSize) {
            var i, ang, mag, pos, vel, col, headSize;

            for (i = oldSize; i < n; i++) {
                ang = p.TWO_PI * Math.random();
                mag = limitDist * Math.random();
                pos = p.createVector(0.5 * p.width + mag * Math.cos(ang), 0.5 * p.height + mag * Math.sin(ang));
                ang = p.TWO_PI * Math.random();
                vel = p.createVector(Math.cos(ang), Math.sin(ang));
                col = p.color(232, 127, 106);
                headSize = 7;
                fishes[i] = new Fish(pos, vel, col, headSize);
            }
        }
    }

    //
    // Fills the whales array
    //
    function createWhales(n) {
        var oldSize = whales.length;

        if (n < oldSize) {
            whales.splice(n, Number.MAX_VALUE);
        } else if (n > oldSize) {
            var i, ang, mag, pos, vel, col, headSize;

            for (i = oldSize; i < n; i++) {
                ang = p.TWO_PI * Math.random();
                mag = limitDist * Math.random();
                pos = p.createVector(0.5 * p.width + mag * Math.cos(ang), 0.5 * p.height + mag * Math.sin(ang));
                ang = p.TWO_PI * Math.random();
                vel = p.createVector(Math.cos(ang), Math.sin(ang));
                col = p.color(0);
                headSize = 8 + 3 * Math.random();
                whales[i] = new Whale(pos, vel, col, headSize);
            }
        }
    }

    function Flock(pos, vel, col) {
        this.pos = pos;
        this.vel = vel;
        this.force = p.createVector(0, 0);
        this.col = col;
        this.isClose = false;

        // Useful variable used to avoid garbage collection
        this.forceDir = p.createVector(0, 0);
    }

    //
    // Update the flock coordinates (position and velocity)
    //
    Flock.prototype.updateCoordinates = function () {
        var velMagSq, scaleFactor, ang;

        // Increase the velocity depending on the force and add some friction
        this.vel.x = 0.99 * (this.vel.x + this.force.x);
        this.vel.y = 0.99 * (this.vel.y + this.force.y);

        // Make sure that the velocity remains within some reasonable limits
        velMagSq = p.sq(this.vel.x) + p.sq(this.vel.y);

        if (velMagSq > maxVelSq) {
            scaleFactor = Math.sqrt(maxVelSq / velMagSq);
            this.vel.x *= scaleFactor;
            this.vel.y *= scaleFactor;
        } else if (velMagSq < 1) {
            if (velMagSq !== 0) {
                scaleFactor = Math.sqrt(1 / velMagSq);
                this.vel.x *= scaleFactor;
                this.vel.y *= scaleFactor;
            } else {
                ang = p.TWO_PI * Math.random();
                this.vel.x = Math.cos(ang);
                this.vel.y = Math.sin(ang);
            }
        }

        // Update the position
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        // Reset the force vector
        this.force.x = 0;
        this.force.y = 0;
    };

    //
    // Evaluates which interactions are taking place
    //
    Flock.prototype.evaluateInteractions = function (flocks, repulsionCond, alignCond, attractionCond, huntedCond, huntCond) {
        var i, f, distanceSq;

        for (i = 0; i < flocks.length; i++) {
            f = flocks[i];

            // Calculate the separation vector and the distance
            this.forceDir.x = f.pos.x - this.pos.x;
            this.forceDir.y = f.pos.y - this.pos.y;
            distanceSq = p.sq(this.forceDir.x) + p.sq(this.forceDir.y);

            if (repulsionCond) {
                this.repulsion(this.forceDir, distanceSq);
            }

            if (alignCond) {
                this.align(f.vel, distanceSq);
            }

            if (attractionCond) {
                this.attraction(this.forceDir, distanceSq);
            }

            if (huntedCond) {
                this.hunted(this.forceDir, distanceSq);
            }

            if (huntCond) {
                this.hunt(this.forceDir, distanceSq);
            }
        }
    };

    //
    // Adds a repulsion force to prevent that two flocks get too close
    //
    Flock.prototype.repulsion = function (forceDir, distSq) {
        if (distSq < repulsionDistSq && distSq !== 0) {
            var distance = Math.sqrt(distSq);
            var forceFactor = -(repulsionDist / distance - 1) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;

            if (paintLines) {
                p.stroke(p.color(255, 0, 0));
                p.line(this.pos.x, this.pos.y, this.pos.x + forceDir.x, this.pos.y + forceDir.y);
            }
        }
    };

    //
    // Adds a force that aligns the velocities between relatively close flocks
    //
    Flock.prototype.align = function (forceDir, distSq) {
        if (distSq > repulsionDistSq && distSq < alignDistSq) {
            var distance = Math.sqrt(distSq);
            var forceFactor = 0.05 * (1 - Math.cos(p.TWO_PI * (distance - repulsionDist) / (alignDist - repulsionDist))) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;
        }
    };

    //
    // Adds an attraction force between flocks
    //
    Flock.prototype.attraction = function (forceDir, distSq) {
        if (distSq > alignDistSq && distSq < attractionDistSq) {
            var distance = Math.sqrt(distSq);
            var forceFactor = 0.005 * (1 - Math.cos(p.TWO_PI * (distance - alignDist) / (attractionDist - alignDist))) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;
        }
    };

    //
    // Adds a repulsive force to escape from a flock that is hunting it
    //
    Flock.prototype.hunted = function (forceDir, distSq) {
        if (distSq < huntDistSq) {
            var distance = Math.sqrt(distSq);
            var forceFactor = -0.5 * (huntDist / distance - 1) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;

            if (distance < 15) {
                this.isClose = true;
            }
        }
    };

    //
    // Adds an attractive force to catch the hunted flock
    //
    Flock.prototype.hunt = function (forceDir, distSq) {
        if (distSq < huntDistSq) {
            var distance = Math.sqrt(distSq);
            var forceFactor = 0.2 * (huntDist / distance - 1) / distance;
            this.force.x += forceFactor * forceDir.x;
            this.force.y += forceFactor * forceDir.y;

            if (distance < 15) {
                this.isClose = true;
            }
        }
    };

    //
    // Adds a repulsive force to avoid that the flock leaves the screen
    //
    Flock.prototype.keepClose = function () {
        this.forceDir.x = 0.5 * p.width - this.pos.x;
        this.forceDir.y = 0.5 * p.height - this.pos.y;
        var distSq = p.sq(this.forceDir.x) + p.sq(this.forceDir.y);

        if (distSq > limitDistSq) {
            var forceFactor = 1 / limitDist;
            this.force.x += forceFactor * this.forceDir.x;
            this.force.y += forceFactor * this.forceDir.y;
        }
    };

    //
    // Paints the flock with a simple triangular shape
    //
    Flock.prototype.paint = function () {
        var ang = p.atan2(this.vel.y, this.vel.x);
        var v1x = this.pos.x + 8 * p.cos(ang);
        var v1y = this.pos.y + 8 * p.sin(ang);
        var v2x = this.pos.x + 4 * p.cos(ang + 2.356);
        var v2y = this.pos.y + 4 * p.sin(ang + 2.356);
        var v3x = this.pos.x + 4 * p.cos(ang + 3.927);
        var v3y = this.pos.y + 4 * p.sin(ang + 3.927);

        p.noStroke();
        p.fill(this.col);
        p.triangle(v1x, v1y, v2x, v2y, v3x, v3y);
    };

    //
    // Paints the flock like a simple point
    //
    Flock.prototype.paintPoint = function () {
        p.stroke(this.col);
        p.strokeWeight(4);
        p.point(this.pos.x, this.pos.y);
        p.strokeWeight(1);
    };

    //
    // Paints the force limits
    //
    Flock.prototype.paintLimits = function () {
        p.noFill();
        p.stroke(p.color(255, 0, 0));
        p.ellipse(this.pos.x, this.pos.y, 2 * repulsionDist, 2 * repulsionDist);
        p.stroke(p.color(0, 255, 0));
        p.ellipse(this.pos.x, this.pos.y, 2 * alignDist, 2 * alignDist);
        p.stroke(p.color(0, 0, 255));
        p.ellipse(this.pos.x, this.pos.y, 2 * attractionDist, 2 * attractionDist);
        p.stroke(p.color(255));
        p.ellipse(0.5 * p.width, 0.5 * p.height, 2 * limitDist, 2 * limitDist);
    };

    /*
     * The Fish class
     */
    function Fish(pos, vel, col, headSize) {
        Flock.apply(this, arguments);
        this.headSize = headSize;
    }

    // Set Fish's prototype to Flock's prototype
    Fish.prototype = Object.create(Flock.prototype);

    // Set constructor back to Fish
    Fish.prototype.constructor = Fish;

    //
    // Updates the fish coordinates
    //
    Fish.prototype.update = function () {
        this.updateCoordinates();
    };

    //
    // Paints the fish with details
    //
    Fish.prototype.paintDetail = function () {
        p.push();
        p.noStroke();
        p.fill(this.col);
        p.translate(this.pos.x, this.pos.y);
        p.rotate(p.HALF_PI + p.atan2(this.vel.y, this.vel.x));
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.2 * this.headSize, 0);
        p.curveVertex(0, 1.5 * this.headSize);
        p.curveVertex(-0.2 * this.headSize, 0);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.2 * this.headSize, 0);
        p.curveVertex(0, 1.5 * this.headSize);
        p.endShape();
        p.pop();
    };

    
    /*
     * The Whale class
     */
    function Whale(pos, vel, col, headSize) {
        Flock.apply(this, arguments);
        this.headSize = headSize;
        this.posHead = this.pos.copy();
        this.posBody = p.createVector(this.posHead.x, this.posHead.y + 0.6 * this.headSize);
        this.posMed = p.createVector(this.posBody.x, this.posBody.y + 4.5 * this.headSize);
        this.posTail = p.createVector(this.posMed.x, this.posMed.y + 2.4 * this.headSize);
        this.posEnd = p.createVector(this.posTail.x, this.posTail.y + 1.8 * this.headSize);
        this.angHead = 0;
        this.angBody = 0;
        this.angMed = 0;
        this.angTail = 0;
    }

    // Set Whale's prototype to Flock's prototype
    Whale.prototype = Object.create(Flock.prototype);

    // Set constructor back to Hammer
    Whale.prototype.constructor = Whale;

    //
    // Updates the killer whale coordinates and shape
    //
    Whale.prototype.update = function () {
        // Update the coordinates
        this.updateCoordinates();

        // Move the head
        this.posHead.x = this.pos.x;
        this.posHead.y = this.pos.y;
        this.angHead = p.atan2(this.vel.y, this.vel.x);

        // Oscillate the head a bit
        if (this.isClose) {
            this.angHead += 0.5 * Math.sin(0.4 * p.frameCount);
            this.isClose = false;
        }

        // Move the rest of the body
        this.posBody.x = this.posHead.x - 0.6 * this.headSize * Math.cos(this.angHead);
        this.posBody.y = this.posHead.y - 0.6 * this.headSize * Math.sin(this.angHead);
        this.angBody = p.atan2(this.posBody.y - this.posMed.y, this.posBody.x - this.posMed.x);

        this.posMed.x = this.posBody.x - 4.5 * this.headSize * Math.cos(this.angBody);
        this.posMed.y = this.posBody.y - 4.5 * this.headSize * Math.sin(this.angBody);
        this.angMed = p.atan2(this.posMed.y - this.posTail.y, this.posMed.x - this.posTail.x);

        this.posTail.x = this.posMed.x - 2.4 * this.headSize * Math.cos(this.angMed);
        this.posTail.y = this.posMed.y - 2.4 * this.headSize * Math.sin(this.angMed);
        this.angTail = p.atan2(this.posTail.y - this.posEnd.y, this.posTail.x - this.posEnd.x);

        this.posEnd.x = this.posTail.x - 1.8 * this.headSize * Math.cos(this.angTail);
        this.posEnd.y = this.posTail.y - 1.8 * this.headSize * Math.sin(this.angTail);
    };

    //
    // Paints the killer whale with details
    //
    Whale.prototype.paintDetail = function () {
        p.noStroke();
        this.paintHead(this.posHead, this.angHead, this.col);
        this.paintBody(this.posBody, this.angBody, this.col);
        this.paintMed(this.posMed, this.angMed, this.col);
        this.paintTail(this.posTail, this.angTail, this.col);
    };

    //
    // Paints the killer whale head
    //
    Whale.prototype.paintHead = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);

        // The head
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -1.5 * this.headSize);
        p.curveVertex(0.4 * this.headSize, -1.1 * this.headSize);
        p.curveVertex(0.85 * this.headSize, -0.3 * this.headSize);
        p.curveVertex(1.0 * this.headSize, 0.6 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 0.5 * this.headSize);
        p.curveVertex(0, 0.2 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, 0.5 * this.headSize);
        p.curveVertex(-1.0 * this.headSize, 0.6 * this.headSize);
        p.curveVertex(-0.85 * this.headSize, -0.3 * this.headSize);
        p.curveVertex(-0.4 * this.headSize, -1.1 * this.headSize);
        p.curveVertex(0, -1.5 * this.headSize);
        p.curveVertex(0.4 * this.headSize, -1.1 * this.headSize);
        p.curveVertex(0.85 * this.headSize, -0.3 * this.headSize);
        p.endShape();

        // The white patches
        p.fill(255, 150);
        p.beginShape();
        p.curveVertex(0.4 * this.headSize, -0.7 * this.headSize);
        p.curveVertex(0.65 * this.headSize, -0.4 * this.headSize);
        p.curveVertex(0.85 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(0.6 * this.headSize, -0.1 * this.headSize);
        p.curveVertex(0.5 * this.headSize, -0.4 * this.headSize);
        p.curveVertex(0.4 * this.headSize, -0.7 * this.headSize);
        p.curveVertex(0.65 * this.headSize, -0.4 * this.headSize);
        p.endShape();
        p.beginShape();
        p.curveVertex(-0.4 * this.headSize, -0.7 * this.headSize);
        p.curveVertex(-0.65 * this.headSize, -0.4 * this.headSize);
        p.curveVertex(-0.85 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, -0.1 * this.headSize);
        p.curveVertex(-0.5 * this.headSize, -0.4 * this.headSize);
        p.curveVertex(-0.4 * this.headSize, -0.7 * this.headSize);
        p.curveVertex(-0.65 * this.headSize, -0.4 * this.headSize);
        p.endShape();
        p.pop();
    };

    //
    // Paints the killer whale body
    //
    Whale.prototype.paintBody = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);

        // The body
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(1.05 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(1.25 * this.headSize, 0.3 * this.headSize);
        p.curveVertex(1.85 * this.headSize, 0.7 * this.headSize);
        p.curveVertex(2.2 * this.headSize, 1.3 * this.headSize);
        p.curveVertex(2.1 * this.headSize, 1.9 * this.headSize);
        p.curveVertex(1.7 * this.headSize, 2.1 * this.headSize);
        p.curveVertex(1.2 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(1.1 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(0.85 * this.headSize, 4.4 * this.headSize);
        p.curveVertex(0, 4.2 * this.headSize);
        p.curveVertex(-0.85 * this.headSize, 4.4 * this.headSize);
        p.curveVertex(-1.1 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(-1.2 * this.headSize, 2.0 * this.headSize);
        p.curveVertex(-1.7 * this.headSize, 2.1 * this.headSize);
        p.curveVertex(-2.1 * this.headSize, 1.9 * this.headSize);
        p.curveVertex(-2.2 * this.headSize, 1.3 * this.headSize);
        p.curveVertex(-1.85 * this.headSize, 0.7 * this.headSize);
        p.curveVertex(-1.25 * this.headSize, 0.3 * this.headSize);
        p.curveVertex(-1.05 * this.headSize, 0.2 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.9 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(1.05 * this.headSize, 0.2 * this.headSize);
        p.endShape();

        // The white patches
        p.fill(255, 150);
        p.beginShape();
        p.curveVertex(0.6 * this.headSize, 2.7 * this.headSize);
        p.curveVertex(0.9 * this.headSize, 3.6 * this.headSize);
        p.curveVertex(0.8 * this.headSize, 4.1 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 3.8 * this.headSize);
        p.curveVertex(0.4 * this.headSize, 3.3 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 2.7 * this.headSize);
        p.curveVertex(0.9 * this.headSize, 3.6 * this.headSize);
        p.endShape();
        p.beginShape();
        p.curveVertex(-0.6 * this.headSize, 2.7 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, 3.6 * this.headSize);
        p.curveVertex(-0.8 * this.headSize, 4.1 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, 3.8 * this.headSize);
        p.curveVertex(-0.4 * this.headSize, 3.3 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, 2.7 * this.headSize);
        p.curveVertex(-0.9 * this.headSize, 3.6 * this.headSize);
        p.endShape();
        p.pop();
    };

    //
    // Paints the killer whale medium body
    //
    Whale.prototype.paintMed = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.8 * this.headSize, -0.1 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 1.2 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 2.2 * this.headSize);
        p.curveVertex(0, 2.1 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 2.2 * this.headSize);
        p.curveVertex(-0.6 * this.headSize, 1.2 * this.headSize);
        p.curveVertex(-0.8 * this.headSize, -0.1 * this.headSize);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.8 * this.headSize, -0.1 * this.headSize);
        p.curveVertex(0.6 * this.headSize, 1.2 * this.headSize);
        p.endShape();
        p.pop();
    };

    //
    // Paints the killer whale tail
    //
    Whale.prototype.paintTail = function (cen, ang, c) {
        p.push();
        p.translate(cen.x, cen.y);
        p.rotate(p.HALF_PI + ang);
        p.fill(c);
        p.beginShape();
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.25 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 0.6 * this.headSize);
        p.curveVertex(1.3 * this.headSize, 1.2 * this.headSize);
        p.curveVertex(1.6 * this.headSize, 1.8 * this.headSize);
        p.curveVertex(1.2 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(0.0 * this.headSize, 1.55 * this.headSize);
        p.curveVertex(0, 1.5 * this.headSize);
        p.curveVertex(-0.0 * this.headSize, 1.55 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(-1.2 * this.headSize, 1.7 * this.headSize);
        p.curveVertex(-1.6 * this.headSize, 1.8 * this.headSize);
        p.curveVertex(-1.3 * this.headSize, 1.2 * this.headSize);
        p.curveVertex(-0.3 * this.headSize, 0.6 * this.headSize);
        p.curveVertex(-0.25 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0, -0.5 * this.headSize);
        p.curveVertex(0.25 * this.headSize, -0.2 * this.headSize);
        p.curveVertex(0.3 * this.headSize, 0.6 * this.headSize);
        p.endShape();
        p.pop();
    };

};

var myp5 = new p5(sketch, sketchContainer);