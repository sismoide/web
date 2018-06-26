
import React from 'react';
import './index.css';
import 'react-table/react-table.css'
import {FormGroup} from 'react-bootstrap'
import 'react-widgets/dist/css/react-widgets.css';
import 'react-input-range'
import 'react-input-range/lib/css/index.css'
import Moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import InputRange from 'react-input-range';
import Hospital from 'react-icons/lib/fa/hospital-o';
import Water from 'react-icons/lib/fa/tint';
import Circle from 'react-icons/lib/fa/circle';

Moment.locale('es');

momentLocalizer();



/* global google */
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};


class TimeMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [], tableInfo: [], circles: [], rColor: false,
            intensityColors: ['#76D7C4', '#F7DC6F', '#E74C3C', '#0000FF'],
            value: 0, markers: [], nMarkers: 0, squares: [],
            timeLineFilter: [], filterDate: new Date(), animation: true, sliceAnim: 0
        };
        this.playAnim = this.playAnim.bind(this);
        this.stopAnim = this.stopAnim.bind(this);
        this.continueAnim = this.continueAnim.bind(this);
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
        return date.toLocaleDateString('es-ES', options);
      }
}

    changeInput(reportColor) {
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

        for (let i = 0; i < this.state.squares.length; i++) {
            let actualSquare = this.state.squares[i];
            let actualDate = new Date(actualSquare.data[0]);
            let rightSlice = -1;

            for (let j = 0; j < actualSquare.data[0]['reports'].length; j++) {
              actualDate = new Date(actualSquare.data[0]['reports'][j]['end_timestamp']);

              if (actualDate < filterDate) {
                      rightSlice = j;
                  }
            }

            let reportCount = 0;
            let reportIntCount = 0;
            let totalInt = 0;
            let meanInt = 0;
            let info = new google.maps.InfoWindow();
            let a, b, c, d;

            a = actualSquare.getBounds().getNorthEast().lat();
            b = actualSquare.getBounds().getSouthWest().lng();
            c = actualSquare.getBounds().getSouthWest().lat();
            d = actualSquare.getBounds().getNorthEast().lng();
            let centre = {lat: (a + c) / 2, lng: (b + d) / 2};

            for (let k = 0; k <= rightSlice; k++) {
                reportCount += actualSquare.data[0]['reports'][k]['report_total_count'];
                reportIntCount += actualSquare.data[0]['reports'][k]['report_w_intensity_count'];
                totalInt += actualSquare.data[0]['reports'][k]['intensity_sum'];
            }

            if (reportIntCount !== 0) {
                meanInt = totalInt / reportIntCount;
            }

            google.maps.event.clearInstanceListeners(actualSquare);
            let roundInt = Math.round(meanInt);

            actualSquare.addListener('click', function () {
                info.setPosition(centre);
                info.setContent("<p>Cantidad de reportes: " + reportCount +
                    "<br />Intensidad promedio: " + roundInt + "</p>");
                info.open(this.map);

            });

            actualSquare.addListener('mouseout', function () {
                info.close();
            });

            let colorIndex = 3;

            if(!reportColor) {
                if (roundInt !== 0) {
                    colorIndex = 2;
                    if (roundInt < 5) { colorIndex = 0; }
                    else if (roundInt < 9) { colorIndex = 1; }
                }
            } else {
                colorIndex = 2;
                if (reportCount < 10) { colorIndex = 0; }
                else if (reportCount < 100) { colorIndex = 1; }
            }

            actualSquare.setOptions({strokeColor: this.state.intensityColors[colorIndex],
                                     fillColor: this.state.intensityColors[colorIndex]});

            if (rightSlice !== -1){
              actualSquare.setVisible(true)
            }
            else {
              actualSquare.setVisible(false)
            }

        }
    }

    parseQuadrants() {
        let mySquares = [...this.state.squares];

        for (let i = 0; i < mySquares.length; i++) {
            // console.log(i);
        }
    }

    parseQuadrantReports(reports) {
        console.log(reports);

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
        this.setState({squares : mySquares});
    }

    //Delay viene en horas
    parseLink(delay) {
        // let current = this.state.filterDate;
        let current = new Date();
        console.log(current);

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
            .then(reports => self.parseQuadrantReports(reports));
    }

    placeTime(time){
      let self = this;
      self.setState({timeLineFilter: time});
      self.setState({value : time.length -1 })
    }


    componentDidMount() {
        this.drawMap();
        this.createDateArray(new Date);
    }


    shouldComponentUpdate() {
        return true;
        //return this.state.value !== this.state.oldValue;
    }

    componentDidUpdate() {
      this.changeInput(this.state.rColor);
      this.parseQuadrants();
    }

    createDateArray(date){
      console.log("creando fecha:", date);
      let myEndDateTime = date;
      let MS_PER_MINUTE = 60000;

      let auxArray = [];
      for (let i = 0; i < 60; i++) {
        let date = new Date(myEndDateTime - i * 5 * MS_PER_MINUTE);
        auxArray.push(date);
      }

      let self = this;
      self.setState({timeLineFilter: auxArray});
      self.setState({value : auxArray.length -1 });
      this.placeTime(auxArray.reverse());

    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async playAnim(){
      console.log("play")
      this.setState({animation : true})
      for (var i = 0; i < this.state.timeLineFilter.length; i++) {
        if (this.state.animation) {
          console.log("slice actual", i);
          this.setState({ value: i})
          let wake = await this.sleep(1000);
        }
        else {
          return
        }
      }
    }
    stopAnim(){
      this.setState({animation : false})
    }

    async continueAnim() {
      this.setState({animation : true})
      for (var i = this.state.value; i < this.state.timeLineFilter.length; i++) {
        if (this.state.animation) {
          console.log("slice actual", i);
          this.setState({ value: i})
          let wake = await this.sleep(1000);
        }
        else {
          return
        }
      }
    }

    changeDateofReports(date){
      console.log("hola");
      let self = this;
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
        .then(reports => self.parseQuadrantReports(reports));
      // this.createDateArray( date );
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
                                <Circle color='#76D7C4'/> I-IV
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#F7DC6F'/> V-VIII
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#E74C3C'/> IX-XII
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#0000FF'/> Reportes sin intensidad
                            </FormGroup>
                        </div>

                        <div className="small-whitespace-fromtop">
                        </div>
                        <div className="simbols">
                            Escala de reportes:
                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Circle color='#76D7C4'/> &lt; 10 reportes
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#F7DC6F'/> &lt; 100 reportes
                            </FormGroup>
                            <FormGroup>
                                <Circle color='#E74C3C'/> &gt; 100 reportes
                            </FormGroup>
                        </div>
                    </div>
                </div>

                <div className='whitespace-fromtop'>
                </div>

                <div>
                    <div className="col-sm-6">

                    <DateTimePicker
                      dropUp
                      onChange={filterDate => this.changeDateofReports( filterDate )}
                      />
                    </div>
                    <div className="col-sm-6">
                    <button onClick={this.playAnim}>
                      Play
                    </button>
                    <button onClick={this.continueAnim}>
                    Continue
                    </button>
                    <button onClick={this.stopAnim}>
                      Stop
                    </button>
                    </div>
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
                    <div className="col-sm-2">
                    </div>
                </div>
            </div>
        )
    }
}

export default TimeMap;
