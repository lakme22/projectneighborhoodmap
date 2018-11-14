import React, { Component } from 'react';
import './App.css';
import LocationList from './LocationList';
import Modal from './Modal';
import escapeRegExp from 'escape-string-regexp';
import * as FlickrAPI from './FlickrAPI';
import restaurant from './restaurant.json';
import markerIcon from './map-marker.png';

let markers = [];
let marker = '';
let infowindows = [];
let map = '';
let i;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      workingList: [],
      infowindow: null,
      infowindows: [],
      map: '',
      markers: [],
      isVisible: false,
      query: '',
      modalTitle: '',
      marker: [],
      searchHidden:
        window.innerWidth > 550 ? false : window.innerWidth < 550 ? true : null,
      bounds: {}
    };
    this.drawMap = this.drawMap.bind(this);
    this.updateQuery = this.updateQuery.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.screenListener = this.screenListener.bind(this);
    this.errMsg = this.errMsg.bind(this);
    this.loadJS = this.loadJS.bind(this);
  }

  componentDidMount() {
    window.drawMap = this.drawMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    this.loadJS(
      'https://maps.googleapis.com/maps/api/js?key=AIzaSyA-1EzL2-xCg_e8JfgGazciAeFBx445O2Y&callback=drawMap'
    );

    this.screenListener();
    //when offline,
    if (!navigator.onLine) this.errMsg();
  }

  //this appends the map API to the dom
  loadJS(src) {
    let ref = window.document.getElementsByTagName('script')[0];
    let script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    script.onerror = this.errMsg;
    ref.parentNode.insertBefore(script, ref);
  }

  //initializing Google Maps showing Tirunelveli
  drawMap() {
    let Tirunelveli = new window.google.maps.LatLng(11.127123, 78.656891);
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: Tirunelveli,
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    this.setState({ map: map });

    let bounds = new window.google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (let i = 0; i < restaurant.length; i++) {
      // Get the position from the location array.
      let position = restaurant[i].location;
      let title = restaurant[i].name;
      let id = restaurant[i].id;
      // Create a marker per location, and put into markers array.
      let marker = new window.google.maps.Marker({
        map: map,
        position: position,
        title: title,
        icon: markerIcon,
        id: id,
        animation: window.google.maps.Animation.DROP
      });
      marker.addListener('click', toggleBounce);
      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          // marker.setAnimation(window.google.maps.Animation.BOUNCE);
          marker.setAnimation(4);
        }
      }
      // Push the marker to our array of markers.
      markers.push(marker);

      var infowindow = new window.google.maps.InfoWindow({
        map: map,
        title: title,
        id: id,
        maxWidth: 200
      });
      let self = this;
      // Create an onclick event to open an infowindow at each marker.
      // eslint-disable-next-line
      marker.openInfoWindow = function() {
        let content =
          `<div id='info'>` +
          `<div><strong><h1>${marker.title}</h1></strong></div>` +
          `<div><p>` +
          `One of the Best Restaurants in Tirunelveli` +
          `</div></p>` +
          `<div><strong><p>` +
          `<a href="https://www.flickr.com/search/?text=%20tirunelveli%20restaurant">` +
          `Click for pictures` +
          `</a>` +
          `</p></strong></div>` +
          `</div>`;

        if (infowindow) infowindow.close();
        infowindow = new window.google.maps.InfoWindow({ content: content });
        infowindow.open(map, marker);
        self.openModal();
        self.setState({ modalTitle: title });
        self.setState({ infowindow: infowindow });
      };
      // put the method in as a handler
      // eslint-disable-next-line
      window.google.maps.event.addListener(
        marker,
        'click',
        marker.openInfoWindow
      );
      /* tried to add some animation for marker,will be addressing this issue in future 
       https://stackoverflow.com/questions/40739353/google-maps-animate-particular-marker-on-click */
      // window.google.maps.event.addListener(
      //   marker,
      //   'click',
      //   (function(marker, i) {
      //     return function() {
      //       if (marker.getAnimation() != null) {
      //         marker.setAnimation(null);
      //       } else {
      //         marker.setAnimation(window.google.maps.Animation.BOUNCE);
      //       }
      //     };
      //   })(marker, i)
      // );
      bounds.extend(markers[i].position);
      this.setState({
        locations: restaurant,
        workingList: restaurant,
        infowindows: infowindows,
        markers: markers,
        bounds: bounds
      });
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
  }

  //display a message when offline
  errMsg() {
    let root = document.getElementById('map');
    let divMsg = document.createElement('DIV');
    divMsg.innerHTML = `<div class="error">Google Maps failed to load. <br>
        Please come back later!</div>`;
    root.prepend(divMsg);
  }

  openModal(infowindow) {
    if (infowindow) infowindow.close();
    let self = this;
    let info = document.getElementById('info');
    window.google.maps.event.addDomListener(info, 'click', function() {
      self.setState({ isVisible: true });
      FlickrAPI.fetchFlickrImages(self.state.modalTitle);
    });
  }

  closeModal(map, marker) {
    this.setState({ isVisible: false });
    this.state.infowindow.close(map, marker);
  }

  updateQuery(query, infowindow) {
    let workingList = this.state.workingList;
    let locations = this.state.locations;
    let markers = this.state.markers;
    this.setState({ query }); //or query.trim()
    markers.forEach(marker => marker.setVisible(true)); //turn markers on

    if (query) {
      // eslint-disable-next-line
      this.state.infowindow === null
        ? null
        : this.state.infowindow !== null
          ? this.state.infowindow.close(map, marker)
          : null;

      const match = new RegExp(escapeRegExp(query), 'i');
      workingList = locations.filter(location => match.test(location.name));
      //Loop through both arrays an return an array with markers not represented by markers
      const notVisible = markers.filter(marker =>
        workingList.every(place => place.id !== marker.id)
      );
      notVisible.forEach(marker => marker.setVisible(false)); // turn them off
    } else {
      workingList = locations;
    }
    this.setState({ workingList });
  }

  handleClick(e, index) {
    let locations = this.state.locations;
    let markers = this.state.markers;
    e.preventDefault();
    index = e.target.dataset.key;
    markers[index].openInfoWindow();
    marker.addListener(
      'click',
      (function(marker, i) {
        return function() {
          if (marker.getAnimation() != null) {
            marker.setAnimation(null);
          } else {
            marker.setAnimation(window.google.maps.Animation.BOUNCE);
          }
        };
      })(marker, i)
    );
    // eslint-disable-next-line
    window.innerWidth < 550 ? this.setState({ searchHidden: true }) : null;
    this.setState({ workingList: locations });
    markers.forEach(marker => marker.setVisible(true));
  }

  toggleSearch() {
    this.setState(prevState => ({
      searchHidden: !prevState.searchHidden
    }));
  }

  screenListener() {
    let self = this;
    window.addEventListener('resize', function() {
      // eslint-disable-next-line
      window.innerWidth < 550
        ? self.setState({ searchHidden: true })
        : window.innerWidth > 550
          ? self.setState({ searchHidden: false })
          : null;
      self.state.map.fitBounds(self.state.bounds); //this fits map in different screens
    });
  }

  render() {
    return (
      <main className="App" role="main">
        <section ref="map" className="map" id="map" role="application" />

        <section className="right-column">
          <header className="header" aria-label="Application Header">
            <p>UDACITY FRONT END NANODEGREE</p>
            <h3>find a great restaurant in</h3>
            <h1>Tirunelveli</h1>
            <button
              id="toggleButton"
              title="TOGGLE LIST"
              type="button"
              onClick={this.toggleSearch}
            >
              {this.state.searchHidden ? 'SHOW' : 'HIDE'}
            </button>
          </header>
          {!this.state.searchHidden ? (
            <LocationList
              locations={this.state.locations}
              handleClick={this.handleClick}
              updateQuery={this.updateQuery}
              query={this.state.query}
              markers={this.state.markers}
              workingList={this.state.workingList}
              searchHidden={this.state.searchHidden}
            />
          ) : (
            ''
          )}
        </section>
        <Modal
          isVisible={this.state.isVisible}
          closeModal={this.closeModal}
          startFlickr={this.props.startFlickr}
          modalTitle={this.state.modalTitle}
        />
      </main>
    );
  }
}

export default App;

