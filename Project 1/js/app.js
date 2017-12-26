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

function randomizeCards() {
    list = shuffle(list);
    cards.each(function (index) {
        $(this).html('<i class="' + list[index] + '"></i>');
        index++;
    });
}

function resetBoard() {
    
    randomizeCards();
    moveCounter = 0;
    starCounter = 3;
    updateMoveCounter(moveCounter);

    stars.children().each(function(index) {
        $(this).children().removeClass('fa-star-o');
        $(this).children().addClass('fa-star');
    });

    cards.finish();
    cards.each(function() {
        $(this).removeClass('match show open');
    })
}

function updateMoveCounter(moveCounter) {
    if(moveCounter === 0 || moveCounter === 1 || moveCounter === undefined) {
        $('.moves').text(moveCounter + ' Move');
    } else {
        $('.moves').text(moveCounter + ' Moves');
    }

    updateStars();
}
//TODO: update stars in panel
function updateStars() {
    if((moveCounter === 12 || moveCounter === 16 || moveCounter === 20) && starCounter > 0) {
        stars.children().each(function(index) {
            if((index + 1) === starCounter) {
                $(this).children().removeClass('fa-star');
                $(this).children().addClass('fa-star-o');
            }
        });
        starCounter--;
    }
}

resetButton.click(function() {
    if(window.confirm("Are you sure you want to reset?")) {
        resetBoard();
    }
})

resetBoard();

/*
var waitForUser = function(obj1, obj2) {
    obj1.parent().toggleClass('show open');
    obj2.parent().toggleClass('show open');
}
*/

function setCurrentlyOpenNull () {
    currentlyOpen = null;
}

function checkForWin() {
    if(matchedList.length == 8) {
        currentlyOpen.finish();
        clickedItem.finish();
        alert('You win!');
        resetBoard();
    }
} 

console.log(list);
cards.click(function (event) {
    if (!($(event.target).hasClass('match'))) {
        clickedItem = $(event.target).children('i');
        var clickedItemClassName = clickedItem[0].className;
        $(event.target).toggleClass("show open");
        //console.log(clickedItem);
        //console.log(currentlyOpen);
        //console.log(matchedList);

        if (currentlyOpen) {
            if ((currentlyOpen[0].className === clickedItemClassName) && !(clickedItem.is(currentlyOpen))) {
                matchedList.push(clickedItemClassName);
                currentlyOpen.parent().toggleClass('match show open', 200);
                clickedItem.parent().toggleClass('match show open', 200, checkForWin());
            } else {
                //TODO: Work on same element click
                currentlyOpen.parent().toggleClass('show open', 1500, "easeInBounce");
                clickedItem.parent().toggleClass('show open', 1500, "easeInBounce");
            }
            currentlyOpen = null;

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
