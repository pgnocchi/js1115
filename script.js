let particles = [];
const num = 3000;
const noiseScale = 0.0025;
let bgColor;
let particleColor;
let particleSize = 3.5;

function setup() {
    createCanvas(1920, 1080);
    noCursor();
    for (let i = 0; i < num; i++) {
        particles.push(createVector(random(width), random(height)));
    }
    setColors();
}

function draw() {
    // Calculate transparency for trails based on mouse proximity to canvas
    let trailTransparency = map(dist(mouseX, mouseY, width / 2, height / 2), 0, max(width, height), 2, 10);
    
    // Background with dynamic transparency
    background(bgColor[0], bgColor[1], bgColor[2], mouseIsPressed ? trailTransparency : 5);

    for (let i = 0; i < num; i++) {
        let p = particles[i];
        
        // Default Perlin noise movement
        let n = noise(p.x * noiseScale, p.y * noiseScale);
        let a = TAU * n;
        p.x += cos(a);
        p.y += sin(a);

        // Display the particle with complementary color
        fill(particleColor[0], particleColor[1], particleColor[2]);
        noStroke();
        ellipse(p.x, p.y, particleSize);

        // Reset particle if it goes off screen
        if (!onScreen(p)) {
            p.x = random(width);
            p.y = random(height);
        }
    }
}

// Check if a particle is within the canvas bounds
function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

// Set random complementary colors for the background and particles
function setColors() {
    let hue = random(360);
    let sat = 80;
    let val = 80;

    bgColor = hsvToRgb(hue, sat, val);
    let compHue = (hue + 180) % 360;
    particleColor = hsvToRgb(compHue, sat, val);
}

// Converts HSV to RGB
function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    let c = v * s;
    let x = c * (1 - abs((h / 60) % 2 - 1));
    let m = v - c;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    return [floor((r + m) * 255), floor((g + m) * 255), floor((b + m) * 255)];
}

// Set new complementary colors on mouse press
function mousePressed() {
    setColors();
}

// Change noise seed on mouse release for particle pattern variation
function mouseReleased() {
    noiseSeed(millis());
}
