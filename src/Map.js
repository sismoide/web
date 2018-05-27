import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import {Checkbox, FormGroup} from 'react-bootstrap'
import 'react-input-range'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range';
/* global google */

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    const head = document.getElementsByTagName('head')[0];
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

class MyMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {data: [], tableInfo: [], circles: [],
                      value: 5, markers : [], nMarkers : 0, squares: []};
        this.handleChange = this.handleChange.bind(this);
        this.drawCircles = this.drawCircles.bind(this);
        this.drawSquares = this.drawSquares.bind(this);
    }

    handleChange(marker) {
        console.log(marker.data)
    }

    drawCircles() {
        let circleTwo = {
            strokeColor: "#25DEA0",
            fillColor: "#25DEA0",
            strokeOpacity: 0.8,
            strokeWeight: 1,
            fillOpacity: 0.2,
            map: this.map,
            center: {lat: -33.1, lng: -70.6},
            radius: 2000
        };
        new google.maps.Circle(circleTwo);
    }

    drawSquares() {
        let myRectangle = {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.35,
            map: this.map,
            bounds: {
                north: -33.685,
                south: -33.671,
                east: -70.234,
                west: -70.251
            }
        };
        new google.maps.Rectangle(myRectangle);
    }

    pushSquares(x, y) {
        let myRectangle = {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.35,
            map: this.map,
            bounds: {
                north: -33.685,
                south: -33.671,
                east: -70.234,
                west: -70.251
            }
        };
        new google.maps.Rectangle(myRectangle);
        return myRectangle;
    }

    changeInput(){
      let value = this.state.value;
      let filterDate;
      let markerFilter = this.state.markers[value];

      if (! markerFilter ){
        let lastIndex = this.state.markers.length - 1;
        //console.log(new Date(this.state.markers[lastIndex].data[0]['res']));
        filterDate = new Date(this.state.markers[lastIndex].data[0]['res']);
      }

      else {
        //console.log(new Date(this.state.markers[this.state.value].data[0]['res']));
        filterDate = new Date(this.state.markers[this.state.value].data[0]['res']);
      }

      for (let i = 0; i < this.state.markers.length; i++) {
        let actualMarker = this.state.markers[i];
        let actualDate = new Date(actualMarker.data[0]['res']);

        if (actualDate < filterDate) {
          actualMarker.setVisible(true);
        }

        else {
          actualMarker.setVisible(false);
        }
      }
    }

    parseReports(reports, self) {
      let i;
      let markers = [...this.state.markers];
      for (i = 0; i < reports.length; i++) {
        let x = Number(reports[i]['coordinates']['latitude']);
        let y = Number(reports[i]['coordinates']['longitude']);
        let date = reports[i]['created_on'].split("T");
        //let dateObj = new Date(reports[i]['created_on'])
        //console.log(reports[i]['created_on'])
        //console.log(date);
        //console.log(dateObj);
        let marker = new google.maps.Marker({
            position: {lat: x, lng: y},
            map: this.map,
            data: [{
                med: 'Fecha',
                //String(Math.trunc(Number(date[1])))
                res: date[0] + " " + date[1]
            },
                {
                    med: 'Coordenadas',
                    res: "Lat: " + String(x) + " Long: " + String(y)
                },
                {
                    med: 'Intensidad',
                    res: reports[i]['intensity']
                }]
        });
        markers.push(marker);
        this.setState({markers});
        marker.addListener('click', function() {
            self.handleChange(marker);
        });
      }
    }

    parseQuadrants(quadrants) {
        let i;
        let mySquares = [...this.state.squares];
        for (i = 0; i < quadrants.length; i++) {
            let x = Number(quadrants[i]['latitude']);
            let y = Number(quadrants[i]['longitude']);
            let square = this.pushSquares(x, y);
            mySquares.push(square);

            this.setState({mySquares});
        }
    }

    drawMap() {
        let self = this;
        loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDAJ_Owgdoqi5hbxwxUdDLCGAeCnzbVVy8", function() {
            self.map = new google.maps.Map(self.refs.map, {
                center: {lat: -33.4, lng: -70.6},
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.HYBRID});

            fetch("http://wangulen.dgf.uchile.cl:17014/web/reports/", {
              method: "GET",
              headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization' : 'Token 9ceaf0b154d346e8b7adb6242774dc38d16155af'
              },
              body: JSON.stringify(this.state)
            })
                .then(response => response.json())
                .then(reports => self.parseReports(reports, self));

            fetch("http://wangulen.dgf.uchile.cl:17014/map/quadrants?min_lat=-56.02757693295072&" +
                "min_long=-79.84863281000003&" +
                "max_lat=-17.299479662371382&" +
                "max_long=-61.611328122500026", {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token 9ceaf0b154d346e8b7adb6242774dc38d16155af'
                },
                body: JSON.stringify(this.state)
            })
                .then(response => response.json())
                .then(reports => self.parseQuadrants(reports));
        });
    }

    componentDidMount() {
        this.drawMap();

    }

    componentDidUpdate() {
      this.changeInput();
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-10" ref="map">
                    </div>
                    <div className="col-sm-2">
                        <FormGroup>
                            <Checkbox onChange={this.drawCircles.bind(this)}>Círculos</Checkbox>{' '}
                            <Checkbox onChange={this.drawSquares.bind(this)}>Cuadrados</Checkbox>
                        </FormGroup>
                    </div>
                </div>

                <div>
                  <div className= "col-sm-10">
                  <InputRange
                  ref={InputRange => {
                        this.myInput = InputRange;
                        }}
                    maxValue={this.state.markers.length}
                    minValue={0}
                    formatLabel={value => `${value}cm`}
                    value={this.state.value}
                    onChange={value => this.setState({ value })}/>
                    </div>
                </div>
            </div>
        )
    }
}


// ========================================

export default MyMap;
