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

    filterByDate(data){
        let filteredData = [];
        let filterStart = this.props.filterStart;
        let filterEnd = this.props.filterEnd;

        function isInRange(date, start, end) {
            let parsedDate = Date.parse(date);
            if (start === undefined) {
                return Date.parse(date) < Date.parse(end);
            }
            if (end === undefined) {
                return Date.parse(date) > Date.parse(start);
            }

            let parsedStart = Date.parse(start);
            let parsedEnd = Date.parse(end);
            if (parsedStart > parsedEnd) {
                return false;
            }
            return parsedStart < parsedDate && parsedDate < parsedEnd;
        }

        for (let i = 0; i < data.length; i++) {
            if (isInRange(data[i].fecha, filterStart, filterEnd)) {
                filteredData.push(data[i]);
            }
        }
        return filteredData;


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
                coord: coordinate
            }];

            newData.push(appendage[0]);
        }

        this.handleChange(newData);
    }

    //Delay viene en minutos
    parseLink(delay) {
        let current = new Date();

        current.setMinutes(current.getMinutes() - delay);

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

    componentDidMount() {
        let fetchLink = "http://wangulen.dgf.uchile.cl:17014/web/reports/?start=" +
                            this.parseLink(15) + "&end=" +
                            this.parseLink(0);

        fetch(fetchLink, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token 3a79acb1431d2118960e50e5d09bdb5bc58ee2af'
            }
        })
        .then(response => response.json())
        .then(reports => this.parseReports(reports));
    }

    convertDataToCsv(d) {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;
        let headers = 'Intensidad,Fecha de Reporte,Latitud,Longitud';

        data = d || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = ',';
        lineDelimiter = '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += headers;
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {

                let thingToAdd = '';

                if (ctr > 0) result += columnDelimiter;

                if (key === 'coord') {
                    let re = /Latitud: (-?\d{1,3}.\d{10}), Longitud: (-?\d{1,3}.\d{10})/;
                    let lat = re.exec(item[key]);
                    thingToAdd += lat[1] + columnDelimiter + lat[2];
                }

                else {
                    thingToAdd += item[key];
                }
                result += thingToAdd;
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    downloadAsCsv(d) {
        let data, filename, link;
        let csv = this.convertDataToCsv(d);
        if (csv == null) return;

        filename = 'reportes.csv';

        let blob = new Blob([csv], {type: "text/csv;charset=utf-8;"});

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, filename);
        }
        else {
            link = document.createElement('a');
            if(link.download !== undefined) {
                let url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            }
        }

    }

    render() {
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
                width: 700,
                columns: [
                    {
                        //Header: 'Intensidad',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Intensidad</div>
                        ),
                        accessor: 'int',
                        minWidth: 100
                    }, {
                        //Header: 'Fecha de reporte',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Fecha de reporte</div>
                        ),
                        accessor: 'fecha',
                        minWidth: 200
                    }, {
                        //Header: 'Coordenadas',
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Coordenadas</div>
                        ),
                        accessor: 'coord',
                        sortable: false,
                        minWidth: 500
                    }
                ]
            }
        ];

        return (
            <ReactTable
                defaultPageSize={10}
                data={this.filterByDate(this.state['data'])}
                columns={myColumns}
                previousText={'Anterior'}
                nextText={'Siguiente'}
                loadingText={'Cargando...'}
                noDataText={'No se encontraron filas'}
                pageText={'Página'}
                ofText={'de'}
                rowsText={'filas'}
            >
                {(state, makeTable, instance) => {
                    return (
                        <div>
                            {makeTable()}
                            <button onClick={this.downloadAsCsv.bind(this, state.data)}>Descargar CSV</button>
                        </div>
                    );
                }}
            </ReactTable>
        );
    }
}

export default ReportTable;
