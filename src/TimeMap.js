import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import {Checkbox, FormGroup} from 'react-bootstrap'
import 'react-input-range'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range';

/* global google */

class TimeMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [], tableInfo: [], circles: [],
            value: 0, markers: [], nMarkers: 0, squares: []
        };
        //this.handleChange = this.handleChange.bind(this);
        this.drawCircles = this.drawCircles.bind(this);
        this.drawSquares = this.drawSquares.bind(this);
    }

    /*handleChange(marker) {
        console.log(marker.data)
    }*/

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

    countReports(a, b, c, d) {
        let count = 0;
        let markers = [...this.state.markers];
        let x, y;

        for (let i = 0; i < markers.length; i++) {
            x = markers[i].getPosition().lat();
            y = markers[i].getPosition().lng();
            if (!(x < a || x > c || y < b || y > d)) {
                count++;
            }
        }
        return count;
    }

    meanIntensity(a, b, c, d) {
        let total = 0;
        let amount = 0;
        let markers = [...this.state.markers];
        let x, y;

        for (let i = 0; i < markers.length; i++) {
            x = markers[i].getPosition().lat();
            y = markers[i].getPosition().lng();
            if (!(x < a || x > c || y < b || y > d) && markers[i].data[2]['res'] != null) {
                total += markers[i].data[2]['res'];
                amount += 1;
            }
        }

        if (amount === 0) {
            return 0;
        }
        return total / amount;
    }

    getSquare(a, b, c, d, reports) {
        let info = new google.maps.InfoWindow();
        let centre = {lat: (a + c) / 2, lng: (b + d) / 2};

        let myRectangle = {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.1,
            map: this.map,
            visible: false,
            infowindow: info,
            data: [{reports}],
            bounds: {
                north: a,
                south: c,
                east: d,
                west: b
            }
        };

        let rectangle = new google.maps.Rectangle(myRectangle);

        rectangle.addListener('click', function () {
            info.setPosition(centre);
            info.setContent("<p>Cantidad de reportes: 0<br />Intensidad promedio: 0</p>");
            info.open(this.map);
        });

        rectangle.addListener('mouseout', function () {
            info.close();
        });
        return rectangle;
    }

    changeInput() {
        //Importante dejar por si otro componente demora mucho en terminar para evitar errores.
        if (this.state.markers.length === 0) {
            return;
        }

        let value = this.state.value;
        let filterDate;
        let markerFilter = this.state.markers[value];

        if (!markerFilter) {
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

            if (i < value) {
                actualMarker.setVisible(true);
            }
            else {
                actualMarker.setVisible(false);
            }
        }
    }

    parseReports(reports) {
        console.log(reports[0]);
        let i;
        let markers = [...this.state.markers];
        for (i = 0; i < reports.length; i++) {
            let x = Number(reports[i]['coordinates']['latitude']);
            let y = Number(reports[i]['coordinates']['longitude']);
            let date = reports[i]['created_on'].split("T");

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
        }
        this.setState({markers});
    }

    parseQuadrants() {
        let mySquares = [...this.state.squares];

        for (let i = 0; i < mySquares.length; i++) {
            console.log(i);
        }
    }

    parseQuadrantReports(reports) {
        let mySquares = [...this.state.squares];
        let a, b, c, d, i;

        for (i = 0; i < reports.length; i++) {
            a = Number(reports[i]['quadrant_data']['min_coordinates']['latitude']);
            b = Number(reports[i]['quadrant_data']['min_coordinates']['longitude']);
            c = Number(reports[i]['quadrant_data']['max_coordinates']['latitude']);
            d = Number(reports[i]['quadrant_data']['max_coordinates']['longitude']);
            let square = this.getSquare(a, b, c, d, reports[i]['slices_data']);
            mySquares.push(square);
        }
        console.log("done");
        this.setState({mySquares});
    }

    //Delay viene en horas
    parseLink(delay) {
        let current = new Date();

        current.setHours(current.getHours() - delay);

        let minute, hour, day, month;

        if (current.getMonth() < 9) {
            month = "0" + (current.getMonth() + 1);
        } else {
            month = current.getMonth() + 1;
        }

        if (current.getDate() < 10) {
            day = "0" + current.getDate();
        } else {
            day = current.getDate();
        }

        if (current.getHours() < 10) {
            hour = "0" + current.getHours();
        } else {
            hour = current.getHours();
        }

        if (current.getMinutes() < 10) {
            minute = "0" + current.getMinutes();
        } else {
            minute = current.getMinutes();
        }

        return current.getFullYear() + "-" +
            month + "-" +
            day + "T" +
            hour + "%3A" +
            minute
    }

    drawMap() {
        let self = this;
        self.map = new google.maps.Map(self.refs.map, {
            center: {lat: -33.5, lng: -70.63},
            zoom: 10,
            mapTypeId: google.maps.MapTypeId.HYBRID
        });

        fetch("http://wangulen.dgf.uchile.cl:17014/map/quadrant_reports/?" +
            "min_lat=-34.01&" +
            "min_long=-71.02&" +
            "max_lat=-33.1&" +
            "max_long=-70.2&" +
            "start_timestamp=" + this.parseLink(5) +
            "&end_timestamp=" + this.parseLink(0), {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token 3a79acb1431d2118960e50e5d09bdb5bc58ee2af'
            }
        })
            .then(response => response.json())
            //.then(reports => self.setState({quadrants: reports}));
            .then(reports => self.parseQuadrantReports(reports));
    }

    componentDidMount() {
        this.drawMap();
    }

    shouldComponentUpdate() {
        return true;
        //return this.state.value !== this.state.oldValue;
    }

    componentDidUpdate() {
        this.changeInput();
        this.parseQuadrants();
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
                    <div className="col-sm-10">
                        <InputRange
                            ref={InputRange => {
                                this.myInput = InputRange;
                            }}
                            maxValue={this.state.squares.length}
                            minValue={0}
                            formatLabel={value => `${value} Reportes`}
                            value={this.state.value}
                            onChange={value => this.setState({value})}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimeMap;