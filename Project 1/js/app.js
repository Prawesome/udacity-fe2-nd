//Fade in document body 
$(function () {
    $('body').removeClass('fade-out');
});

//Load particlesJS library
particlesJS.load('particles-js', 'js/particles.json', function () {
    console.log('callback - particles.js config loaded');
});

/*
 * Create a list that holds all of your cards
 */
var list = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

var cards = $('.card');
var stars = $('.stars');

var resetButton = $('.restart');
var matchedList = [];
var currentlyOpen;
var clickedItem;
var moveCounter = 0;
var starCounter = 3;

//flag variables to set various conditions
var eventEnablerFlag;
var clickFlag;
var currentFlag;
var starterFlag;

//variables for timers
var timerMinute1 = $('.timer-minute-1');
var timerMinute2 = $('.timer-minute-2');
var timerSecond1 = $('.timer-second-1');
var timerSecond2 = $('.timer-second-2');
var minutes;
var seconds;

//star elements in winner popup
var winStar1 = $('.win-star-1').children();
var winStar2 = $('.win-star-2').children();
var winStar3 = $('.win-star-3').children();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//randomizes the cards list and also changes the html according to the new list
function randomizeCards() {
    list = shuffle(list);
    cards.each(function (index) {
        $(this).html('<i class="' + list[index] + '"></i>');
        index++;
    });
    console.log(list);
}

//initialise flag, timer and counter variables to initial values
function resetValues() {
    eventEnablerFlag = true;
    clickFlag = false;
    currentFlag = false;
    starterFlag = false;
    moveCounter = 0;
    starCounter = 3;
    seconds = 0;
    minutes = 0;
    matchedList.length = 0;
}

//resets all DOM elements
function resetDOMElements() {
    timerMinute1.text('0');
    timerMinute2.text('0');
    timerSecond1.text('0');
    timerSecond2.text('0');

    winStar1.removeClass('fa-star');
    winStar2.removeClass('fa-star');
    winStar3.removeClass('fa-star');

    winStar1.addClass('fa-star-o');
    winStar2.addClass('fa-star-o');
    winStar3.addClass('fa-star-o');

    stars.children().each(function (index) {
        $(this).children().removeClass('fa-star-o fade-out');
        $(this).children().addClass('fa-star');
    });
}

//resets the whole board
function resetBoard() {

    randomizeCards();

    resetValues();

    resetDOMElements();

    updateMoveCounter(moveCounter);

    cards.finish();
    cards.each(function () {
        $(this).removeClass('match show open');
    });
}

//update the move counter according to the number of moves made
function updateMoveCounter(moveCounter) {
    if (moveCounter === 0 || moveCounter === 1 || moveCounter === undefined) {
        $('.moves').text(moveCounter + ' Move');
    } else {
        $('.moves').text(moveCounter + ' Moves');
    }

    updateStars();
}

//update the number of stars that the user has achieved according to the amount of moves he has made
function updateStars() {
    if ((moveCounter === 14 || moveCounter === 20) && (starCounter > 0)) {
        stars.children().each(function (index) {
            if ((index + 1) === starCounter) {
                $(this).children().addClass('fade-out');
                $(this).children().removeClass('fa-star');
                $(this).children().addClass('fa-star-o');
            }
        });
        starCounter--;
    }
}

//check if animations of both clickedItem and currentlyOpen have finished and return true if they have
function isCardsAnimationsDone() {
    return (currentFlag && clickFlag) ? true : false;
}

//fade in popup for reset
function openResetPopup() {
    $('.popup-outter').fadeIn('slow');
}

//fade out popup for reset
function closeResetPopup() {
    $('.popup-outter').fadeOut('slow');
}

//change star outline to star
function changeOutlineToStar(obj) {
    obj.toggleClass('fa-star-o fa-star');
}

//called when player has won the game, loads winning popup and resets board if user wants to play again
function winGame() {
    $('.win-popup').slideDown(600);

    switch (starCounter) {
        case 1:
            changeOutlineToStar(winStar1);
            break;
        case 2:
            changeOutlineToStar(winStar1);
            changeOutlineToStar(winStar2);
            break;
        case 3:
            changeOutlineToStar(winStar1);
            changeOutlineToStar(winStar2);
            changeOutlineToStar(winStar3);
            break;
    }

    $('.win-move-count').text(moveCounter);
    $('.win-timer-minute-2').text(timerMinute2.text());
    $('.win-timer-minute-1').text(timerMinute1.text());
    $('.win-timer-second-2').text(timerSecond2.text());
    $('.win-timer-second-1').text(timerSecond1.text());

    $('.success-button').click(function () {
        resetBoard();
        $('.win-popup').slideUp(600);
    });
}

//function which repeats every 1s. used to update timers
setInterval(function () {
    if (starterFlag) {
        seconds++;
        timerSecond1.text(seconds % 10);

        if (seconds % 60 && timerMinute1.text() === '9') {
            seconds = 0;
            timerSecond1.text(seconds);
            timerSecond2.text(seconds);
            timerMinute1.text(seconds);
            timerMinute2.text(Number(timerMinute2.text()) + 1);
        } else if (seconds % 60 === 0) {
            seconds = 0;
            timerSecond1.text(seconds);
            timerSecond2.text(seconds);
            timerMinute1.text(Number(timerMinute1.text()) + 1);
        } else if (seconds % 10 === 0) {
            timerSecond2.text(seconds / 10);
        }
    }
}, 1000);

//event listener for reset buttn in score panel
resetButton.click(function () {
    cards.finish();

    openResetPopup();

    $('.success-button').click(function () {
        resetBoard();
        closeResetPopup();
    });

    $('.cross-button').click(function () {
        closeResetPopup();
    });

    $(document).keyup(function (e) {
        if (e.keyCode === 13) { //listen for enter key
            resetBoard();
            closeResetPopup();
        } else if (e.keyCode === 27) { //listen for esc key
            closeResetPopup();
        }
    });
});

//reset board before every game
resetBoard();

//event listener for clicks on cards
cards.click(function (event) {

    //indicate game as started, used to start timer
    starterFlag = true;

    clickedItem = $(event.target).children('i');
    var clickedItemClassName = clickedItem[0].className;

    /*register card click only if clicked card is not already matched or is not the same card that was pressed in previous step
    * event enabler flag used to lock parallel clicks, ie. stop other cards from being clicked while execution of the current pair
    * is happening
    */
    if (!($(event.target).hasClass('match')) && !(clickedItem.is(currentlyOpen)) && eventEnablerFlag) {

        $(event.target).addClass('show open', 100);

        if (currentlyOpen) {
            if (currentlyOpen[0].className === clickedItemClassName) {
                matchedList.push(clickedItemClassName);
                currentlyOpen.parent().toggleClass('match show open', 200, function () {
                    currentlyOpen = null;
                });
                clickedItem.parent().toggleClass('match show open', 200, function () {
                    if (matchedList.length == 8) {
                        winGame();
                    }
                });
            } else {
                eventEnablerFlag = false;
                clickFlag = false;
                currentFlag = false;
                currentlyOpen.parent().effect('shake', { distance: 10, times: 2 }, 150, function () {
                    currentlyOpen.parent().removeClass('show open');
                    currentlyOpen = null;

                    currentFlag = true;
                    eventEnablerFlag = isCardsAnimationsDone();
                });
                clickedItem.parent().effect('shake', { distance: 10, times: 2 }, 150, function () {
                    clickedItem.parent().removeClass('show open');

                    clickFlag = true;
                    eventEnablerFlag = isCardsAnimationsDone();
                });
            }

            moveCounter++;
            updateMoveCounter(moveCounter);

        } else {
            currentlyOpen = clickedItem;
        }
    }
});
