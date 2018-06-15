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
                coord: coordinate
            }];

            newData.push(appendage[0]);
        }

        this.handleChange(newData);
    }

    componentDidMount() {
        let current = new Date();

        fetch("http://wangulen.dgf.uchile.cl:17014/web/reports/?" +
            "start=2018-06-12T00%3A00&end=2018-06-16T00%3A00", {
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

        data = d || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = ',';
        lineDelimiter = '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += 'Intensidad, Fecha de Reporte, Latitud, Longitud';
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
                        minWidth: 500,
                        sortable: false
                    }
                ]
            }
        ];

        return (
            <ReactTable
                defaultPageSize={10}
                data={this.filterData(this.state['data'])}
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
