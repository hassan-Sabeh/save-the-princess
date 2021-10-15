const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d');
let heroXPosition = 100;
let heroYPosition = 100;
let hero = new Hero (heroXPosition, heroYPosition);
let myWorld = new World(heroXPosition, hero.w);
var positionCounter = 0;
var heroFront = heroXPosition + hero.w;
// var currentPixelPosition;
console.log('hereh');
var timeoutId;
//normally at 15
var maxSpeed = 1;
var movementFrames = 0;
var movementDirection = '';
var animtId;
var obstacleCollision = false;
var worldElementsObj;
var gameState = true;

const groundRefObjs = {
    'stairsUp1': myWorld.stairsUp1.boundaries,
    'block1'   : myWorld.block1.boundaries,
}


function draw() {
    ctx.clearRect(0, 0, myWorld.worldLength, 300);
    worldElementsObj =  myWorld.updateWorld();
    // checkCollisions();
    checkPotentialRef()
    hero.update();
    checkHits();
    // console.log(hero.y);
}

function checkHits () {
    if (!hero.fallingState || hero.y > canvas.height) {
        gameOverSequence();
        gameState = false;
        maxSpeed = 0;
        hero.zeroPotential = 1000;
    }
    else {
        //continue flapping 
    }
}
function gameOverSequence() {
    hero.color = 'red';
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("You lost :/ type 'r' to reload", canvas.width/2, canvas.height/2);
    // var w = 25;
    // var imgRatio = img.naturalWidth/img.naturalHeight;;
    // var h = w/imgRatio;
    // var img = document.createElement('img');
    // img.src = "game_over_man.jpg";
    // console.log(w)
    // ctx.drawImage(img, 125, 200, w, h);
}

function checkPotentialRef() {
    // console.log(worldElementsObj);
    let beingCrossedArr = Object.entries(worldElementsObj).filter(([key, values]) => values === true);
    if (beingCrossedArr[0] && beingCrossedArr[0][0].includes('stairs') ){
        // console.log(myWorld[beingCrossedArr[0][0]].boundaries[2].start,myWorld[beingCrossedArr[0][0]].boundaries[2].end)
        if (heroFront > myWorld[beingCrossedArr[0][0]].boundaries[1].start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries[1].end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries[1].zeroPotential
            // console.log('here');
        }
        else if (heroFront > myWorld[beingCrossedArr[0][0]].boundaries[2].start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries[2].end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries[2].zeroPotential
            // console.log(myWorld[beingCrossedArr[0][0]].boundaries[2].start,myWorld[beingCrossedArr[0][0]].boundaries[2].end)
        }
        else if (heroFront >myWorld[beingCrossedArr[0][0]].boundaries[3].start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries[3].end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries[3].zeroPotential
            // console.log("in the 3rd")
        }
        else if (heroFront > myWorld[beingCrossedArr[0][0]].boundaries[4].start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries[4].end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries[4].zeroPotential
            // console.log(myWorld[beingCrossedArr[0][0]].boundaries[4].start)
        }
        else if (heroFront > myWorld[beingCrossedArr[0][0]].boundaries[5].start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries[5].end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries[5].zeroPotential
            // console.log(myWorld[beingCrossedArr[0][0]].boundaries[5].start)
        }
    }
    if (beingCrossedArr[0]) {
        if (heroFront > myWorld[beingCrossedArr[0][0]].boundaries.start && heroFront < myWorld[beingCrossedArr[0][0]].boundaries.end) {
            hero.zeroPotential = myWorld[beingCrossedArr[0][0]].boundaries.zeroPotential;
            // console.log('here');
        }
    }
    
    else {
        hero.zeroPotential = 240;
        // console.log(hero.zeroPotential);
    }
}

function move(direction){
    let translateDirection;
    if (direction === 'backwards' &&  obstacleCollision === false) {
        // console.log(obstacleCollision);
        myWorld.speedX = maxSpeed;
    }
    else if (direction === 'farward' && obstacleCollision === false){
        myWorld.speedX = -1*maxSpeed;
    }
    else {myWorld.speedX = 0;}
}


const keyState = {
    space: false,
    right: false,
    left:  false,
}

function checkCommands() {
    let noKeysPressed = true;
    Object.values(keyState).forEach(val => {
        if (val) {
            noKeysPressed = false;
        }
    });   
    return noKeysPressed;
}

document.addEventListener('keydown', event => {
    var direction = '';
    if(event.keyCode === 39) {
        keyState.right = true;
        direction = 'farward';
        move(direction);
    }
    else if (event.keyCode === 37) {
        keyState.left = true;
        direction = 'backwards';
        move(direction);
    }    
    else if(event.keyCode === 32) {
        keyState.space = true;
        if (keyState.right) {
            move('farward');
            hero.jump();
        }
        else if (keyState.left) {
            move('backwards');
            hero.jump();
        }
        else {hero.jump();}
    }
});

document.addEventListener('keyup', event => {
    if(event.keyCode === 39) {
        keyState.right = false;
        move('none');
    }
    else if (event.keyCode === 37) {
        movementFrames = 0;
        keyState.left = false;
        move('none');
    }    
    else if(event.keyCode === 32) {
        movementFrames = 0;
        keyState.space = false;
        if (keyState.right) {
            move('farward');
        }
        else if (keyState.left) {
            move('backwards');
        }
        // else {}
    }

});

let commandsStatus

function anim() { 
    // if (!gameState) {
    //     console.log('game over');
    //     cancelAnimationFrame(animtId);  
    //     return;
    // }
    commandsStatus = checkCommands()
    animtId = window.requestAnimationFrame(anim);
    draw();
} 
window.requestAnimationFrame(anim);

document.addEventListener('keydown', event => {
    if(event.keyCode === 82) {
        location.reload();
    }
});