import React, { Component } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css'

class ReportTable extends Component {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(newData) {
        this.setState({data: newData});
    }

    filterData(data){
        let filteredData = [];
        let filterType = this.props.filter;

        function isInRange(date, range) {
            return Date.parse(date) > range;
        }

        for (let i = 0; i < data.length; i++) {
            if (filterType === "Todos") {
                filteredData.push(data[i])
            }

            else if (filterType === "Últimas 24 horas" && isInRange(data[i].fecha,
                new Date().setDate(new Date().getDate() - 1))) {
                filteredData.push(data[i])
            }

            else if (filterType === "Última semana" && isInRange(data[i].fecha,
                new Date().setDate(new Date().getDate() - 7))) {
                filteredData.push(data[i])
            }

            else if (filterType === "Último mes" && isInRange(data[i].fecha,
                new Date().setDate(new Date().getDate() - 31))) {
                filteredData.push(data[i])
            }

            else if (filterType === "Últimos 6 meses" && isInRange(data[i].fecha,
                new Date().setDate(new Date().getDate() - 186))) {
                filteredData.push(data[i])
            }
        }
        return filteredData
    }

    parseReports(reports) {
        let newData = [];
        let rowIntensity, date, longitude, latitude, coordinate;

        for (let i = 0; i < reports.length; i++) {
            rowIntensity = Number(reports[i]['intensity']);
            date = reports[i]['created_on'].split("T")[0] + " " +
                   reports[i]['created_on'].split("T")[1].split(".")[0];
            latitude = reports[i]['coordinates']['latitude'];
            longitude = reports[i]['coordinates']['longitude'];
            coordinate = "Latitud: " + latitude + ", Longitud: " + longitude;

            let appendage = [{
                int: rowIntensity,
                fecha: date,
                coord: coordinate,
                mag: 4.2,
                damn: 420,
            }];

            newData.push(appendage[0]);
        }

        this.handleChange(newData);
    }

    componentDidMount() {

        fetch("http://wangulen.dgf.uchile.cl:17014/web/reports/", {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token 9ceaf0b154d346e8b7adb6242774dc38d16155af'
            }
        })
        .then(response => response.json())
        .then(reports => this.parseReports(reports));
    }

    render() {
        /*const table = [
            {
                "affected": 135048,
                "coordinates": {
                    "altitude": 46.301711149739475,
                    "latitude": 49.847848947163406,
                    "longitude": 4.976858504799841
                },
                "id": 4892855,
                "intensity": 10,
                "magnitude": 7.3,
                "timestamp": "1990-09-24 00:31:17"
            },
            {
                "affected": 555909,
                "coordinates": {
                    "altitude": 17.29544556370547,
                    "latitude": 19.89481540377749,
                    "longitude": 41.0228100979503
                },
                "id": 9998742,
                "intensity": 5,
                "magnitude": 4.6,
                "timestamp": "1954-11-15 16:32:27"
            },
            {
                "affected": 760090,
                "coordinates": {
                    "altitude": 46.78568728233826,
                    "latitude": 74.20056670062947,
                    "longitude": 51.08665851715557
                },
                "id": 488479,
                "intensity": 4,
                "magnitude": 8.3,
                "timestamp": "2018-04-18 07:59:22"
            },
            {
                "affected": 470458,
                "coordinates": {
                    "altitude": 48.0099555952289,
                    "latitude": 29.733803279277605,
                    "longitude": 78.1825990172893
                },
                "id": 6253784,
                "intensity": 10,
                "magnitude": 7.1,
                "timestamp": "2017-12-04 20:40:05"
            },
            {
                "affected": 183898,
                "coordinates": {
                    "altitude": 84.02901441276116,
                    "latitude": 39.124093424252614,
                    "longitude": 93.42960872755968
                },
                "id": 5315663,
                "intensity": 11,
                "magnitude": 8.8,
                "timestamp": "2018-04-12 22:49:13"
            },
            {
                "affected": 620658,
                "coordinates": {
                    "altitude": 0.1300064014216673,
                    "latitude": 37.82508233522262,
                    "longitude": 96.76806365184845
                },
                "id": 921413,
                "intensity": 8,
                "magnitude": 5.7,
                "timestamp": "1930-11-06 22:51:11"
            },
            {
                "affected": 218795,
                "coordinates": {
                    "altitude": 96.4842836072952,
                    "latitude": 61.20809268301374,
                    "longitude": 53.04717691976336
                },
                "id": 447056,
                "intensity": 12,
                "magnitude": 6.3,
                "timestamp": "2018-03-20 01:19:19"
            },
            {
                "affected": 175985,
                "coordinates": {
                    "altitude": 76.45866631801532,
                    "latitude": 79.24177033865469,
                    "longitude": 51.64266521798816
                },
                "id": 5304823,
                "intensity": 5,
                "magnitude": 4.5,
                "timestamp": "1991-07-02 12:36:24"
            },
            {
                "affected": 885904,
                "coordinates": {
                    "altitude": 74.1928787944906,
                    "latitude": 44.31866497901884,
                    "longitude": 63.7656296179591
                },
                "id": 170173,
                "intensity": 6,
                "magnitude": 6.1,
                "timestamp": "1993-05-08 02:34:04"
            },
            {
                "affected": 922778,
                "coordinates": {
                    "altitude": 82.68510270000888,
                    "latitude": 82.275873219827,
                    "longitude": 6.844882436540834
                },
                "id": 9056976,
                "intensity": 4,
                "magnitude": 8.3,
                "timestamp": "1943-11-15 05:11:09"
            }
        ];

        /*for (let i = 0; i < table.length; i++) {
            let appendage = [{
                int: table[i].intensity,
                fecha: table[i].timestamp,
                coord: 'lat: ' + table[i].coordinates.latitude + ', lng: ' + table[i].coordinates.longitude,
                mag: table[i].magnitude,
                damn: table[i].affected,
            }];
            this.data.push(appendage[0]);
        }*/

        const myColumns = [
            {
                Header: 'Datos de reportes',
                columns: [
                    {
                        Header: 'Intensidad',
                        accessor: 'int',
                        width: 100
                    }, {
                        Header: 'Fecha de reporte',
                        accessor: 'fecha',
                        width: 200
                    }, {
                        Header: 'Coordenadas',
                        accessor: 'coord',
                        sortable: false
                    }
                ]
            },
            {
                Header: 'Datos de sismos',
                columns: [
                    {
                        Header: 'Magnitud',
                        accessor: 'mag',
                        width: 100
                    }, {
                        Header: 'Damnificados',
                        accessor: 'damn',
                        width: 200
                    }
                ]
            }
        ];

        return (
            <ReactTable
                defaultPageSize={10}
                data={this.filterData(this.state['data'])}
                columns={myColumns}
            />
        );
    }
}

export default ReportTable;
