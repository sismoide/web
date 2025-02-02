import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-table/react-table.css';
import {FormGroup} from 'react-bootstrap';
import {Button} from 'reactstrap';
import 'react-widgets/dist/css/react-widgets.css';
import 'react-input-range';
import './inputRange.css'
import Moment from 'moment';
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import InputRange from 'react-input-range';
import Hospital from 'react-icons/lib/fa/hospital-o';
import Circle from 'react-icons/lib/fa/circle';

Moment.locale('es');

momentLocalizer();


/* global google */
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};


class Map extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [], tableInfo: [], circles: [], rColor: false,
            intensityColors: ['#76D7C4', '#F7DC6F', '#E74C3C', '#0000FF'],
            paths: ["m13.1 29.3v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.5q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.2h1.5q0.2 0 0.5 0.2t0.2 0.5z m0-5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.5q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.2h1.5q0.2 0 0.5 0.2t0.2 0.5z m5.7 0v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.5q-0.2 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.2h1.5q0.3 0 0.5 0.2t0.2 0.5z m-5.7-5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.5q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.3h1.5q0.2 0 0.5 0.3t0.2 0.5z m17.1 11.4v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.4q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.2h1.4q0.3 0 0.5 0.2t0.2 0.5z m-5.7-5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.4q-0.3 0-0.5-0.2t-0.3-0.5v-1.4q0-0.3 0.3-0.5t0.5-0.2h1.4q0.3 0 0.5 0.2t0.2 0.5z m-5.7-5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.5q-0.2 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.3h1.5q0.3 0 0.5 0.3t0.2 0.5z m11.4 5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.4q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.2h1.4q0.3 0 0.5 0.2t0.2 0.5z m-5.7-5.7v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.4q-0.3 0-0.5-0.2t-0.3-0.5v-1.4q0-0.3 0.3-0.5t0.5-0.3h1.4q0.3 0 0.5 0.3t0.2 0.5z m5.7 0v1.4q0 0.3-0.2 0.5t-0.5 0.2h-1.4q-0.3 0-0.5-0.2t-0.2-0.5v-1.4q0-0.3 0.2-0.5t0.5-0.3h1.4q0.3 0 0.5 0.3t0.2 0.5z m-5.7 19.2h8.6v-25.7h-5.7v0.7q0 0.9-0.7 1.6t-1.5 0.6h-10q-0.9 0-1.5-0.6t-0.6-1.6v-0.7h-5.7v25.7h8.5v-5q0-0.2 0.2-0.5t0.5-0.2h7.2q0.3 0 0.5 0.2t0.2 0.5v5z m0-26.4v-7.1q0-0.3-0.2-0.5t-0.5-0.2h-1.4q-0.3 0-0.5 0.2t-0.3 0.5v2.1h-2.8v-2.1q0-0.3-0.2-0.5t-0.5-0.2h-1.5q-0.2 0-0.5 0.2t-0.2 0.5v7.1q0 0.3 0.2 0.5t0.5 0.2h1.5q0.3 0 0.5-0.2t0.2-0.5v-2.1h2.8v2.1q0 0.3 0.3 0.5t0.5 0.2h1.4q0.3 0 0.5-0.2t0.2-0.5z m11.4-0.7v28.6q0 0.5-0.4 1t-1 0.4h-28.6q-0.6 0-1-0.4t-0.4-1v-28.6q0-0.6 0.4-1t1-0.4h7.2v-6.5q0-0.8 0.6-1.5t1.5-0.6h10q0.9 0 1.5 0.6t0.7 1.5v6.5h7.1q0.6 0 1 0.4t0.4 1z"],
            romans: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"],
            value: 0, markers: [], nMarkers: 0, squares: [], rSelected: [],
            timeLineFilter: [], filterDate: 0, animation: false, sliceAnim: 0,
            actualDateForReports: new Date(),
        };
        this.playAnim = this.playAnim.bind(this);
        this.stopAnim = this.stopAnim.bind(this);
        this.continueAnim = this.continueAnim.bind(this);
        this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    }

    onRadioBtnClick(rSelected) {
        this.setState({ rSelected });
    }

    getSquare(a, b, c, d, reports) {
        let info = new google.maps.InfoWindow();
        let centre = {lat: (a + c) / 2, lng: (b + d) / 2};

        let myRectangle = {
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.3,
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
        if (date) {
            return date.toLocaleDateString('es-ES', options);
        }
    }

    renderInfoWindow(intensity, reportCount, reportIntCount) {
        return(
            <div>
                <div className="my-row">
                    <div className="col-sm-5">
                        Intensidad:
                    </div>
                    <div className="col-sm-7">
                        Reportes: {reportCount}
                    </div>
                </div>

                <div className="my-row">
                    <div className="col-sm-5">
                        <div id="2" className="info-simbols">
                            {intensity}
                        </div>
                    </div>
                    <div className="smaller-whitespace-fromtop">
                    </div>
                    <div className="col-sm-7">
                        <div>
                            Reportes con Intensidad: {reportIntCount}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    /*"<p>Cantidad de reportes: " + reportCount +
    "<br />Intensidad promedio: " + roman + "</p>"*/

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
            filterDate = this.state.timeLineFilter[lastIndex];
        }

        else {
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
            let roman = 0;
            if (roundInt !== 0) { roman = this.state.romans[roundInt - 1]; }

            let infoDiv = document.createElement('div');
            ReactDOM.render( this.renderInfoWindow(roman, reportCount, reportIntCount), infoDiv );

            actualSquare.addListener('click', function () {
                info.setPosition(centre);
                info.setContent(infoDiv);
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

    parseQuadrantReports(reports) {
        let mySquares = [...this.state.squares];
        for (let z = 0; z < mySquares.length; z++) {
          mySquares[z].setMap(null)
        }

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

    getIconPath(type) {
        if (type === 'SAPU') {
            return this.state.paths[0];
        }
    }

    parseLandmarks(marks) {
        for(let i = 0; i < marks.length; i++) {
            let info = new google.maps.InfoWindow();
            let myLatLng = new google.maps.LatLng(marks[i]['coordinates']['latitude'],
                                                  marks[i]['coordinates']['longitude']);
            let myMarker = new google.maps.Marker({
                position: myLatLng,
                map: this.map,
                title: marks[i]['name'],
                icon: {
                    path: this.getIconPath(marks[i]['type']),
                    scale: 0.35,
                    strokeWeight: 0.4,
                    strokeColor: 'black',
                    strokeOpacity: 1,
                    fillOpacity: 0.7
                }
            });

            myMarker.addListener('click', function () {
                info.setPosition(myLatLng);
                info.setContent("<p>Nombre: " + marks[i]['name'] +
                    "<br />Dirección: " + marks[i]['address'] + "</p>");
                info.open(this.map);

            });
        }
    }

    //Delay viene en horas, minuteDelay en minutos
    parseLink(delay, minuteDelay) {

        let current = this.state.actualDateForReports;

        current.setHours(current.getHours() - delay);
        current.setMinutes(current.getMinutes() - minuteDelay);

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

        current.setHours(current.getHours() + delay);

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
        let token = localStorage.getItem("token");
        token = "Token " + token;


        fetch("http://server-geoscopio.dgf.uchile.cl/map/landmarks/?" +
            "min_lat=-34.01&" +
            "max_lat=-33.1&" +
            "min_long=-71.02&" +
            "max_long=-70.2", {
            method: "GET",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
            .then(response => response.json())
            .then(landmarks => self.parseLandmarks(landmarks));
    }

    placeTime(time){
        let self = this;
        self.setState({timeLineFilter: time});
        self.setState({value : time.length -1 })
    }


    componentDidMount() {
        this.drawMap();
        this.createDateArray(new Date());
    }


    shouldComponentUpdate() {
        return true;
        //return this.state.value !== this.state.oldValue;
    }

    componentDidUpdate(prevProps, prevState) {
        this.changeInput(this.state.rColor);
        if (this.state.animation !== prevState.animation) {
          this.animation();
        }
        if (this.state.actualDateForReports !== prevState.actualDateForReports){
          this.fetchReports();
        }
    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    playAnim(){
        this.setState({animation : "play"});
    }
    stopAnim(){
        this.setState({animation : "stop"})
    }
    continueAnim() {
        this.setState({animation : "continue"});
    }

   async animation(){
     if (this.state.animation === "play"){
       for (let i = 0; i < this.state.timeLineFilter.length; i++) {
           if (this.state.animation === "play") {
               this.setState({ value: i});
               await this.sleep(1000);
           }
           else {
               return
           }
       }
     }
     else if (this.state.animation === "stop"){
       return
     }
     else {
       for (let i = this.state.value; i < this.state.timeLineFilter.length; i++) {
           if (this.state.animation === "continue") {
               this.setState({ value: i});
               await this.sleep(1000);
           }
           else {
               return
           }
       }
     }
   }

    createDateArray(date){
        let self = this;

        self.setState({actualDateForReports: date});

        let myEndDateTime = date;
        let MS_PER_MINUTE = 60000;

        let auxArray = [];
        for (let i = 0; i < 60; i++) {
            let date = new Date(myEndDateTime - i * 5 * MS_PER_MINUTE);
            auxArray.push(date);
        }

        // self.setState({timeLineFilter: auxArray});
        // self.setState({value : auxArray.length -1 });
        this.placeTime(auxArray.reverse());

    }

    changeDateofReports(date){
      this.createDateArray( date );
    }

    fetchReports(){
      let self = this;
      let token = localStorage.getItem("token");
      token = "Token " + token;

      fetch("http://server-geoscopio.dgf.uchile.cl/map/quadrant_reports/?" +
        "min_lat=-34.01&" +
        "min_long=-71.02&" +
        "max_lat=-33.1&" +
        "max_long=-70.2&" +
        "start_timestamp=" + this.parseLink(1, 0) +
        "&end_timestamp=" + this.parseLink(-4, -15), {
        method: "GET",
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
          }
      })
        .then(response => response.json())
        .then(reports => self.parseQuadrantReports(reports));

    }

    render() {
        return (
            <div className="container">
                <div className="row-map">
                    <div className="col-sm-9" ref="map">
                    </div>
                    <div className="col-sm-3">
                        <div className="simbols">

                            <div className="header-simbology">
                                Simbología:
                            </div>

                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Hospital className="simbology" size={24}/> Centros de Salud
                            </FormGroup>
                        </div>
                        <div className="other-whitespace-fromtop">
                        </div>

                        <Button color="info" size="sm" onClick={() => {this.onRadioBtnClick(1);
                            this.setState({rColor:false})}}
                                onChange={() => this.setState({rColor: true})}
                                active={this.state.rSelected === 1}>Pintar Intensidades</Button>

                        <div className="smaller-whitespace-fromtop">
                        </div>

                        <div className="simbols">
                            <div className="header-simbology">
                                Escala de Intensidades:
                            </div>
                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Circle className="simbology" color='#76D7C4'/> I-IV
                            </FormGroup>
                            <FormGroup>
                                <Circle className="simbology" color='#F7DC6F'/> V-VIII
                            </FormGroup>
                            <FormGroup>
                                <Circle className="simbology" color='#E74C3C'/> IX-XII
                            </FormGroup>
                            <FormGroup>
                                <Circle className="simbology" color='#0000FF'/> Reportes sin intensidad
                            </FormGroup>
                        </div>

                        <div className="small-whitespace-fromtop">
                        </div>

                        <Button color="info" size="sm" onClick={() => {this.onRadioBtnClick(2);
                            this.setState({rColor: true})}}
                                active={this.state.rSelected === 2}>Pintar Reportes</Button>

                        <div className="smaller-whitespace-fromtop">
                        </div>

                        <div className="simbols">
                            <div className="header-simbology">
                                Escala de Reportes:
                            </div>
                            <FormGroup>
                            </FormGroup>

                            <FormGroup>
                                <Circle className="simbology" color='#76D7C4'/> &lt; 10 reportes
                            </FormGroup>
                            <FormGroup>
                                <Circle className="simbology" color='#F7DC6F'/> &lt; 100 reportes
                            </FormGroup>
                            <FormGroup>
                                <Circle className="simbology" color='#E74C3C'/> &gt; 100 reportes
                            </FormGroup>
                        </div>
                    </div>
                </div>

                <div className='whitespace-fromtop'>
                </div>

                <div className="row">
                </div>
                <div className="col-sm-6">
                <button onClick={this.playAnim}>
                Reproducir
                </button>
                <button onClick={this.continueAnim}>
                Continuar
                </button>
                <button onClick={this.stopAnim}>
                Detener
                </button>
                </div>
                  <div className="col-sm-4">

                      <DateTimePicker
                          dropUp
                          onChange={filterDate => this.changeDateofReports( filterDate )}
                      />

                </div>
                <div className="row">
                    <div
                        className="col-sm-9"
                        style={{
                            marginTop: "30px",
                            marginBottom: "50px"
                        }}>

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

export default Map;
