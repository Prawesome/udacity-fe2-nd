var locations = [{
        position: {
            lat: 9.963006,
            lng: 76.295959
        },
        title: 'Shifu Momoz',
        fsid: '4f2125f9e4b0cebcfafbdb38',
        showing: true
    },
    {
        position: {
            lat: 9.963307,
            lng: 76.239558
        },
        title: 'Dal Roti',
        fsid: '4bc02bde74a9a59393c6cff6',
        showing: true
    },
    {
        position: {
            lat: 9.962164,
            lng: 76.288481
        },
        title: 'Milano Ice Cream',
        fsid: '50e1d1b5e4b047165a4f86f2',
        showing: true
    },
    {
        position: {
            lat: 9.967167,
            lng: 76.286532
        },
        title: 'Cocoa Tree',
        fsid: '4b990472f964a5201c5c35e3',
        showing: true
    },
    {
        position: {
            lat: 9.967133,
            lng: 76.243091
        },
        title: 'Kashi Art Cafe',
        fsid: '4c02baa80b8eef3b9e98b882',
        showing: true
    },
    {
        position: {
            lat: 10.027805,
            lng: 76.308762
        },
        title: 'Lulu mall',
        fsid: '4c892ca2a0ffb60ce24b28c5',
        showing: true
    }
];

//FourSquare IDs
var clientId = '1ADNIJHB33NI2I2IFRHKYFWSU3KTUEQXH3O35IVX3UXPTV1V';
var secretId = 'CZIO5JLQYN0OHUBYPMTC3SOKZ3RUIRKMMMLLEUXC45PXUFUZ';

//Map initialization function
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.9312,
            lng: 76.2673
        },
        zoom: 16
    });

    //Apply VM bindings
    ko.applyBindings(new ViewModel());
}

//Map error functions
function showError() {
    document.getElementById('map').textContent = "Map could not load";
}

//initialize the VM
var ViewModel = function () {

    //save 'this' reference
    var self = this;

    //declare map bounds and infoWindow
    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow();

    //declare empty array for markers
    self.markers = [];

    //declare filtering text to be used for filtering places
    self.filterText = ko.observable();

    locations.forEach(function (location) {

        //push marker into markers array
        self.markers.push(new google.maps.Marker({
            position: location.position,
            title: location.title,
            animation: google.maps.Animation.DROP,
            map: map,
            showing: ko.observable(location.showing),
            fourSquareId: location.fsid
        }));

        //get the index of the last element being inserted and its value at markers array
        let lastElementIndex = self.markers.length - 1;
        let currentMarker = self.markers[lastElementIndex];

        //extend the bounds of the map depending on the location of the marker that was last inserted
        bounds.extend(currentMarker.position);

        //set the current marker as visible
        currentMarker.setVisible(true);

        //call fillInfoWindow whenever the markers are clicked
        currentMarker.addListener('click', function () {
            self.fillInfoWindow(currentMarker, infoWindow);
            self.animateMarker(currentMarker);
        });
    });

    //fit the map to the defined bound 
    map.fitBounds(bounds);

    //check if the places passed as arg are the same place
    self.isSamePlace = function (place1, place2) {
        if (place1.toLowerCase().indexOf(place2.toLowerCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    //set visibility of all markers to true
    self.showAllMarkers = function () {
        self.markers.forEach(function (marker) {
            marker.setVisible(true);
            marker.showing(true);
        });
    }

    //used to apply filters to the map depending on the text in the input field
    self.applyFilters = function () {
        let inputText = self.filterText();

        //run only if the input field value length is not 0
        if (inputText.length !== 0) {
            self.markers.forEach(function (marker) {

                //check if the places are the same, then set them to visible; else, set the marker visibility to false
                if (self.isSamePlace(marker.title, inputText)) {
                    marker.setVisible(true);
                    marker.showing(true);
                } else {
                    marker.setVisible(false);
                    marker.showing(false);
                }

            });
        } else {

            //show all markers
            self.showAllMarkers();
        }

        //close the infowindow
        infoWindow.close();
    };

    //set selection on the marker
    self.setSelection = function (marker) {
        self.filterText(marker.title);
        self.applyFilters();
    }

    //animate marker
    self.animateMarker = function (marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
            marker.setAnimation(null);
        }, 600);
    };

    //populate info window with information
    self.fillInfoWindow = function (marker, infoWindow) {
        if (infoWindow.marker != marker) {
            infoWindow.marker = marker;

            //Foursquare information url
            let fsUrl = `https://api.foursquare.com/v2/venues/${marker.fourSquareId}?client_id=${clientId}&client_secret=${secretId}&v=20180404`;

            //Promise to retrieve information from foursquare and display information in infowindow
            fetch(fsUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    infoWindow.setContent(`
                    <div class="info-window"><a href="${json.response.venue.url}">${marker.title}</a><br>
                    Contact: ${json.response.venue.contact.formattedPhone}</div>
                `);

                    //open infowindow
                    infoWindow.open(map, marker);
                    console.log(json);
                })
                .catch(function(error) {
                    console.log('Error with promise');
                });

            //add exit click listener to infowindow
            infoWindow.addListener('closeClick', function () {
                infoWindow = null;
            });
        }
    }

    //set selection from clicks in list
    self.setSelection = function (marker) {
        self.animateMarker(marker);
        self.fillInfoWindow(marker, infoWindow);
    }
}