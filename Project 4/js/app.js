var locations = [{
        position: {
            lat: 9.994188,
            lng: 76.358455
        },
        title: 'Rajagiri'
    },
    {
        position: {
            lat: 9.992949,
            lng: 76.357550
        },
        title: 'Chaayakada'
    },
    {
        position: {
            lat: 9.993730,
            lng: 76.346962
        },
        title: 'Cricket ground'
    },
    {
        position: {
            lat: 9.994268,
            lng: 76.357144
        },
        title: 'South Indian Bank ATM'
    },
    {
        position: {
            lat: 9.995134,
            lng: 76.360288
        },
        title: 'Caesar\'s Cafe'
    }
];

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
        infoWindow.setContent(`<div>${marker.title}</div>`);
        infoWindow.open(map, marker);

        infoWindow.addListener('closeClick', function () {
            infoWindow = null;
        });
    }
}

var ViewModel = function () {
    var self = this;
    
    var bounds = new google.maps.LatLngBounds();
    var infoWindow = new google.maps.InfoWindow();

    self.markers = [];

    locations.forEach(function(location) {
        self.markers.push(new google.maps.Marker({
            position: location.position,
            title: location.title,
            animation: google.maps.Animation.DROP,
            map: map
        }));

        let lastElementIndex = self.markers.length - 1;
        let currentMarker = self.markers[lastElementIndex];

        bounds.extend(currentMarker.position);
        currentMarker.setVisible(true);

        currentMarker.addListener('click', function() {
            fillInfoWindow(currentMarker, infoWindow);
        });
    });

    map.fitBounds(bounds);
}