/*
 * Create a list that holds all of your cards
 */
var list = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube", "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];
var matchedList = [];
var currentlyOpen;
list = shuffle(list);
var cards = $('.card');
console.log(cards);
cards.each(function (index) {
    $(this).html('<i class="' + list[index] + '"></i>');
    index++;
});
console.log(list);
cards.click(function (event) {
    if (!($(event.target).hasClass('match'))) {
        var clickedItem = $(event.target).children('i');
        var clickedItemClassName = clickedItem[0].className;
        $(event.target).toggleClass("show open");
        console.log(clickedItem);
        console.log(currentlyOpen);
        console.log(matchedList);

        if (currentlyOpen) {
            if ((currentlyOpen[0].className === clickedItemClassName) && !(clickedItem.is(currentlyOpen))) {
                matchedList.push(clickedItemClassName);
                currentlyOpen.parent().toggleClass('match show open');
                clickedItem.parent().toggleClass('match show open');
            } else {
                window.setTimeout(function() {
                    currentlyOpen.parent().toggleClass('show open');
                    clickedItem.parent().toggleClass('show open');
                }, 1000);
            }
            currentlyOpen = null;
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
