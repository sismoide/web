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
                north: -33.0050000000,
                south: -32.9600000000,
                east: -69.9649330000,
                west: -70.0189330000
            }
        };
        new google.maps.Rectangle(myRectangle);
    }

    closeAllInfoWindows() {
        let squares = [...this.state.squares];
        for (let i = 0; i < squares.length; i++) {
            squares[i].infowindow.close();
        }
        this.setState({squares});
    }

    rectangleContains(x, y, a, b, c, d) {
        if (x < a) return false;
        if (x > c) return false;
        if (y < b) return false;
        if (y > d) return false;
        return true;
    }

    countReports(a, b, c, d) {
        let count = 0;
        let markers = [...this.state.markers];
        for (let i = 0; i < markers.length; i++) {
            if(this.rectangleContains(markers[i].getPosition().lat(),
                markers[i].getPosition().lng(), a, b, c, d)) {
                count++;
            }
        }
        return count;
    }

    meanIntensity(a, b, c, d) {
        let total = 0;
        let amount = 0;
        let markers = [...this.state.markers];
        for (let i = 0; i < markers.length; i++) {
            if(this.rectangleContains(markers[i].getPosition().lat(),
                markers[i].getPosition().lng(), a, b, c, d) && markers[i].data[2]['res'] != null) {
                total += markers[i].data[2]['res'];
                amount += 1;
            }
        }

        if (amount === 0) {
            return 0;
        }
        return total / amount;
    }

     getNewSquare(n, p, a, b, c, d, self) {
        let info = new google.maps.InfoWindow();
        let new_lat = (a + c) / 2;
        let new_lng = (b + d) / 2;
        let centre = google.maps.LatLng(new_lat, new_lng);
        let myRectangle = {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.1,
            map: this.map,
            infowindow: info,
            bounds: {
                north: a,
                south: c,
                east: d,
                west: b
            }
        };
        let rectangle = new google.maps.Rectangle(myRectangle);
        rectangle.addListener('click', function() {
            info.setContent("<p>" + 'Cantidad de reportes: ' + n + "<br />" +
                            'Intensidad promedio: ' + Math.round(p) + "</p>");
            info.setPosition(rectangle.getBounds().getNorthEast());
            info.open(this.map);
        });
        rectangle.addListener('mouseout', function() {
            info.close();
        });
        return rectangle;
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

        if (i < value) {
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
        console.log(date);
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
        marker.setVisible(true);
        markers.push(marker);
        this.setState({markers});
        console.log(this.state.markers);
        marker.addListener('click', function() {
            self.handleChange(marker);
        });
      }
    }

    parseQuadrants(quadrants, self) {
        let i;
        let mySquares = [...this.state.squares];
        let a, b, c, d;
        for (i = 0; i < quadrants.length; i++) {
            a = Number(quadrants[i]['min_coordinates']['latitude']);
            b = Number(quadrants[i]['min_coordinates']['longitude']);
            c = Number(quadrants[i]['max_coordinates']['latitude']);
            d = Number(quadrants[i]['max_coordinates']['longitude']);
            let num_reports = this.countReports(a, b, c, d);
            let mean_int = this.meanIntensity(a, b, c, d);
            let square = this.getNewSquare(num_reports, mean_int, a, b, c, d, self);
            this.countReports(square);
            mySquares.push(square);

            this.setState({mySquares});
        }
    }

    drawMap() {
        let self = this;
        loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDAJ_Owgdoqi5hbxwxUdDLCGAeCnzbVVy8", function() {
            self.map = new google.maps.Map(self.refs.map, {
                center: {lat: -33.5, lng: -70.63},
                zoom: 10,
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
                //"max_lat=-17.29&" +
                //"max_long=-61.61/
            fetch("http://wangulen.dgf.uchile.cl:17014/map/quadrants?min_lat=-34.01&" +
                "min_long=-71.02&" +
                "max_lat=-33.1&" +
                "max_long=-70.2", {
                method: "GET",
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token 9ceaf0b154d346e8b7adb6242774dc38d16155af'
                },
                body: JSON.stringify(this.state)
            })
                .then(response => response.json())
                .then(reports => self.parseQuadrants(reports, self));
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
                            <Checkbox onChange={this.drawCircles.bind(this)}>Hospitales</Checkbox>{' '}
                            <Checkbox onChange={this.drawSquares.bind(this)}>Bomberos</Checkbox>
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
                    formatLabel={value => `${value} Reportes`}
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
