import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import {Checkbox, FormGroup} from 'react-bootstrap'
import 'react-input-range'
import 'react-input-range/lib/css/index.css'
import InputRange from 'react-input-range';
import Hospital from 'react-icons/lib/fa/hospital-o';
import Water from 'react-icons/lib/fa/tint';
import Circle from 'react-icons/lib/fa/circle';


/* global google */
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};


class TimeMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [], tableInfo: [], circles: [],
            value: 0, markers: [], nMarkers: 0, squares: [],
            timeLineFilter: [],
        };
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

    dateToLabel(date){
      if (date){
      var string = date.toLocaleDateString('es-ES', options);
      return string
      }
}

    changeInput() {
        //Importante dejar por si otro componente demora mucho en terminar para evitar errores.
        if (this.state.squares.length === 0) {
            return;
        }

        let value = this.state.value;
        let filterDate;
        let dateFilter = this.state.timeLineFilter[value];

        if (!dateFilter) {
            let lastIndex = this.state.timeLineFilter.length - 1;
            //console.log(new Date(this.state.markers[lastIndex].data[0]['res']));
            filterDate = this.state.timeLineFilter[lastIndex];
        }

        else {
            //console.log(new Date(this.state.markers[this.state.value].data[0]['res']));
            filterDate = this.state.timeLineFilter[this.state.value];
        }

        console.log("#############################################")
        console.log("filtro del timeline")
        console.log(this.state.timeLineFilter)
        console.log(filterDate)
        for (let i = 0; i < this.state.squares.length; i++) {
            let actualSquare = this.state.squares[i];
            let actualDate = new Date(actualSquare.data[0]);
            // console.log(actualSquare.data[0]['reports'][0]['end_timestamp'])
            var rightSlice = -1;
            for (var j = 0; j < actualSquare.data[0]['reports'].length; j++) {
              actualDate = new Date(actualSquare.data[0]['reports'][j]['end_timestamp'])

              if (actualDate < filterDate) {
                      rightSlice = j;
                  }
            }

            if (rightSlice !== -1){
              console.log("datos del cuadrante")
              console.log(rightSlice)
              console.log(new Date(actualSquare.data[0]['reports'][rightSlice]['end_timestamp']))
              actualSquare.setVisible(true)
            }
            else {
              actualSquare.setVisible(false)
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
            // console.log(i);
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
        this.setState({squares : mySquares});
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
            "start_timestamp=" + this.parseLink(1) +
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

    placeTime(time){
      let self = this;
      self.setState({timeLineFilter: time});
      self.setState({value : time.length -1 })
    }


    componentDidMount() {
        this.drawMap();
        var timeLineDates = this.createDateArray();
        this.placeTime(timeLineDates.reverse());

    }


    shouldComponentUpdate() {
        return true;
        //return this.state.value !== this.state.oldValue;
    }

    componentDidUpdate() {
        this.changeInput();
        this.parseQuadrants();
    }


    createDateArray(){
      var myEndDateTime = new Date();
      var MS_PER_MINUTE = 60000;

      var auxArray = [];
      for (let i = 0; i < 60; i++) {
        var date = new Date(myEndDateTime - i * 5 * MS_PER_MINUTE);
        auxArray.push(date);
      }
      this.setState({timeLineFilter : auxArray});

      return auxArray;
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-10" ref="map">
                    </div>
                    <div className="col-sm-2">
                        <div className="simbols">
                            Simbología:
                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Hospital size={24}/> Centros de Salud
                            </FormGroup>
                            <FormGroup>
                                <Water size={24}/> Fuentes de Agua Rurales
                            </FormGroup>
                        </div>
                        <div className="other-whitespace-fromtop">
                        </div>
                        <div className="simbols">
                            Escala de Intensidades:
                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Circle color='#F2F3F4'/> I
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#AED6F1'/> II
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#5DADE2'/> III
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#76D7C4'/> IV
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#17A589'/> V
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#F7DC6F'/> VI
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#F39C12'/> VII
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#CA6F1E'/> VIII
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#E74C3C'/> IX
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#B03A2E'/> X
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#7B241C'/> XI
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#000000'/> XII
                            </FormGroup>


                        </div>
                    </div>
                </div>

                <div className='whitespace-fromtop'>
                </div>

                <div>
                    <div className="col-sm-10">
                        <InputRange
                            ref={InputRange => {
                                this.myInput = InputRange;
                            }}
                            maxValue={this.state.timeLineFilter.length - 1}
                            minValue={0}
                            formatLabel={value => `${this.dateToLabel(this.state.timeLineFilter[value])}`}
                            value={this.state.value}
                            onChange={value => this.setState({value})}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default TimeMap;
