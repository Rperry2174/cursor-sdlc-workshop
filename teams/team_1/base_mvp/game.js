// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 760;
canvas.height = 500;

// Game state
let score = 0;
let gameTime = 45; // 45 seconds
let gameRunning = true;
let isLineDropping = false;
let lineX = canvas.width / 2;
let lineY = 0;
let lineLength = 0;
let fishCaughtThisLine = 0;
const BONUS_PER_EXTRA_FISH = 5;
const maxLineLength = canvas.height;
const lineSpeed = 5;
const targetScore = 100;

// Fish array
const fish = [];
const fishSpawnRate = 0.015; // Slower spawn rate
const fishSpeed = 1.2; // Slower fish movement

// Score and timer display
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameOverElement = document.getElementById('gameOver');
const gameOverTitleElement = document.getElementById('gameOverTitle');
const gameOverMessageElement = document.getElementById('gameOverMessage');

// Timer
let lastTime = Date.now();

// Fish class
class Fish {
    constructor() {
        this.x = Math.random() < 0.5 ? -30 : canvas.width + 30;
        this.y = Math.random() * (canvas.height - 100) + 50;
        this.size = 20 + Math.random() * 15;
        this.speed = fishSpeed + Math.random() * 0.5;
        this.direction = this.x < canvas.width / 2 ? 1 : -1;
        
        // Make fish yellow or orange
        const isOrange = Math.random() < 0.3; // 30% chance of orange
        if (isOrange) {
            this.color = '#FF8C00'; // Orange
            this.points = 5; // Orange fish worth 5 points
        } else {
            this.color = '#FFD700'; // Yellow
            this.points = 1; // Yellow fish worth 1 point
        }
    }

    update() {
        this.x += this.speed * this.direction;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.direction, 1);
        
        // Draw fish body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fish tail
        ctx.beginPath();
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(-this.size * 1.5, -this.size / 2);
        ctx.lineTo(-this.size * 1.5, this.size / 2);
        ctx.closePath();
        ctx.fill();
        
        // Draw eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.size * 0.3, -this.size * 0.2, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.size * 0.35, -this.size * 0.2, this.size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    isOffScreen() {
        return (this.direction > 0 && this.x > canvas.width + 30) ||
               (this.direction < 0 && this.x < -30);
    }

    checkCollision(lineX, lineY, lineLength) {
        const lineEndX = lineX;
        const lineEndY = lineY + lineLength;
        const distance = Math.sqrt(
            Math.pow(this.x - lineEndX, 2) + Math.pow(this.y - lineEndY, 2)
        );
        return distance < this.size;
    }
}

// Mouse event handlers - click and hold to drop line
canvas.addEventListener('mousedown', (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    lineX = e.clientX - rect.left;
    lineY = 0;
    isLineDropping = true;
    lineLength = 0;
    fishCaughtThisLine = 0;
});

canvas.addEventListener('mousemove', (e) => {
    if (isLineDropping && gameRunning) {
        const rect = canvas.getBoundingClientRect();
        lineX = e.clientX - rect.left;
    }
});

canvas.addEventListener('mouseup', () => {
    isLineDropping = false;
    lineLength = 0;
});

canvas.addEventListener('mouseleave', () => {
    isLineDropping = false;
    lineLength = 0;
});

// Update timer
function updateTimer() {
    if (!gameRunning) return;
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;
    
    gameTime -= deltaTime;
    
    if (gameTime <= 0) {
        gameTime = 0;
        endGame();
    }
    
    timerElement.textContent = Math.ceil(gameTime);
}

// End game function
function endGame() {
    gameRunning = false;
    
    // Check if player won or lost
    if (score >= targetScore) {
        gameOverTitleElement.textContent = 'You Win! 🎉';
        gameOverMessageElement.textContent = `You reached 100 points with ${Math.ceil(gameTime)} seconds remaining!`;
    } else {
        gameOverTitleElement.textContent = 'You Lost! 😢';
        gameOverMessageElement.textContent = `You scored ${score} points. You needed 100 to win!`;
    }
    
    gameOverElement.style.display = 'block';
}

// Draw static wave pattern
function drawWaves() {
    // Flat water color
    ctx.fillStyle = '#4682B4';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw static wave pattern (simple sine wave)
    ctx.strokeStyle = '#5A9BD4';
    ctx.lineWidth = 2;
    
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
            const waveY = y + Math.sin(x * 0.02) * 8;
            if (x === 0) {
                ctx.moveTo(x, waveY);
            } else {
                ctx.lineTo(x, waveY);
            }
        }
        ctx.stroke();
    }
    
    // Draw additional wave layers for depth
    ctx.strokeStyle = '#3A7BA4';
    ctx.lineWidth = 1.5;
    
    for (let y = 20; y < canvas.height; y += 60) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 2) {
            const waveY = y + Math.sin(x * 0.015 + Math.PI / 4) * 6;
            if (x === 0) {
                ctx.moveTo(x, waveY);
            } else {
                ctx.lineTo(x, waveY);
            }
        }
        ctx.stroke();
    }
}

// Game loop
function gameLoop() {
    // Update timer
    updateTimer();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw static wave background
    drawWaves();
    
    // Spawn fish (only if game is running)
    if (gameRunning && Math.random() < fishSpawnRate) {
        fish.push(new Fish());
    }
    
    // Update and draw fish
    for (let i = fish.length - 1; i >= 0; i--) {
        if (gameRunning) {
            fish[i].update();
        }
        fish[i].draw();
        
        // Remove fish that are off screen
        if (fish[i].isOffScreen()) {
            fish.splice(i, 1);
            continue;
        }
        
        // Check collision with fishing line
        if (gameRunning && isLineDropping && fish[i].checkCollision(lineX, lineY, lineLength)) {
            fishCaughtThisLine++;
            score += fish[i].points;
            if (fishCaughtThisLine >= 2) {
                score += BONUS_PER_EXTRA_FISH * (fishCaughtThisLine - 1);
            }
            scoreElement.textContent = score;
            
            fish.splice(i, 1);
            
            // Visual feedback - flash effect
            canvas.style.borderColor = '#FF6347';
            setTimeout(() => {
                canvas.style.borderColor = '#4682B4';
            }, 200);
        }
    }
    
    // Update fishing line
    if (isLineDropping && gameRunning && lineLength < maxLineLength) {
        lineLength += lineSpeed;
    }
    
    // Draw fishing line
    if (isLineDropping && gameRunning) {
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(lineX, lineY);
        ctx.lineTo(lineX, lineY + lineLength);
        ctx.stroke();
        
        // Draw hook at end of line
        ctx.fillStyle = '#696969';
        ctx.beginPath();
        ctx.arc(lineX, lineY + lineLength, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
