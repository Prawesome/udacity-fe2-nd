var locations = [{
        position: {
            lat: 9.963006, 
            lng: 76.295959
        },
        title: 'Shifu Momoz',
        fsid: '4f2125f9e4b0cebcfafbdb38'
    },
    {
        position: {
            lat: 9.963307,
            lng: 76.239558
        },
        title: 'Dal Roti',
        fsid: '4bc02bde74a9a59393c6cff6'
    },
    {
        position: {
            lat: 9.962164,
            lng: 76.288481
        },
        title: 'Milano Ice Cream',
        fsid: '50e1d1b5e4b047165a4f86f2'
    },
    {
        position: {
            lat: 9.967167,
            lng: 76.286532
        },
        title: 'Cocoa Tree',
        fsid: '4b990472f964a5201c5c35e3'
    },
    {
        position: {
            lat: 9.967133,
            lng: 76.243091
        },
        title: 'Kashi Art Cafe',
        fsid: '4c02baa80b8eef3b9e98b882'
    },
    {
        position: {
            lat: 10.027805,
            lng: 76.308762
        },
        title: 'Lulu mall',
        fsid: '4c892ca2a0ffb60ce24b28c5'
    }
];

var clientId = '1ADNIJHB33NI2I2IFRHKYFWSU3KTUEQXH3O35IVX3UXPTV1V';
var secretId = 'CZIO5JLQYN0OHUBYPMTC3SOKZ3RUIRKMMMLLEUXC45PXUFUZ';

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 9.9312,
            lng: 76.2673
        },
        zoom: 16
    });

    ko.applyBindings(new ViewModel());
}

function fillInfoWindow(marker, infoWindow) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;

        let fsUrl = `https://api.foursquare.com/v2/venues/${marker.fourSquareId}?client_id=${clientId}&client_secret=${secretId}&v=20180404`;

        fetch(fsUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                infoWindow.setContent(`
                    <div class="info-window"><a href="${json.response.venue.url}">${marker.title}</a></div>
                    <div>Contact: ${json.response.venue.contact.formattedPhone}</div>
                `);
                infoWindow.open(map, marker);
                console.log(json);
            });

        infoWindow.addListener('closeClick', function () {
            infoWindow = null;
        });
    }
}

var ViewModel = function () {
    var self = this;

    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow();

    this.markers = [];
    this.filterText = ko.observable();

    locations.forEach(function (location) {
        self.markers.push(new google.maps.Marker({
            position: location.position,
            title: location.title,
            animation: google.maps.Animation.DROP,
            map: map,
            fourSquareId: location.fsid
        }));

        let lastElementIndex = self.markers.length - 1;
        let currentMarker = self.markers[lastElementIndex];

        bounds.extend(currentMarker.position);
        currentMarker.setVisible(true);

        currentMarker.addListener('click', function () {
            fillInfoWindow(currentMarker, infoWindow);
        });
    });

    map.fitBounds(bounds);

    self.isSamePlace = function (place1, place2) {
        if (place1.toLowerCase().indexOf(place2.toLowerCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    self.showAllMarkers = function () {
        self.markers.forEach(function (marker) {
            marker.setVisible(true);
        });
    }

    self.applyFilters = function () {
        let inputText = self.filterText();
        if (inputText.length !== 0) {
            self.markers.forEach(function (marker) {
                if (self.isSamePlace(marker.title, inputText)) {
                    marker.setVisible(true);
                } else {
                    marker.setVisible(false);
                }
            });
        } else {
            self.showAllMarkers();
        }
        infoWindow.close();
    };

    self.setSelection = function (marker) {
        self.filterText(marker.title);
        self.applyFilters();
    }
}