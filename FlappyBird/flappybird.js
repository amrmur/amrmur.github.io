// board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImgs = [];
let birdImgsIndex = 0;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

// pipes
let pipeArray = []
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

// physics
let velocityX = -2; // pipe moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

let wingSound = new Audio("./sfx_wing.wav");
let hitSound = new Audio("./sfx_hit.wav");
let pointSound = new Audio("./sfx_point.wav");

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); // used for drawing on the board
    board.addEventListener("click", moveBird2);

    for(let i = 0; i < 4; i++){
        let birdImg = new Image();
        birdImg.src = `./flappybird${i}.png`;
        birdImgs.push(birdImg);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // every 1.5 seconds
    setInterval(animateBird, 100); // every 0.1 seconds
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update); // sets up an animation loop where this update function will happen before the next frame is drawn
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height)

    // bird
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImgs[birdImgsIndex], bird.x, bird.y, bird.width, bird.height);

    if(bird.y + bird.height > board.height) {
        gameOver = true;
    }

    // pipes
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        velocityX -= 0.0003;
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
            pointSound.play();
        }

        if(detectCollision(bird, pipe)) {
            gameOver = true;
            hitSound.play();
        }
    }

    // clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -1 * pipeWidth) {
        pipeArray.shift(); // removes the first length
    }

    // score
    context.fillStyle = "white";
    context.font= "45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function animateBird() {
    birdImgsIndex++;
    birdImgsIndex %= birdImgs.length;
}

function placePipes() {
    if(gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        // jump
        wingSound.play();
        velocityY = Math.min(velocityY-6, -6);

        // resetGame
        if(gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function moveBird2() {
    wingSound.play();
    velocityY = Math.min(velocityY-6, -6);

    if(gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}
