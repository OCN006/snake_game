// Game variables
let inputDir = { x: 0, y: 0 };
let lastPaintTime = 0;
let speed = 6;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let isPaused = false;

// DOM elements
const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");
const arrowUp = document.getElementById("up");
const arrowDown = document.getElementById("down");
const arrowLeft = document.getElementById("left");
const arrowRight = document.getElementById("right");

// Sound (optional)
// const foodSound = new Audio('food.mp3');
// const gameOverSound = new Audio('gameover.mp3');

// Game loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if (isPaused) return;

    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If snake bumps into itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    // If snake bumps into wall
    return (
        snake[0].x <= 0 || snake[0].x >= 18 ||
        snake[0].y <= 0 || snake[0].y >= 18
    );
}

function gameEngine() {
    // Collision check
    if (isCollide(snakeArr)) {
        alert("Game Over. Press OK to restart.");
        location.reload();
        return;
    }

    // Food eaten
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        // foodSound.play();
        score++;
        scoreBox.innerText = "Score: " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        food = {
            x: Math.floor(Math.random() * 16) + 2,
            y: Math.floor(Math.random() * 16) + 2
        };
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render
    board.innerHTML = "";
    snakeArr.forEach((e, i) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(i === 0 ? "head" : "snake");
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// Keyboard input
window.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowUp":
            inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            inputDir = { x: 1, y: 0 };
            break;
    }
});

// Arrow button input
arrowUp.addEventListener("click", () => {
    if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
});
arrowDown.addEventListener("click", () => {
    if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
});
arrowLeft.addEventListener("click", () => {
    if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
});
arrowRight.addEventListener("click", () => {
    if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
});

// Pause/Restart buttons
pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.innerText = isPaused ? "▶️ Resume" : "⏸️ Pause";
});

restartBtn.addEventListener("click", () => {
    location.reload();
});

// Start game
window.requestAnimationFrame(main);
