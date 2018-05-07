import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import {Checkbox, FormGroup} from 'react-bootstrap'

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
        this.state = {data: [], tableInfo: []};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(marker) {
        console.log(marker.data);
        this.setState({tableInfo: marker.data});
    }

    parseReports(reports, self) {
      let i;
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
        marker.addListener('click', function() {
            self.handleChange(marker);
        });
      }


    }

    componentDidMount() {
        let self = this;
        loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDAJ_Owgdoqi5hbxwxUdDLCGAeCnzbVVy8", function() {
            self.map = new google.maps.Map(self.refs.map, {
                center: {lat: -33.4, lng: -70.6},
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.HYBRID});

        fetch("http://172.17.71.14:7171/web/reports/")
        .then(response => response.json())
        .then(reports => self.parseReports(reports, self));
        });
    }

    render() {
        return (
            <div class="container">
                <div class="row">
                    <div className="col-sm-10" ref="map">
                        I should be a map!
                    </div>
                    <div class="col-sm-2">
                        <FormGroup>
                            <Checkbox>Círculos</Checkbox>{' '}
                            <Checkbox>Cuadrados</Checkbox>
                        </FormGroup>
                    </div>
                </div>

                <div class="row">
                    Aquí pondremos una linea de tiempo o:
                </div>
            </div>
        )
    }
}


// ========================================

export default MyMap;
