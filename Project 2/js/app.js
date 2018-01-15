/* TODOs
    escape key should close the tab, enter key should start new game
    dynamically increase speed of bugs with time, every 40s
*/
Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

let possibleProbabilities = [0.25, 0.30, 0.40, 0.60, 0.75, 0.80];

let timer = document.getElementsByClassName('score')[0];
let popup = document.getElementsByClassName('popup-outter')[0];
let selectorPopup = document.querySelector('.char-selector-inner');

let timerInterval = null;
let difficultyInterval = null;
let gameStarted = false;

function betweenPositions(val1, val2) {
    if (val1 > (val2 - 40) && val1 < (val2 + 40)) {
        return true;
    }
}

function updateStars() {
    let currentScore = timer.textContent;
    if (currentScore < 40) {
        document.querySelector('.win-star-3').style.display = 'none';
        document.querySelector('.win-star-2').style.display = 'none';
    } else if (currentScore < 80) {
        document.querySelector('.win-star-3').style.display = 'none';
    }
}

function endGame() {
    fadeIn(document.getElementsByClassName('popup-outter')[0], 200, 'block');
    document.querySelector('.pop-score').textContent = timer.textContent;

    updateStars();
    intervalManager(false);
    gameStarted = false;

    document.querySelector('.refresh-container').addEventListener('click', function () {
        startNewGame();
    });
}

function hidePopup() {
    fadeOut(document.getElementsByClassName('popup-outter')[0], 500);
}

function startNewGame() {
    hidePopup();
    timer.textContent = 0;
    player.resetPlayer();
}

function fadeIn(el, duration, display) {
    var s = el.style, step = 25 / (duration || 300);
    s.opacity = s.opacity || 0;
    s.display = display || "block";
    (function fade() { (s.opacity = parseFloat(s.opacity) + step) > 1 ? s.opacity = 1 : setTimeout(fade, 25); })();
}

function fadeOut(el, duration) {
    var s = el.style, step = 25 / (duration || 300);
    s.opacity = s.opacity || 1;
    (function fade() { (s.opacity -= step) < 0 ? s.display = "none" : setTimeout(fade, 25); })();
}

function intervalManager(flag) {
    if (flag) {
        timerInterval = setInterval(function () {
            timer.textContent++;
        }, 1000);
    } else {
        clearInterval(timerInterval);
    }
}

function increaseDifficulty(speeds) {
    for (speed of speeds) {
        speed += 0.25;
    }
}
/*
function increaseDifficulty(speeds, flag) {
    if (flag) {
        difficultyInterval = setInterval(function () {
            for (let speed of speeds) {
                
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
    }
}
*/
// Enemies our player must avoid
class Enemy {
    constructor() {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        this.possibleStarterPosns = [225, 140, 55];
        this.possibleSpeeds = [4, 5.25, 6];
        this.actualSpeed = this.possibleSpeeds.randomElement();

        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = -100;
        this.y = this.possibleStarterPosns.randomElement();
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    update(dt) {
        this.x += this.actualSpeed;
        if ((player.y === this.y) && betweenPositions(player.x, this.x)) {
            endGame();
            console.log('collide');
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor(imageURL = 'images/char-cat-girl.png') {
        this.sprite = imageURL;
        this.x = 200;
        this.y = 310;
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update() {
    }

    resetPlayer() {
        this.x = 200;
        this.y = 310;
        timer.textContent = 0;
    }

    handleInput(keycode) {
        switch (keycode) {
            case 'left':
                if (!(this.x === 0))
                    this.x -= 100;
                break;
            case 'right':
                if (!(this.x === 400))
                    this.x += 100;
                break;
            case 'up':
                if (!gameStarted) {
                    intervalManager(true);
                    gameStarted = true;
                }
                if (!(this.y < 50))
                    this.y -= 85;
                break;
            case 'down':
                if (!(this.y > 200))
                    this.y += 85;
                break;
        }
        if (this.y === -30) {
            endGame();
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
let player = new Player('images/char-cat-girl.png');

setInterval(function () {
    let probability = possibleProbabilities.randomElement();
    if (probability > 0.50) {
        allEnemies.push(new Enemy());
    }
}, 500);

$('.char-selector-inner').click(function (event) {
    player = new Player(event.target.getAttribute("data-value"));
    player.render();

    fadeOut(document.querySelector('.char-selector-outter'), 200);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener("keyup", function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});