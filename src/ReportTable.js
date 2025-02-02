import React, { Component } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Button } from 'react-bootstrap';

import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MomentLocaleUtils, { formatDate, parseDate, } from 'react-day-picker/moment';

import 'moment/locale/es';

class ReportTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dateOne: undefined,
            dateTwo: undefined
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleDate1 = this.handleDate1.bind(this);
        this.handleDate2 = this.handleDate2.bind(this);
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

    handleDate1(date) {
        if (date === undefined){
            this.setState({dateOne: undefined});
        }
        else {
            let d = new Date(date);
            //remove time component from date
            let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            this.setState({dateOne: newDate});
        }
    }

    handleDate2(date) {
        if (date === undefined){
            this.setState({dateTwo: undefined});
        }
        else {
            let d = new Date(date);
            //remove time component from date
            let newDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            this.setState({dateTwo: newDate});
        }
    }

    filterByDate(data){
        let filteredData = [];
        let filterStart = this.state.dateOne;
        let filterEnd = this.state.dateTwo;

        function isHigherThanStart(date) {
            if (filterStart === undefined) {
                return true;
            }
            let parsedStart = Date.parse(filterStart);
            return parsedStart < date;
        }

        function isLowerThanEnd(date) {
            if (filterEnd === undefined) {
                return true;
            }
            let parsedEnd = Date.parse(filterEnd);
            return date < parsedEnd;
        }

        function isInRange(date, start, end) {
            let parsedDate = Date.parse(date);

            return isHigherThanStart(parsedDate) && isLowerThanEnd(parsedDate);
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
        let rowIntensity, date, longitude, latitude;

        for (let i = 0; i < reports.length; i++) {
            rowIntensity = Number(reports[i]['intensity']);
            date = reports[i]['created_on'].split("T")[0] + " " +
                   reports[i]['created_on'].split("T")[1].split(".")[0];
            latitude = reports[i]['coordinates']['latitude'];
            longitude = reports[i]['coordinates']['longitude'];

            let appendage = [{
                int: rowIntensity,
                fecha: date,
                lat: latitude,
                lon: longitude
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
        let fetchLink = "http://server-geoscopio.dgf.uchile.cl/web/reports/?start=" +
                            this.parseLink(100) + "&end=" +
                            this.parseLink(-4);

        let token = localStorage.getItem("token");
        token = "Token " + token;

        fetch(fetchLink, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
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
        let filename, link;
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

        const myColumns = [
            {
                Header: 'Datos de reportes',
                width: 700,
                columns: [
                    {
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Intensidad</div>
                        ),
                        accessor: 'int',
                        minWidth: 100
                    }, {
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Fecha de reporte</div>
                        ),
                        accessor: 'fecha',
                        minWidth: 200
                    }, {
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Latitud</div>
                        ),
                        accessor: 'lat',
                        sortable: false,
                        minWidth: 200
                    }, {
                        Header: () => (
                            <div
                                style={{
                                    textAlign: "left"
                                }}>Longitud</div>
                        ),
                        accessor: 'lon',
                        sortable: false,
                        minWidth: 200
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
                            <div>
                                <form className="form-inline">
                                    <div style={{
                                        margin: "20px auto 20px"
                                    }}>
                                        <div className="form-group">
                                            <label>Filtros:</label>
                                            <span style={{
                                                margin: "auto 5px auto 20px"
                                            }}>
                                                <label style={{
                                                    fontWeight: "normal"
                                                }}>Fecha inicial:</label>
                                            </span>
                                            <DayPickerInput
                                                formatDate={formatDate}
                                                parseDate={parseDate}
                                                format="DD/MM/YYYY"
                                                placeholder="DD/MM/YYYY"
                                                onDayChange={this.handleDate1}
                                                dayPickerProps={{
                                                    onDayClick: this.handleDate1,
                                                    selectedDays: this.state.dateOne,
                                                    localeUtils: MomentLocaleUtils,
                                                    locale: 'es'
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <span
                                                style={{
                                                    margin: "auto 5px auto 5px"
                                            }}>
                                                <label style={{
                                                    fontWeight: "normal"
                                                }}>Fecha final</label>
                                            </span>
                                        <DayPickerInput
                                            formatDate={formatDate}
                                            parseDate={parseDate}
                                            format="DD/MM/YYYY"
                                            placeholder="DD/MM/YYYY"
                                            onDayChange={this.handleDate2}
                                            dayPickerProps={{
                                                onDayClick: this.handleDate2,
                                                selectedDays: this.state.dateTwo,
                                                localeUtils: MomentLocaleUtils,
                                                locale: 'es'
                                            }}
                                        />
                                        </div>
                                        <div
                                            className="form-group"
                                            style={{
                                                float: "right"
                                            }}
                                        >
                                            <Button
                                                onClick={this.downloadAsCsv.bind(this, state.data)}
                                            >Descargar CSV</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            {makeTable()}
                        </div>
                    );
                }}
            </ReactTable>
        );
    }
}

export default ReportTable;
