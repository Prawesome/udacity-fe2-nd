$(function() {
    $('body').removeClass('fade-out');
});

particlesJS.load('particles-js', 'js/particles.json', function() {
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

var eventEnablerFlag = true;
var clickFlag = false;
var currentFlag = false;

function randomizeCards() {
    list = shuffle(list);
    cards.each(function (index) {
        $(this).html('<i class="' + list[index] + '"></i>');
        index++;
    });
    console.log(list);
}

function resetBoard() {

    randomizeCards();
    moveCounter = 0;
    starCounter = 3;
    updateMoveCounter(moveCounter);

    stars.children().each(function (index) {
        $(this).children().removeClass('fa-star-o fade-out');
        $(this).children().addClass('fa-star');
    });

    cards.finish();
    cards.each(function () {
        $(this).removeClass('match show open');
    })
}

function updateMoveCounter(moveCounter) {
    if (moveCounter === 0 || moveCounter === 1 || moveCounter === undefined) {
        $('.moves').text(moveCounter + ' Move');
    } else {
        $('.moves').text(moveCounter + ' Moves');
    }

    updateStars();
}

function updateStars() {
    if ((moveCounter === 12 || moveCounter === 17 || moveCounter === 21) && (starCounter > 0)) {
        stars.children().each(function (index) {
            if ((index + 1) === starCounter) {
                $(this).children().addClass('fade-out')
                $(this).children().removeClass('fa-star');
                $(this).children().addClass('fa-star-o');
            }
        });
        starCounter--;
    }
}

function isCardsAnimationsDone() {
    return (currentFlag && clickFlag) ? true : false;
}

resetButton.click(function () {
    cards.finish();
    if (window.confirm('Are you sure you want to reset?')) {
        resetBoard();
    }
})

resetBoard();

cards.click(function (event) {

    clickedItem = $(event.target).children('i');
    var clickedItemClassName = clickedItem[0].className;
    
    if (!($(event.target).hasClass('match')) && !(clickedItem.is(currentlyOpen)) && eventEnablerFlag) {

        $(event.target).addClass('show open', 50);

        if (currentlyOpen) {
            if (currentlyOpen[0].className === clickedItemClassName) {
                matchedList.push(clickedItemClassName);
                currentlyOpen.parent().toggleClass('match show open', 200, function() {
                    currentlyOpen = null;
                });
                clickedItem.parent().toggleClass('match show open', 200, function() {
                    if (matchedList.length == 8) {
                        alert('You win!');
                        resetBoard();
                    }
                });
            } else {
                eventEnablerFlag = false;
                clickFlag = false;
                currentFlag = false;
                currentlyOpen.parent().effect('shake', {distance: 10, times: 2}, 200, function() {
                    currentlyOpen.parent().removeClass('show open');
                    currentlyOpen = null;

                    currentFlag = true;
                    eventEnablerFlag = isCardsAnimationsDone();
                });
                clickedItem.parent().effect('shake', {distance: 10, times: 2}, 200, function() {
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

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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