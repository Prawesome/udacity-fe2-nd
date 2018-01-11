Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)];
}

let possibleProbabilities = [0.25, 0.30, 0.40, 0.60, 0.75, 0.80];
let gameStarted = false;

function betweenPositions(val1, val2) {
    if (val1 > (val2 - 40) && val1 < (val2 + 40)) {
        return true;
    }
}

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
            player.resetPlayer();
            console.log('collide') //collision is not happening when speed is increasing at too great a value
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
    constructor() {
        this.sprite = 'images/char-boy.png';
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
    }

    handleInput(keycode) {
        gameStarted = true;
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
                if (!(this.y < 50))
                    this.y -= 85;
                break;
            case 'down':
                if (!(this.y > 200))
                    this.y += 85;
                break;
        }
        if(this.y === -30) {
            this.resetPlayer();
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let player = new Player();
let allEnemies = [];

setInterval(function () {
    let probability = possibleProbabilities.randomElement();
    if (probability > 0.50) {
        allEnemies.push(new Enemy());
    }
}, 500);

//TODO: Reset score on game reset
setInterval(function () {
    if (gameStarted) {
        document.getElementsByClassName('score')[0].textContent++;
    }
}, 1000);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
