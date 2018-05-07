import React from 'react';
import ReactTable from 'react-table';
import './index.css';
import 'react-table/react-table.css'
import Websocket from 'react-websocket';
import Sockette from 'sockette-component'
import createSocket from "sockette-component";
import { Component, createElement } from "react";

const Socket = createSocket({
  Component,
  createElement
});
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
        this.state = {data: [], tableInfo: [], socket: null};

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(marker) {
        console.log(marker.data);
        this.setState({tableInfo: marker.data});
    }

    onOpen = ev => {
      console.log("> Connected!", ev);
    };

    onMessage = ev => {
      console.log("> Received:", ev.data);
    };

    onReconnect = ev => {
      console.log("> Reconnecting...", ev);
    };

    sendMessage = _ => {
      // WebSocket available in state!
      this.stte.ws.send("Hello, world!");
    };

    //Aun sin utilizar
    // handleData(data) {
    //     let result = JSON.parse(data);
    //     console.log(result)
    //     this.setState({data: result});
    // }

    handleWS(data) {
      console.log(data)
    }

    handleOpen() {
      console.log("opened")
    }

    parseReports(reports, self) {
      var i;
      for (i = 0; i < reports.length; i++) {
        let x = Number(reports[i]['coordinates']['latitude'])
        let y = Number(reports[i]['coordinates']['longitude'])
        let date = reports[i]['created_on'].split("T")
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
                    res: "Lat: " + String(x) + " " + "Long: " + String(y)
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


      // const io = require('socket.io')();

      //
      // const Sockette = require('sockette');
      //
      // const ws = new Sockette('ws://localhost:8001', {
      //   timeout: 5e3,
      //   maxAttempts: 10,
      //   onopen: e => console.log('Connected!', e),
      //   onmessage: e => console.log('Received:', e),
      //   onreconnect: e => console.log('Reconnecting...', e),
      //   onmaximum: e => console.log('Stop Attempting!', e),
      //   onclose: e => console.log('Closed!', e),
      //   onerror: e => console.log('Error:', e)
      // });
      //
      // ws.send('Hello, world!');
      // ws.close(); // graceful shutdown



      // console.log(1)
      // const WebSocket = require('ws');
      // console.log(2)
      // const ws = new WebSocket('ws://demos.kaazing.com/echo');
      // console.log(3)
      // ws.on('open', function open() {
      //   ws.send('something');
      // });
      // console.log(4)
      // ws.on('message', function incoming(data) {
      //   console.log(data);
      // });
      // console.log(5)

      // const WebSocket = require('ws');
      //
      // const ws = new WebSocket('ws://localhost:8001');
      //
      // ws.on('open', function open() {
      //   console.log('connected');
      //   ws.send(Date.now());
      // });
      //
      // ws.on('close', function close() {
      //   console.log('disconnected');
      // });
      //
      // ws.on('message', function incoming(data) {
      //   console.log(`Roundtrip time: ${Date.now() - data} ms`);
      //
      //   setTimeout(function timeout() {
      //     ws.send(Date.now());
      //   }, 500);
      // });
        // fetch("http://172.17.71.14:7171/web/reports/", {mode: 'cors'})
        // // .then(response => response.json())
        // .then(function(response) {
        //   console.log(response.body);
        // }).catch(function(error) {
        //   console.log('Request failed', error)
        // });


        // fetch("http://172.17.71.14:7171/web/reports/", {mode: 'no-cors'})
        //   .then(response => response.json())
        //   .then(da
        // fetch("http://172.17.71.14:7171/web/reports/", {mode: 'cors'})
        // // .then(response => response.json())
        // .then(function(response) {
        //   console.log(response.body);
        // }).catch(function(error) {
        //   console.log('Request failed', error)
        // });


        // fetch("http://172.17.71.14:7171/web/reports/", {mode: 'no-cors'})
        //   .then(response => response.json())
        //   .then(data => this.setState({ data: data }));ta => this.setState({ data: data }));

        let self = this;
        loadScript("https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyDAJ_Owgdoqi5hbxwxUdDLCGAeCnzbVVy8", function() {
            self.map = new google.maps.Map(self.refs.map, {
                center: {lat: -33.4, lng: -70.6},
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.HYBRID});

            // let marker = new google.maps.Marker({
            //     position: {lat: -33.4569400, lng: -70.6482700},
        fetch("http://172.17.71.14:7171/web/reports/")
        .then(response => response.json())
        .then(reports => self.parseReports(reports, self));
            //     map: self.map,
            //     data: [{
            //         med: 'Fecha',
            //         res: "pasado mañana"
            //     },
            //         {
            //             med: 'Coordenadas',
            //             res: "lat: -33.4569400, lng: -70.6482700"
            //         },
            //         {
            //             med: 'Intensidad',
            //             res: 8
            //         }]
            // });

            // let markerOne = new google.maps.Marker({
            //     position: {lat: -35.253481406187326, lng: -71.38916015375003},
            //     map: self.map,
            //     data: [{
            //         med: 'Fecha',
            //         res: 'hoy'
            //     },
            //         {
            //             med: 'Coordenadas',
            //             res: "lat: -35.253481406187326, lng: -71.38916015375003"
            //         },
            //         {
            //             med: 'Intensidad',
            //             res: 5
            //         }]
            // });
            //
            // let markerTwo = new google.maps.Marker({
            //     position: {lat: -28.157991686294604, lng: -70.51025390375003},
            //     map: self.map,
            //     data: [{
            //         med: 'Fecha',
            //         res: 'oka'
            //     },
            //         {
            //             med: 'Coordenadas',
            //             res: "lat: -28.157991686294604, lng: -70.51025390375003"
            //         },
            //         {
            //             med: 'Intensidad',
            //             res: 2
            //         }]
            // });
            //
            // let markerThree = new google.maps.Marker({
            //     position: {lat: -23.65334324379797, lng: -68.48876952875003},
            //     map: self.map,
            //     data: [{
            //         med: 'Fecha',
            //         res: 'ayer'
            //     },
            //         {
            //             med: 'Coordenadas',
            //             res: "lat: -23.65334324379797, lng: -68.48876952875003"
            //         },
            //         {
            //             med: 'Intensidad',
            //             res: 12
            //         }]
            // });

            // marker.addListener('click', self.handleChange(marker));
            // markerOne.addListener('click', self.handleChange(markerOne));
            // markerTwo.addListener('click', self.handleChange(markerTwo));
            // markerThree.addListener('click', self.handleChange(markerThree));

            // marker.addListener('click', function() {
            //     self.handleChange(marker);
            // });
            // markerOne.addListener('click', function() {
            //     self.handleChange(markerOne);
            // });
            // markerTwo.addListener('click', function() {
            //     self.handleChange(markerTwo);
            // });
            // markerThree.addListener('click', function() {
            //     self.handleChange(markerThree);
            // });

        });
    }

    render() {
        const mapStyle = {width: 700, height: 500,  border:'1px solid black' };
        const testData = [];

        testData.push({
            med: 'Fecha',
            res: 'hoy'
        });

        testData.push({
            med: 'Coordenadas',
            res: 'lat: -33.4569400, lng: -70.6482700'
        });

        testData.push({
            med: 'Intensidad',
            res: 8
        });


        const columns = [{
            Header: 'Medición',
            accessor: 'med',
            sortable: false
        }, {
            Header: 'Reporte',
            accessor: 'res',
            sortable: false
        }];

        return (
            <div>

                <ol>
                </ol>
                <div className='inline' ref="map" style={mapStyle}>
                    I should be a map!
                </div>
                <ol>
                    <div className='whiteSpaceSquare'>
                    </div>
                </ol>
                <ReactTable
                    defaultPageSize={5}
                    data={this.state.tableInfo}
                    columns={columns}
                />
                <div className='whitespace-fromtop'>
                </div>
                <div className='centerStat'>
                    Estado: Normal
                </div>
                  // <Websocket url='ws://localhost:8001' onOpen={this.handleOpen.bind(this)} onMessage={this.handleWS.bind(this)}/>

            </div>
        )
    }
}


export default MyMap;
