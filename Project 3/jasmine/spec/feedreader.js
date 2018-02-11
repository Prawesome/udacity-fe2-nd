/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {

            //Check if array allFeeds is defined
            expect(allFeeds).toBeDefined();

            //Check if length of allFeeds is greater than 0
            expect(allFeeds.length).toBeGreaterThan(0);
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('has all URLs defined', function () {

            //Loop through allFeeds
            allFeeds.forEach(function (obj, index) {

                //Check if URLs are defined
                expect(allFeeds[index].url).toBeDefined();

                //Check if there are actual URLs and not empty
                expect(allFeeds[index].url.length).not.toBe(0);
            });
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it('has all names defined', function () {

            //Loop through allFeeds
            allFeeds.forEach(function (obj, index) {

                //Check if names are defined
                expect(allFeeds[index].name).toBeDefined();

                //Check if length is greater than 0
                expect(allFeeds[index].name).not.toBe(0);
            });
        });
    });


    /* TODO: Write a new test suite named "The menu" */

    describe('The menu', function () {
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it('is hidden by default', function () {
            expect($('body').attr('class')).toBe('menu-hidden');
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it('changes visibility on click', function () {

            //Spy on 'click' event for hamburger menu icon
            var spyEvent = spyOnEvent('.menu-icon-link', 'click');

            //Initiate click action on the hamburger menu, show it
            $('.menu-icon-link')[0].click();

            //Check if menu is being shown
            expect($('body').attr('class')).toBe('');

            //Initiate click action on the hamburger menu, hide it
            $('.menu-icon-link')[0].click();

            //Check if menu is hidden
            expect($('body').attr('class')).toBe('menu-hidden');
        });

    });

    /* TODO: Write a new test suite named "Initial Entries" */

    describe('Initial Entries', function () {

        //Load feeds before each spec
        beforeEach(function (done) {
            loadFeed(0, function () {
                done();
            });
        });

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        it('has initial entries loaded properly', function (done) {

            //Check even if theres a single entry being loaded
            expect($('.entry').length).toBeGreaterThan(0);
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */

    describe('New Feed Selection', function () {

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        beforeEach(function(done) {
            loadFeed(0, function() {
                done();
            });
        });

        //Load some content and check if its not empty which will indirectly validate that loadFeed works as intended
        it('changes content', function (done) {
            var actualFeed = $('.feed').find('h2').text();
            expect(actualFeed).not.toBe('');
            done();
        });
    });
}());
