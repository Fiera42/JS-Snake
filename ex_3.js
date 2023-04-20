'use strict'

window.addEventListener("load", load);

var canvas;
var ctx;
var width;
var height;
var gridWidth;
var gridHeight;
var snake;
var snakeLastCell;
var snakeLastCellPrevX;
var snakeLastCellPrevY;
var food;
var dirBuffer;
var playGridSize;
var prevMove = null;

function load() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    width = canvas.width;
    height = canvas.height;

    playGridSize = parseInt(Math.min(width/40, height/40));

    gridWidth = parseInt(width / playGridSize);
    gridHeight = parseInt(height / playGridSize);

    let initSnakeX = parseInt(gridWidth/2);
    let initSnakeY = parseInt(gridHeight/2);
    if(initSnakeX % 2 === 0) initSnakeX++;
    if(initSnakeY % 2 === 0) initSnakeY++;
    
    snake = new SnakePart(null, initSnakeX, initSnakeY);
    snake.child = new SnakePart(null, snake.x + 2, snake.y);
    snake.child.child = new SnakePart(null, snake.child.x + 2, snake.child.y);
    snake.child.child.child = new SnakePart(null, snake.child.child.x + 2, snake.child.child.y);
    snakeLastCell = snake.child.child.child;

    food = new Food();
    
    document.addEventListener('keydown', keyBoardRequest);

    setInterval(updatePosition, 150);
    updatePosition();
}

function keyBoardRequest(e) {
    if(e.code === "ArrowUp" && prevMove !== "ArrowDown") dirBuffer = e.code;
    if(e.code === "ArrowDown" && prevMove !== "ArrowUp") dirBuffer = e.code;
    if(e.code === "ArrowRight" && prevMove !== "ArrowLeft" && prevMove != null) dirBuffer = e.code;
    if(e.code === "ArrowLeft" && prevMove !== "ArrowRight") dirBuffer = e.code;
}

function updatePosition() {
    snakeLastCellPrevX = snakeLastCell.x;
    snakeLastCellPrevY = snakeLastCell.y;
    var nextPos = calcNextPos();
    if(prevMove != null) snake.moveMe(nextPos.x, nextPos.y);
    eatFood();

    ctx.fillStyle = 'rgb(0,255,0,100)';
    ctx.fillRect(0,0, width, height);
    ctx.fillStyle = 'green';
    food.drawMe();
    snake.drawMe();
    if(checkColision()) death();
}

function calcNextPos() {

    var nextPos = {
        x : snake.x,
        y : snake.y
    }

    prevMove = dirBuffer;

    if(prevMove === "ArrowUp") nextPos.y -= 2;
    if(prevMove === "ArrowDown") nextPos.y += 2;
    if(prevMove === "ArrowRight") nextPos.x += 2;
    if(prevMove === "ArrowLeft") nextPos.x -= 2;

    return nextPos;
}

function checkColision() {
    var snakePart = snake;
    var headX = snake.x;
    var headY = snake.y;

    if(headX > gridWidth || headX < 0 || headY > gridHeight || headY < 0) return true;

    
    while(snakePart.child !== null) {
        if(headX === snakePart.child.x && headY === snakePart.child.y) return true;
        snakePart = snakePart.child;
    } 
    
    return false;
}

function death() {
    console.log("Dead");
    snake = null;
}

function eatFood() {
    if(snake.x === food.x && snake.y === food.y) {
        snakeLastCell.child = new SnakePart(null, snakeLastCellPrevX, snakeLastCellPrevY);
        snakeLastCell = snakeLastCell.child;
        food = new Food();
    }
}

function SnakePart(child, x, y) {
    this.x = x ;
    this.y = y;
    this.child = child;
    this.color = "green";
    this.moveMe = (newX, newY) => {
        var tempX = this.x;
        var tempY = this.y;
        this.x = newX;
        this.y = newY;
        if(this.child != null) this.child.moveMe(tempX, tempY);
    }
    this.drawMe = () => {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * playGridSize, this.y * playGridSize, playGridSize, 0 , 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if(this.child != null) this.child.drawMe();
    }
}

function Food() {
    this.x = 0;
    this.y = 0;
    while(this.x % 2 === 0 || this.y % 2 === 0) {
        this.x = Math.floor(gridWidth * Math.random());
        this.y = Math.floor(gridHeight * Math.random());
    }
    this.color = "red";
    this.drawMe = () => {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x * playGridSize, this.y * playGridSize, playGridSize, 0 , 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
    }
}

function drawDebugGrid() {
    for(var y = 0; y < gridHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * playGridSize);
        ctx.lineTo(width, y * playGridSize);
        ctx.stroke();
    }

    for(var x = 0; x < gridWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * playGridSize, 0);
        ctx.lineTo(x * playGridSize, height);
        ctx.stroke();
    }
}