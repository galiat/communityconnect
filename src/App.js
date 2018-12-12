import React, { Component } from 'react';
import Header from './components/Header/Header';
import { SplitScreen } from './components/SplitScreen';
import ResultList from './components/ResultList';
import Map from './components/Map/Map';
import { callSheets } from './data/sheetLoadingHelpers.js';
import ShoppingCart from './components/ShoppingCart';
import SortBar from './components/SortBar.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orgs: [],
      categories: [],
      tags: [],
      haveCoords: false,
      locationAddressHashTable: [],
      isSavedResourcePaneOpen: false,
      savedResources: [],
    }

    this.callSheets = callSheets.bind(this);
    
    this.toggleSavedResourcesPane = this.toggleSavedResourcesPane.bind(this);
    this.orderResources = this.orderResources.bind(this);
    this.saveResource = this.saveResource.bind(this);
    this.removeResource = this.removeResource.bind(this);
    this.uploadResources = this.uploadResources.bind(this);
  }

  getLocation = () => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position)
          this.setState({
            position : {
              coordinates : {
                lat: parseFloat(position.coords.latitude),
                lng: parseFloat(position.coords.longitude)
              }
            }
          })
          this.setState({haveCoords : true})
        },
        error => {
          console.log('Unable to get Coordinates');
          this.setState({ haveCoords: false })
        });
    } else {
      console.log('no geolocation');
      this.setState({haveCoords: false})
    }
  }

  componentDidMount() {
    this.callSheets("");
    this.getLocation();
  }

  cardClick = (index) => {
    this.mapItem.setOpenMarker(index);
  }

  scrollToElement = index => {
    this.resultListItem.scrollToElement(index);
  }

  toggleSavedResourcesPane = () => {
    this.setState({
      isSavedResourcePaneOpen: !this.state.isSavedResourcePaneOpen
    });
  }

  orderResources = (sourceIndex, destinationIndex) => {
    let savedResources = this.state.savedResources.slice();

    let movedResource = savedResources[sourceIndex];
    savedResources.splice(sourceIndex, 1);
    savedResources.splice(destinationIndex, 0, movedResource);

    this.setState({
      savedResources: savedResources,
    })
  }

  saveResource = (resource) => {
    let savedResources = null;
    if(!this.state.savedResources.some(r => r.id == resource.id)){
      savedResources = this.state.savedResources.slice();
      savedResources.push(resource);
      this.setState({
        savedResources: savedResources,
      })
    }
  }

  removeResource = (resource) => {
    let savedResources = null;
    if(this.state.savedResources.some(r => r.id == resource.id)){
      savedResources = this.state.savedResources.slice();
      savedResources.splice(savedResources.indexOf(resource), 1);
    }
    this.setState({
      savedResources: savedResources,
    })
  }

  uploadResources = (resources) => {
    this.setState({
      savedResources: resources.slice(),
    })
  }

  render() {
    const navbarHeight = 56;

    let map =
      <Map
        center={this.state.position ? this.state.position.coordinates : null}
        organizations={this.state.orgs}
        scrollToElement={this.scrollToElement}
        ref={instance => { this.mapItem = instance }}
        locationAddressHashTable={this.state.locationAddressHashTable}
      />

    return (

      <div>
        <Header
          categories={this.state.categories}
          handleEvent={this.callSheets}
          handleFilter={this.callSheets}
          toggleSavedResourcesPane={this.toggleSavedResourcesPane}
        />
        <SplitScreen style={{ top: navbarHeight }}>
          <SplitScreen.StaticPane>
            {map}
          </SplitScreen.StaticPane>
          <SplitScreen.SlidingPane>
            <ResultList
              haveCoords={this.state.haveCoords}
              ref={instance => { this.resultListItem = instance }}
              cardClick={this.cardClick}
              data={this.state.orgs}
              haveCoords={this.state.haveCoords}
              currentPos={this.state.position}
              fullWidth={true}
              saveItem={this.saveResource}
            />
          </SplitScreen.SlidingPane>
          <SplitScreen.TogglePane isOpen={this.state.isSavedResourcePaneOpen}>
            <ShoppingCart 
              data={this.state.savedResources}
              reOrder={this.orderResources}
              addItem={this.saveResource}
              removeItem={this.removeResource}
              uploadItems={this.uploadResources}>
            </ShoppingCart>
          </SplitScreen.TogglePane>
        </SplitScreen>
      </div>
    );
  }
}

export default App;
