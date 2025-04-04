/* Snake game
Move: WASD
Food: increases score and grows snake
Food also randomly spawns and respawns when eaten
Game over: hit back of snake or boundaries
Shows score and gives retry option 

Notes:
parts of snake stored as an array
snake can't move backward
*/

let screen;
let screenWidth = 510;
let screenHeight = 510;
let context;

let tileSize = 30;

let snakeWidth = tileSize;
let snakeHeight = tileSize;
let snakeStartX = screenWidth / 2 - tileSize / 2;
let snakeStartY = screenWidth / 2 - tileSize / 2;
let snakeStartDir = "s";
let direction = snakeStartDir;

let snake = {
  parts: [{ x: snakeStartX, y: snakeStartY }],
  width: snakeWidth,
  height: snakeHeight,
};

let food = {
  x: Math.floor(Math.random() * 16) * tileSize,
  y: Math.floor(Math.random() * 16) * tileSize,
  width: tileSize,
  height: tileSize,
};

let score = 0;
let gameOver = false;

window.onload = function () {
  screen = document.getElementById("screen");
  screen.height = screenHeight;
  screen.width = screenWidth;
  context = screen.getContext("2d");

  document.addEventListener("keydown", logMove);
  setInterval(moveSnake, 150);
  requestAnimationFrame(drawLoop);
};

function randomizeFood() {
  food.x = Math.floor(Math.random() * 16) * tileSize;
  food.y = Math.floor(Math.random() * 16) * tileSize;
}

function logMove(e) {
  switch (e.key) {
    case "w":
      if (direction != "s") direction = "w";
      break;
    case "a":
      if (direction != "d") direction = "a";
      break;
    case "s":
      if (direction != "w") direction = "s";
      break;
    case "d":
      if (direction != "a") direction = "d";
      break;
    case " ":
      console.log("space pressed");
      if (gameOver) {
        randomizeFood();
        snake.parts = [{ x: snakeStartX, y: snakeStartY }];
        direction = snakeStartDir;
        score = 0;
        gameOver = false;
      }
      break;
  }
}

function moveSnake() {
  for (let i = snake.parts.length - 1; i > 0; i--) {
    snake.parts[i].x = snake.parts[i - 1].x;
    snake.parts[i].y = snake.parts[i - 1].y;
  }
  switch (direction) {
    case "w":
      snake.parts[0].y -= tileSize;
      break;
    case "a":
      snake.parts[0].x -= tileSize;
      break;
    case "s":
      snake.parts[0].y += tileSize;
      break;
    case "d":
      snake.parts[0].x += tileSize;
      break;
  }
}

const targetFPS = 60;
const frameInterval = 1000 / targetFPS;
let lastFrameTime = performance.now();
let currentTime;
let elapsed;

function drawLoop() {
  requestAnimationFrame(drawLoop);
  currentTime = performance.now();
  elapsed = currentTime - lastFrameTime;

  if (elapsed >= frameInterval) {
    lastFrameTime = lastFrameTime - (elapsed % frameInterval);

    update();
    draw();
  }
}

function detColSnakeFood(a, b) {
  return (
    a.parts[0].x < b.x + b.width &&
    a.parts[0].x + a.width > b.x &&
    a.parts[0].y < b.y + b.height &&
    a.parts[0].y + a.height > b.y
  );
}

function detColSnake(snake, a, b) {
  return (
    snake.parts[a].x < snake.parts[b].x + snake.width &&
    snake.parts[a].x + snake.width > snake.parts[b].x &&
    snake.parts[a].y < snake.parts[b].y + snake.height &&
    snake.parts[a].y + snake.height > snake.parts[b].y
  );
}

function update() {
  if (detColSnakeFood(snake, food)) {
    snake.parts.push({ x: -30, y: -30 });

    randomizeFood();

    score += 10;
  }
  if (
    snake.parts[0].x < 0 ||
    snake.parts[0].y < 0 ||
    snake.parts[0].x >= screenWidth ||
    snake.parts[0].y >= screenHeight
  ) {
    gameOver = true;
  }

  for (let i = 1; i < snake.parts.length; i++) {
    if (detColSnake(snake, 0, i)) {
      gameOver = true;
    }
  }
}

function draw() {
  if (gameOver) {
    context.fillStyle = "white";
    context.font = "35px sans-serif";
    context.fillText(`Game Over! Space to restart.`, 5, 90);
    return;
  }
  context.fillStyle = "black";
  context.fillRect(0, 0, 510, 510);

  context.fillStyle = "red";
  context.fillRect(food.x, food.y, food.width, food.height);
  context.lineWidth = 3;
  context.fillStyle = "yellow";

  for (let i = 0; i < snake.parts.length; i++) {
    context.fillRect(
      snake.parts[i].x + context.lineWidth / 2,
      snake.parts[i].y + context.lineWidth / 2,
      snake.width - context.lineWidth,
      snake.height - context.lineWidth
    );
  }

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(`Score: ${score}`, 5, 45);
}
